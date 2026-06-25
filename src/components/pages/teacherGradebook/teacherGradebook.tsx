import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getUser } from '../../../utils/auth';
import { BackButton } from '../../ui/backButton/backButton';
import { FilterButton } from '../../ui/filterButton/filterButton';
import { StartPoll } from '../../ui/startPoll/startPoll';
import { GradeSelect } from '../../ui/gradeSelect/gradeSelect';
import { StatusSelect } from '../../ui/statusSelect/statusSelect';
import { DownloadButton } from '../../ui/downloadButton/downloadButton';
import { ExitButton } from '../../ui/exitButton/exitButton';
import { generateDailyReport, generateWeeklyReport, generateMonthlyReport } from '../../../services/reportService';
import styles from './teacherGradebook.module.scss';
import iconImg from '../../../assets/icone.png';

interface Student {
  id: number;
  fullName: string;
  groupId: number;
}

interface Discipline {
  id: number;
  name: string;
}

interface AttendanceRecord {
  id: number;
  studentId: number;
  disciplineId: number;
  date: string;
  status: string;
  grade: number | null;
  reason: string;
}

type FilterType = 'daily' | 'weekly' | 'monthly';

export const TeacherGradebook = () => {
  const navigate = useNavigate();
  const { groupId } = useParams<{ groupId: string }>();
  const user = getUser();

  const [students, setStudents] = useState<Student[]>([]);
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDiscipline, setSelectedDiscipline] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [isPollActive, setIsPollActive] = useState(false);
  const [pollExpiresAt, setPollExpiresAt] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>('daily');
  const [groupName, setGroupName] = useState<string>('');

  // ===== ФИЛЬТРАЦИЯ ДАННЫХ =====
  const filteredAttendance = useMemo(() => {
    if (!selectedDiscipline) return [];

    const date = new Date(selectedDate);

    let filtered = attendance.filter(
      (record) => record.disciplineId === selectedDiscipline
    );

    switch (activeFilter) {
      case 'daily':
        filtered = filtered.filter((record) => record.date === selectedDate);
        break;

      case 'weekly': {
        const dayOfWeek = date.getDay();
        const startDate = new Date(date);
        startDate.setDate(date.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        filtered = filtered.filter((record) => {
          const recordDate = new Date(record.date);
          return recordDate >= startDate && recordDate <= endDate;
        });
        break;
      }

      case 'monthly': {
        filtered = filtered.filter((record) => {
          const recordDate = new Date(record.date);
          return recordDate.getMonth() === date.getMonth() &&
                 recordDate.getFullYear() === date.getFullYear();
        });
        break;
      }

      default:
        break;
    }

    return filtered;
  }, [attendance, selectedDiscipline, selectedDate, activeFilter]);

  // ===== СТАТИСТИКА ДЛЯ СТУДЕНТА =====
  const getStudentStats = (studentId: number) => {
    const records = filteredAttendance.filter((a) => a.studentId === studentId);
    const total = records.length;
    const valid = records.filter((r) => r.status === 'УП').length;
    const invalid = records.filter((r) => r.status === 'Н').length;
    return { total, valid, invalid };
  };

  const getAttendanceForStudent = (studentId: number) => {
    return filteredAttendance.find(
      (record) =>
        record.studentId === studentId &&
        record.disciplineId === selectedDiscipline &&
        record.date === selectedDate
    );
  };

 // ===== ЗАГРУЗКА =====
useEffect(() => {
  const fetchData = async () => {
    try {
      const groupRes = await fetch(`/api/groups/${groupId}`);
      const groupData = await groupRes.json();
      setGroupName(groupData.name);

      const studentsRes = await fetch(`/api/students?groupId=${groupId}`);
      const studentsData = await studentsRes.json();
      setStudents(studentsData);

      const discRes = await fetch('/api/disciplines');
      const discData = await discRes.json();
      const normalizedDisc = discData.map((d: any) => ({
        ...d,
        id: Number(d.id),
      }));
      setDisciplines(normalizedDisc);

      if (normalizedDisc.length > 0) {
        setSelectedDiscipline(normalizedDisc[0].id);
      }

      const attRes = await fetch('/api/attendance');
      const attData = await attRes.json();
      setAttendance(attData);

      // ===== ПРОВЕРКА АКТИВНЫХ ОПРОСОВ =====
      if (normalizedDisc.length > 0) {
        const pollRes = await fetch(
          `/api/polls?disciplineId=${normalizedDisc[0].id}&active=true`
        );
        const pollData = await pollRes.json();
        
        if (pollData.length > 0) {
          const poll = pollData[0];
          const now = new Date().getTime();
          const expiresAt = new Date(poll.expiresAt).getTime();
          
          // ✅ Если опрос истёк — обновляем его статус
          if (now > expiresAt) {
            await fetch(`/api/polls/${poll.id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ active: false }),
            });
            setIsPollActive(false);
            setPollExpiresAt(null);
          } else {
            // ✅ Опрос активен
            setIsPollActive(true);
            setPollExpiresAt(poll.expiresAt);
          }
        } else {
          setIsPollActive(false);
          setPollExpiresAt(null);
        }
      }
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [groupId]);
  // ===== ОБРАБОТЧИКИ =====
  const handleBack = () => navigate('/teacher');

  const handleStartPoll = async () => {
    try {
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
      const response = await fetch('/api/polls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          disciplineId: selectedDiscipline,
          teacherId: 1,
          groupId: Number(groupId),
          startedAt: new Date().toISOString(),
          expiresAt: expiresAt,
          active: true,
          title: `Опрос ${new Date().toLocaleDateString()}`,
        }),
      });

      if (response.ok) {
        setIsPollActive(true);
        setPollExpiresAt(expiresAt);
        alert('✅ Опрос запущен! Действует 10 минут.');
      }
    } catch (error) {
      console.error('Ошибка запуска опроса:', error);
      alert('❌ Не удалось запустить опрос');
    }
  };

  const handleStopPoll = async () => {
    try {
      const pollRes = await fetch(`/api/polls?disciplineId=${selectedDiscipline}&active=true`);
      const polls = await pollRes.json();
      const activePoll = polls[0];

      if (activePoll) {
        await fetch(`/api/polls/${activePoll.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ active: false }),
        });
        setIsPollActive(false);
        setPollExpiresAt(null);
        alert('✅ Опрос завершён');
      }
    } catch (error) {
      console.error('Ошибка завершения опроса:', error);
      alert('❌ Не удалось завершить опрос');
    }
  };

  const handlePollExpired = () => {
    setIsPollActive(false);
    setPollExpiresAt(null);
    alert('⏰ Время опроса истекло!');
  };

  // ===== ОБРАБОТЧИКИ ДЛЯ ОТМЕТОК =====
  const handleGradeChange = async (studentId: number, value: string) => {
    const record = getAttendanceForStudent(studentId);

    if (record) {
      await fetch(`/api/attendance/${record.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grade: Number(value) }),
      });
    } else {
      await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          disciplineId: selectedDiscipline,
          date: selectedDate,
          status: 'П',
          grade: Number(value),
          reason: '',
        }),
      });
    }

    const attRes = await fetch('/api/attendance');
    const attData = await attRes.json();
    setAttendance(attData);
  };

  const handleStatusChange = async (studentId: number, value: string) => {
    const record = getAttendanceForStudent(studentId);

    if (record) {
      await fetch(`/api/attendance/${record.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: value }),
      });
    } else {
      await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          disciplineId: selectedDiscipline,
          date: selectedDate,
          status: value,
          grade: null,
          reason: '',
        }),
      });
    }

    const attRes = await fetch('/api/attendance');
    const attData = await attRes.json();
    setAttendance(attData);
  };

