import styles from './mainStudent.module.scss';

export const MainStudent = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Посещаемость</h1>
        <span className={styles.group}>Моя группа</span>
      </div>

      <div className={styles.card}>
        <p className={styles.name}>Михайлов Дмитрий Сергеевич</p>
        <span className={styles.status}>студент</span>
      </div>

      <button className={styles.logout}>Выйти</button>

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
  );
};