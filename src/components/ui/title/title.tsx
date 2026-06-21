import styles from './title.module.scss';

export const Title = () => {
  return (
    <>
      <h1 className={styles.title}>Контроль посещаемости</h1>
      <p className={styles.description}>
        Войдите в систему для отметки или просмотра таблеток
      </p>
    </>
  );
};