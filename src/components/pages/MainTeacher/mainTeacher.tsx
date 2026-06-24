import { useNavigate } from 'react-router-dom';
import { getUser } from '../../../utils/auth';
import { OpenGradebook } from '../../ui/openGradebook/openGradebook';
import { ExitButton } from '../../ui/exitButton/exitButton';
import styles from './mainTeacher.module.scss';
import iconImg from '../../../assets/icone.png';

export const MainTeacher = () => {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    navigate('/login');
  };

  // Данные групп
  const groups = [
    { id: 2, name: 'ИС-21', fullName: 'Группа ИС-21', students: 9, disciplines: 4 },
    { id: 1, name: 'ИС-22', fullName: 'Группа ИС-22', students: 0, disciplines: 0 },
    { id: 3, name: 'КС-21', fullName: 'Группа КС-21', students: 0, disciplines: 0 },
    { id: 4, name: 'КС-22', fullName: 'Группа КС-22', students: 0, disciplines: 0 },
  ];

  const handleOpenGradebook = (groupId: number) => {
    navigate(`/gradebook/${groupId}`);
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
            <ExitButton onClick={handleLogout} />
          </div>
        </div>

        {/* ГРУППЫ */}
        <div className={styles.groups}>
          <h2>Мои группы</h2>
          <div className={styles.groupList}>
            {groups.map((group) => (
              <div key={group.id} className={styles.groupCard}>
                <h3>{group.name}</h3>
                <p>{group.fullName}</p>
                <p>Студентов: {group.students}</p>
                <p>Дисциплин: {group.disciplines}</p>
                <OpenGradebook onClick={() => handleOpenGradebook(group.id)} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};