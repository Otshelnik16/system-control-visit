import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getUser } from '../../../utils/auth';
import styles from './discipline.module.scss';
import iconImg from '../../../assets/icone.png';

interface AttendanceRecord {
  id: number;
  studentId: number;
  disciplineId: number;
  date: string;
  status: string;
  grade: number | null;
  reason: string;
}

interface Discipline {
  id: number;
  name: string;
  groupId: number;
}

export const Discipline = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const user = getUser();

  const [discipline, setDiscipline] = useState<Discipline | null>(null);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Получаем данные дисциплины
        const discRes = await fetch(`/api/disciplines/${id}`);
        const discData = await discRes.json();
        setDiscipline(discData);

        // 2. Получаем ВСЮ посещаемость
        const attRes = await fetch(`/api/attendance`);
        const allAtt = await attRes.json();

        // 3. Фильтруем по disciplineId И studentId
        const filtered = allAtt.filter(
          (record: AttendanceRecord) =>
            record.disciplineId === Number(id) &&
            record.studentId === Number(user?.id)
        );
        setAttendance(filtered);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user?.id]);

  const handleBack = () => {
    navigate('/student');
  };

  const handleConfirm = () => {
    alert('Функция подтверждения в разработке');
  };

  if (loading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  if (!discipline) {
    return <div className={styles.error}>Дисциплина не найдена</div>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'P': return styles.statusPresent;
      case 'N': return styles.statusAbsent;
      case 'L': return styles.statusLate;
      case 'Б': return styles.statusSick;
      default: return styles.statusDefault;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'P': return 'Присутствовал';
      case 'N': return 'Не присутствовал';
      case 'L': return 'Опоздал';
      case 'Б': return 'По болезни';
      default: return 'Неизвестно';
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
              <span className={styles.group}>Моя группа</span>
            </div>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.studentInfo}>
              <p className={styles.studentName}>{user?.fullName || 'Студент'}</p>
              <span className={styles.studentRole}>студент</span>
            </div>
            <button className={styles.exit} onClick={() => navigate('/login')}>
              Выйти
            </button>
          </div>
        </div>

        {/* НАЗАД И НАЗВАНИЕ */}
        <button className={styles.backBtn} onClick={handleBack}>
          ← Назад к списку дисциплин
        </button>

        <h2 className={styles.disciplineTitle}>{discipline.name}</h2>

        {/* ТАБЛИЦА */}
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Дата</th>
                <th>Статус</th>
                <th>Замечания</th>
              </tr>
            </thead>
            <tbody>
              {attendance.length === 0 ? (
                <tr>
                  <td colSpan={3} className={styles.emptyRow}>
                    Нет записей о посещаемости
                  </td>
                </tr>
              ) : (
                attendance.map((record) => (
                  <tr key={record.id}>
                    <td>{record.date}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${getStatusColor(record.status)}`}>
                        {getStatusText(record.status)}
                      </span>
                    </td>
                    <td>{record.reason || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* КАРТОЧКА СТУДЕНТА */}
        <div className={styles.studentCard}>
          <div className={styles.studentInfoBottom}>
            <p className={styles.studentNameBottom}>{user?.fullName || 'Студент'}</p>
            <span className={styles.studentRoleBottom}>студент</span>
          </div>
          <button className={styles.confirmBtn} onClick={handleConfirm}>
            Подтвердить присутствие
          </button>
        </div>
      </div>
    </div>
  );
};