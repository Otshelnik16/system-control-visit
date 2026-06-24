import styles from './viewButton.module.scss';

interface ViewButtonProps {
  onClick: () => void;
  children?: React.ReactNode;
}

export const ViewButton = ({ onClick, children = 'Посмотреть' }: ViewButtonProps) => {
  return (
    <button className={styles.viewButton} onClick={onClick}>
      {children}
    </button>
  );
};