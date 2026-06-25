import styles from './statusSelect.module.scss';

interface StatusSelectProps {
  value: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const StatusSelect = ({ value, onChange, placeholder = '-' }: StatusSelectProps) => {
  return (
    <select
      className={styles.statusSelect}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">{placeholder}</option>
      <option value="П">Присутствовал</option>
      <option value="Н">Не присутствовал</option>
      <option value="О">Опоздал</option>
      <option value="УП">Уважительная причина</option>
    </select>
  );
};