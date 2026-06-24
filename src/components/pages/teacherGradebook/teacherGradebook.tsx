import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getUser } from '../../../utils/auth';
import { BackButton } from '../../ui/backButton/backButton';
import { FilterButton } from '../../ui/filterButton/filterButton';
import { StartPoll } from '../../ui/startPoll/startPoll';
import { GradeSelect } from '../../ui/gradeSelect/gradeSelect';
import { StatusSelect } from '../../ui/statusSelect/statusSelect';
import { DownloadButton } from '../../ui/downloadButton/downloadButton';
import { ExitButton } from '../../ui/exitButton/exitButton';
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
  groupId: number;
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
  const [activeFilter, setActiveFilter] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentsRes = await fetch(`/api/students?groupId=${groupId}`);
        const studentsData = await studentsRes.json();
        setStudents(studentsData);

        const discRes = await fetch(`/api/disciplines?groupId=${groupId}`);
        const discData = await discRes.json();
        setDisciplines(discData);

        if (discData.length > 0) {
          setSelectedDiscipline(discData[0].id);
        }

        const attRes = await fetch('/api/attendance');
        const attData = await attRes.json();
        setAttendance(attData);

        const pollRes = await fetch(
          `/api/polls?disciplineId=${discData[0]?.id}&active=true`
        );
        const pollData = await pollRes.json();
        setIsPollActive(pollData.length > 0);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [groupId]);

  const handleBack = () => navigate('/teacher');

  const handleStartPoll = async () => {
    try {
      const response = await fetch('/api/polls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          disciplineId: selectedDiscipline,
          teacherId: 1,
          groupId: Number(groupId),
          startedAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
          active: true,
          title: `Опрос ${new Date().toLocaleDateString()}`,
        }),
      });

      if (response.ok) {
        setIsPollActive(true);
        alert('✅ Опрос запущен! Действует 10 минут.');
      }
    } catch (error) {
      console.error('Ошибка запуска опроса:', error);
      alert('❌ Не удалось запустить опрос');
    }
  };

  const handleGradeChange = async (studentId: number, value: string) => {
    const record = getAttendanceForStudent(studentId);
    if (record) {
      await fetch(`/api/attendance/${record.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grade: Number(value) }),
      });
      const attRes = await fetch('/api/attendance');
      const attData = await attRes.json();
      setAttendance(attData);
    }
  };

  const handleStatusChange = async (studentId: number, value: string) => {
    const record = getAttendanceForStudent(studentId);
    if (record) {
      await fetch(`/api/attendance/${record.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: value }),
      });
      const attRes = await fetch('/api/attendance');
      const attData = await attRes.json();
      setAttendance(attData);
    }
  };

  const getAttendanceForStudent = (studentId: number) => {
    return attendance.find(
      (record) =>
        record.studentId === studentId &&
        record.disciplineId === selectedDiscipline &&
        record.date === selectedDate
    );
  };

  if (loading) return <div className={styles.loading}>Загрузка...</div>;

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

          <DownloadButton onClick={() => alert('Скачивание отчёта...')} />
        </div>

        {/* ОПРОС */}
        <div className={styles.pollSection}>
          <StartPoll 
            onClick={handleStartPoll} 
            isActive={isPollActive} 
          />
          {isPollActive && (
            <span className={styles.pollActive}>Опрос запущен! Студенты могут подтверждать присутствие.</span>
          )}
        </div>

        {/* ТАБЛИЦА */}
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>№</th>
                <th>ФИО</th>
                <th>Наименование дисциплины</th>
                <th>Отметка</th>
                <th>Статус посещения</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan={5} className={styles.emptyRow}>
                    В этой группе нет студентов
                  </td>
                </tr>
              ) : (
                students.map((student, index) => {
                  const record = getAttendanceForStudent(student.id);
                  return (
                    <tr key={student.id}>
                      <td>{index + 1}</td>
                      <td>{student.fullName}</td>
                      <td>
                        {disciplines.find((d) => d.id === selectedDiscipline)?.name || '—'}
                      </td>
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
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};