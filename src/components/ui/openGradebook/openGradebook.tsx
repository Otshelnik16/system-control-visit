import styles from './openGradebook.module.scss';

interface OpenGradebookProps {
  onClick: () => void;
  children?: React.ReactNode;
}

export const OpenGradebook = ({ onClick, children = 'Открыть табель' }: OpenGradebookProps) => {
  return (
    <button className={styles.openGradebook} onClick={onClick}>
      {children}
    </button>
  );
};