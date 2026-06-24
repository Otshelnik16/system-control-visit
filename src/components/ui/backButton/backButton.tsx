import styles from './backButton.module.scss';

interface BackButtonProps {
  onClick: () => void;
  children?: React.ReactNode;
}

export const BackButton = ({ onClick, children = '← Назад' }: BackButtonProps) => {
  return (
    <button className={styles.backButton} onClick={onClick}>
      {children}
    </button>
  );
};