import { useNavigate } from 'react-router-dom';
import styles from './mainStudent.module.scss';
import iconImg from '../../../assets/icone.png';

export const MainStudent = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        {/* ШАПКА */}
        <div className={styles.header}>
          {/* ЛЕВАЯ ЧАСТЬ: ИКОНКА + ПОСЕЩАЕМОСТЬ + МОЯ ГРУППА */}
          <div className={styles.headerLeft}>
            <img src={iconImg} alt="Логотип" className={styles.icon} />
            <div className={styles.headerText}>
              <h1>Посещаемость</h1>
              <span className={styles.group}>Моя группа</span>
            </div>
          </div>

          {/* ПРАВАЯ ЧАСТЬ: ФИО + СТУДЕНТ + КНОПКА ВЫЙТИ */}
          <div className={styles.headerRight}>
            <div className={styles.studentInfo}>
              <p className={styles.studentName}>Михайлов Дмитрий Сергеевич</p>
              <span className={styles.studentRole}>студент</span>
            </div>
            <button className={styles.exit} onClick={handleLogout}>
              Выйти
            </button>
          </div>
        </div>

        {/* СПИСОК ДИСЦИПЛИН */}
        <div className={styles.disciplines}>
          <h2>Моя посещаемость</h2>
          <ul className={styles.list}>
            <li className={styles.item}>
              <span>Основы 3Д моделирования в Blender</span>
              <button className={styles.view}>Посмотреть</button>
            </li>
            <li className={styles.item}>
              <span>Основы программирования</span>
              <button className={styles.view}>Посмотреть</button>
            </li>
            <li className={styles.item}>
              <span>Веб-дизайн на Figma</span>
              <button className={styles.view}>Посмотреть</button>
            </li>
            <li className={styles.item}>
              <span>Создание БД в 1С</span>
              <button className={styles.view}>Посмотреть</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};