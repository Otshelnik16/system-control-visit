import styles from './downloadButton.module.scss';

interface DownloadButtonProps {
  onClick: () => void;
  children?: React.ReactNode;
}

export const DownloadButton = ({ onClick, children = 'Скачать отчёт Word' }: DownloadButtonProps) => {
  return (
    <button className={styles.downloadButton} onClick={onClick}>
      {children}
    </button>
  );
};