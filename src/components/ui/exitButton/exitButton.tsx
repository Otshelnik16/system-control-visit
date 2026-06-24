import styles from './exitButton.module.scss';

interface ExitButtonProps {
  onClick: () => void;
  children?: React.ReactNode;
}

export const ExitButton = ({ onClick, children = 'Выйти' }: ExitButtonProps) => {
  return (
    <button className={styles.exitButton} onClick={onClick}>
      {children}
    </button>
  );
};