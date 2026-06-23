import { useNavigate } from 'react-router-dom';
import { getUser } from '../../../utils/auth';
import styles from './mainTeacher.module.scss';
import iconImg from '../../../assets/icone.png';

export const MainTeacher = () => {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    navigate('/login');
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
            <button className={styles.exit} onClick={handleLogout}>
              Выйти
            </button>
          </div>
        </div>

        {/* ГРУППЫ */}
        <div className={styles.groups}>
          <h2>Мои группы</h2>
          <div className={styles.groupList}>
            <div className={styles.groupCard}>
              <h3>ИС-21</h3>
              <p>Группа ИС-21</p>
              <p>Студентов: 9</p>
              <p>Дисциплин: 4</p>
              <button className={styles.open}>Открыть табель</button>
            </div>
            <div className={styles.groupCard}>
              <h3>ИС-22</h3>
              <p>Группа ИС-22</p>
              <p>Студентов: 0</p>
              <p>Дисциплин: 0</p>
              <button className={styles.open}>Открыть табель</button>
            </div>
            <div className={styles.groupCard}>
              <h3>КС-21</h3>
              <p>Группа КС-21</p>
              <p>Студентов: 0</p>
              <p>Дисциплин: 0</p>
              <button className={styles.open}>Открыть табель</button>
            </div>
            <div className={styles.groupCard}>
              <h3>КС-22</h3>
              <p>Группа КС-22</p>
              <p>Студентов: 0</p>
              <p>Дисциплин: 0</p>
              <button className={styles.open}>Открыть табель</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};