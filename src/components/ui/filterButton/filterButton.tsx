import styles from './filterButton.module.scss';

interface FilterButtonProps {
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
}

export const FilterButton = ({ onClick, active = false, children }: FilterButtonProps) => {
  return (
    <button
      className={`${styles.filterButton} ${active ? styles.active : ''}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};