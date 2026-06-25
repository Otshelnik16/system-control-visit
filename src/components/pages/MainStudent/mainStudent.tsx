import { useNavigate } from 'react-router-dom';
import { getUser } from '../../../utils/auth';
import { ViewButton } from '../../ui/viewButton/viewButton';
import { ExitButton } from '../../ui/exitButton/exitButton';
import styles from './mainStudent.module.scss';
import iconImg from '../../../assets/icone.png';

export const MainStudent = () => {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    navigate('/login');
  };

  const disciplines = [
    { id: 1, name: 'Основы 3Д моделирования в Blender' },
    { id: 2, name: 'Основы программирования' },
    { id: 3, name: 'Веб-дизайн на Figma' },
    { id: 4, name: 'Создание БД в 1С' },
  ];

  const handleView = (disciplineId: number) => {
    navigate(`/discipline/${disciplineId}`);
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
            <ExitButton onClick={handleLogout} />
          </div>
        </div>

        {/* ЗАГОЛОВКИ */}
        <div className={styles.sectionHeader}>
          <span className={styles.disciplineTitle}>Название дисциплины</span>
          <span className={styles.attendanceTitle}>Моя посещаемость</span>
        </div>

        {/* СПИСОК ДИСЦИПЛИН */}
        <div className={styles.disciplines}>
          <ul className={styles.list}>
            {disciplines.map((discipline) => (
              <li key={discipline.id} className={styles.item}>
                <span className={styles.disciplineName}>{discipline.name}</span>
                <ViewButton onClick={() => handleView(discipline.id)}>
                  Посмотреть
                </ViewButton>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};