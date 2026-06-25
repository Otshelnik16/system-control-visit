import { useState, useEffect } from 'react';
import styles from './startPoll.module.scss';

interface StartPollProps {
  onClick: () => void;
  isActive: boolean;
  loading?: boolean;
  expiresAt?: string | null;
  onExpire?: () => void;
}

export const StartPoll = ({ onClick, isActive, loading = false, expiresAt = null, onExpire }: StartPollProps) => {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    // ✅ Если опрос НЕ активен — сбрасываем всё!
    if (!isActive || !expiresAt) {
      setTimeLeft('');
      setIsExpired(false);
      return;
    }

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(expiresAt).getTime();
      const diff = Math.max(0, Math.floor((end - now) / 1000));

      if (diff <= 0) {
        setTimeLeft('0:00');
        setIsExpired(true);
        clearInterval(interval);
        if (onExpire) {
          onExpire();
        }
        return;
      }

      const minutes = Math.floor(diff / 60);
      const seconds = diff % 60;
      setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
      setIsExpired(false);
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, expiresAt, onExpire]);

  const handleClick = () => {
    // ✅ Если опрос истёк — не даём нажимать
    if (isExpired) {
      alert('⏰ Опрос уже завершён');
      return;
    }

    if (isActive) {
      if (window.confirm('Вы уверены, что хотите завершить опрос?')) {
        onClick();
      }
    } else {
      onClick();
    }
  };

  const isDisabled = loading || isExpired;

  return (
    <div className={styles.pollContainer}>
      <button
        className={`${styles.startPollBtn} ${isActive ? styles.active : ''} ${isExpired ? styles.expired : ''}`}
        onClick={handleClick}
        disabled={isDisabled}
      >
        {loading ? 'Запуск...' : isExpired ? '⏰ Опрос завершён' : isActive ? '🛑 Остановить опрос' : '🚀 Начать опрос'}
      </button>
      {isActive && timeLeft && (
        <span className={`${styles.timer} ${isExpired ? styles.expiredTimer : ''}`}>
          ⏱️ До конца: {timeLeft}
        </span>
      )}
    </div>
  );
};