// ===== СКАЧИВАНИЕ ОТЧЁТОВ =====
const handleDownloadReport = async () => {
  try {
    let blob: Blob;

    const discipline = disciplines.find((d) => d.id === selectedDiscipline) || null;

    switch (activeFilter) {
      case 'daily':
        blob = await generateDailyReport(students, filteredAttendance, discipline, selectedDate, groupName);
        break;

      case 'weekly': {
        const date = new Date(selectedDate);
        const dayOfWeek = date.getDay();
        const startDate = new Date(date);
        startDate.setDate(date.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        blob = await generateWeeklyReport(
          students,
          filteredAttendance,
          groupName,
          startDate.toISOString().split('T')[0],
          endDate.toISOString().split('T')[0]
        );
        break;
      }

      case 'monthly': {
        const date = new Date(selectedDate);
        const month = date.toLocaleString('ru', { month: 'long' });
        const year = date.getFullYear();
        blob = await generateMonthlyReport(students, filteredAttendance, groupName, month, String(year));
        break;
      }

      default:
        blob = await generateDailyReport(students, filteredAttendance, discipline, selectedDate, groupName);
        break;
    }

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    const fileNames = {
      daily: `Ежедневный_отчет_${selectedDate}.docx`,
      weekly: `Еженедельный_отчет_${selectedDate}.docx`,
      monthly: `Ежемесячный_отчет_${selectedDate}.docx`,
    };
    link.download = fileNames[activeFilter] || `Отчет_${selectedDate}.docx`;
    document.body.appendChild(link);
    link.click();
    
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    }, 100);
    
  } catch (error) {
    console.error('Ошибка создания отчёта:', error);
    alert('❌ Не удалось создать отчёт');
  }
};
  // ===== РЕНДЕР =====
  if (loading) return <div className={styles.loading}>Загрузка...</div>;

  const getTableHeaders = () => {
    if (activeFilter === 'daily') {
      return (
        <tr>
          <th>№</th>
          <th>ФИО</th>
          <th>Отметка</th>
          <th>Статус посещения</th>
        </tr>
      );
    } else {
      return (
        <tr>
          <th>№</th>
          <th>ФИО</th>
          <th>Всего</th>
          <th>Уважительные</th>
          <th>Неуважительные</th>
        </tr>
      );
    }
  };

  const getTableRows = () => {
    if (activeFilter === 'daily') {
      return students.map((student, index) => {
        const record = getAttendanceForStudent(student.id);
        return (
          <tr key={student.id}>
            <td>{index + 1}</td>
            <td>{student.fullName}</td>
            <td>
              <GradeSelect
                value={record?.grade || ''}
                onChange={(val) => handleGradeChange(student.id, val)}
              />
            </td>
            <td>
              <StatusSelect
                value={record?.status || ''}
                onChange={(val) => handleStatusChange(student.id, val)}
              />
            </td>
          </tr>
        );
      });
    } else {
      return students.map((student, index) => {
        const stats = getStudentStats(student.id);
        return (
          <tr key={student.id}>
            <td>{index + 1}</td>
            <td>{student.fullName}</td>
            <td>{stats.total}</td>
            <td>{stats.valid}</td>
            <td>{stats.invalid}</td>
          </tr>
        );
      });
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        {/* ШАПКА */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <img src={iconImg} alt="Логотип" className={styles.icon} />
            <div className={styles.headerText}>
              <h1>Посещаемость</h1>
              <span className={styles.group}>Мои группы</span>
            </div>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.teacherInfo}>
              <p className={styles.teacherName}>{user?.fullName || 'Преподаватель'}</p>
              <span className={styles.teacherRole}>преподаватель</span>
            </div>
            <ExitButton onClick={() => navigate('/login')} />
          </div>
        </div>

        <BackButton onClick={handleBack}>← Назад к списку групп</BackButton>

        {/* ФИЛЬТРЫ */}
        <div className={styles.filters}>
          <FilterButton
            active={activeFilter === 'daily'}
            onClick={() => setActiveFilter('daily')}
          >
            Ежедневный
          </FilterButton>
          <FilterButton
            active={activeFilter === 'weekly'}
            onClick={() => setActiveFilter('weekly')}
          >
            Еженедельный
          </FilterButton>
          <FilterButton
            active={activeFilter === 'monthly'}
            onClick={() => setActiveFilter('monthly')}
          >
            Ежемесячный
          </FilterButton>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>ДАТА</label>
            <input
              type="date"
              className={styles.dateInput}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>ДИСЦИПЛИНА</label>
            <select
              className={styles.disciplineSelect}
              value={selectedDiscipline || ''}
              onChange={(e) => setSelectedDiscipline(Number(e.target.value))}
            >
              {disciplines.map((disc) => (
                <option key={disc.id} value={disc.id}>
                  {disc.name}
                </option>
              ))}
            </select>
          </div>

          <DownloadButton onClick={handleDownloadReport} />
        </div>

        {/* ОПРОС */}
        <div className={styles.pollSection}>
          <StartPoll
            onClick={isPollActive ? handleStopPoll : handleStartPoll}
            isActive={isPollActive}
            expiresAt={pollExpiresAt}
            onExpire={handlePollExpired}
          />
        </div>

        {/* ТАБЛИЦА */}
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>{getTableHeaders()}</thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan={activeFilter === 'daily' ? 4 : 5} className={styles.emptyRow}>
                    В этой группе нет студентов
                  </td>
                </tr>
              ) : (
                getTableRows()
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};