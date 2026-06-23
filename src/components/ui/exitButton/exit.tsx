import { useNavigate } from 'react-router-dom';
import styles from './exit.module.scss';

export const Exit = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <button className={styles.exit} onClick={handleLogout}>
      Выйти
    </button>
  );
};