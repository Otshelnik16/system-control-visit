import styles from './input.module.scss';

interface InputProps {
  label: string;
  type?: 'text' | 'password';
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Input = ({ label, type = 'text', placeholder, value, onChange }: InputProps) => {
  return (
    <div className={styles.inputGroup}>
      <label className={styles.label}>{label}</label>
      <input
        type={type}
        className={styles.input}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};