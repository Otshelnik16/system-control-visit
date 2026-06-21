import { useNavigate } from 'react-router-dom';
import styles from './mainTeacher.module.scss';

export const MainTeacher = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className={styles.container}>
      {/* ШАПКА */}
      <div className={styles.header}>
        <h1>Посещаемость</h1>
        <span className={styles.group}>Мои группы</span>
      </div>

      {/* КАРТОЧКА ПРЕПОДАВАТЕЛЯ */}
      <div className={styles.card}>
        <p className={styles.name}>Микулин Андрей Николаевич</p>
        <span className={styles.status}>Преподаватель</span>
      </div>

      {/* КНОПКА ВЫЙТИ */}
      <button className={styles.logout} onClick={handleLogout}>
        Выйти
      </button>

      {/* СПИСОК ГРУПП */}
      <div className={styles.groups}>
        <h2>Мои группы</h2>
        <div className={styles.groupList}>
          {/* КАРТОЧКА ГРУППЫ 1 */}
          <div className={styles.groupCard}>
            <h3>IC-22</h3>
            <p>Группа ИС-22</p>
            <p>Студенты: 22</p>
            <p>Дисциплины: 4</p>
            <button className={styles.open}>Открыть табель</button>
          </div>

          {/* КАРТОЧКА ГРУППЫ 2 */}
          <div className={styles.groupCard}>
            <h3>IC-21</h3>
            <p>Группа ИС-21</p>
            <p>Студенты: 24</p>
            <p>Дисциплины: 5</p>
            <button className={styles.open}>Открыть табель</button>
          </div>
        </div>
      </div>
    </div>
  );
};