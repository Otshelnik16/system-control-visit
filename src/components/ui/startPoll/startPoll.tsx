import styles from './startPoll.module.scss';

interface StartPollProps {
  onClick: () => void;
  isActive: boolean;
  loading?: boolean;
}

export const StartPoll = ({ onClick, isActive, loading = false }: StartPollProps) => {
  return (
    <button
      className={styles.startPoll}
      onClick={onClick}
      disabled={isActive || loading}
    >
      {loading ? 'Запуск...' : isActive ? '🟢 Опрос активен' : '🚀 Начать опрос'}
    </button>
  );
};