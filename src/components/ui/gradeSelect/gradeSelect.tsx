import styles from './gradeSelect.module.scss';

interface GradeSelectProps {
  value: string | number | null;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const GradeSelect = ({ value, onChange, placeholder = '-' }: GradeSelectProps) => {
  return (
    <select
      className={styles.gradeSelect}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">{placeholder}</option>
      <option value="5">5</option>
      <option value="4">4</option>
      <option value="3">3</option>
      <option value="2">2</option>
      <option value="1">1</option>
    </select>
  );
};