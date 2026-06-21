import iconImg from '../../../assets/icone.png';
import styles from './logo.module.scss';

export const Logo = () => {
  return <img src={iconImg} alt="Логотип" className={styles.logo} />;
};