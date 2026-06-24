import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getUser } from '../../../utils/auth';
import { getDiscipline, getAttendanceByDisciplineAndStudent } from '../../../api/services';
import { STATUS_LABELS } from '../../../constants';
import { ConfirmAttendance } from '../../ui/confirmAttendance/confirmAttendance';
import styles from './discipline.module.scss';
import iconImg from '../../../assets/icone.png';

interface DisciplineType {
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

export const Discipline = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const user = getUser();

  const [discipline, setDiscipline] = useState<DisciplineType | null>(null);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) {
          console.error('❌ Пользователь не авторизован');
          setLoading(false);
          return;
        }

        const discData = await getDiscipline(Number(id));
        setDiscipline(discData);

        const records = await getAttendanceByDisciplineAndStudent(
          Number(id),
          Number(user.id)
        );
        setAttendance(records);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user]);

  const handleBack = () => navigate('/student');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'P': return styles.statusPresent;
      case 'N': return styles.statusAbsent;
      case 'L': return styles.statusLate;
      case 'Б': return styles.statusSick;
      default: return styles.statusDefault;
    }
  };

  if (loading) return <div className={styles.loading}>Загрузка...</div>;
  if (!user) return <div className={styles.error}>Вы не авторизованы</div>;
  if (!discipline) return <div className={styles.error}>Дисциплина не найдена</div>;

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
                        {STATUS_LABELS[record.status] || record.status}
                      </span>
                    </td>
                    <td>{record.reason || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* КАРТОЧКА СТУДЕНТА + КНОПКА ПОДТВЕРЖДЕНИЯ */}
        <div className={styles.studentCard}>
          <div className={styles.studentInfoBottom}>
            <p className={styles.studentNameBottom}>{user?.fullName || 'Студент'}</p>
            <span className={styles.studentRoleBottom}>студент</span>
          </div>

          {/* 👇 КНОПКА ПОДТВЕРДИТЬ ПРИСУТСТВИЕ */}
          <ConfirmAttendance
            disciplineId={Number(id)}
            studentId={Number(user.id)}
            groupId={Number(user.groupId)}
          />
        </div>
      </div>
    </div>
  );
};