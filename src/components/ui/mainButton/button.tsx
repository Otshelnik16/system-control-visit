import styles from './button.module.scss';

interface ButtonProps {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  disabled?: boolean; // ✅ ДОБАВЛЯЕМ
}

export const Button = ({ children, type = 'button', onClick, disabled }: ButtonProps) => {
  return (
    <button type={type} className={styles.button} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};