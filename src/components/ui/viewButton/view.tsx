import styles from './view.module.scss';

interface ViewProps {
  onClick?: () => void;
  children?: React.ReactNode;
}

export const View = ({ onClick, children = 'Посмотреть' }: ViewProps) => {
  return (
    <button className={styles.view} onClick={onClick}>
      {children}
    </button>
  );
};