import { useState, useEffect } from 'react';
import styles from './confirmAttendance.module.scss';

interface ConfirmAttendanceProps {
  disciplineId: number;
  studentId: number;
  groupId: number;
}

export const ConfirmAttendance = ({ disciplineId, studentId, groupId }: ConfirmAttendanceProps) => {
  const [loading, setLoading] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isPollActive, setIsPollActive] = useState(false);

  // Проверяем, активен ли опрос
  useEffect(() => {
    const checkPoll = async () => {
      try {
        const response = await fetch(`/api/polls?disciplineId=${disciplineId}&active=true&groupId=${groupId}`);
        const polls = await response.json();
        setIsPollActive(polls.length > 0);
      } catch (error) {
        console.error('Ошибка проверки опроса:', error);
      }
    };

    checkPoll();
    const interval = setInterval(checkPoll, 5000); // Проверка каждые 5 секунд
    return () => clearInterval(interval);
  }, [disciplineId, groupId]);

  // Подтверждение присутствия
  const handleConfirm = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          disciplineId,
          date: new Date().toISOString().split('T')[0],
          status: 'P',
          grade: null,
          reason: '',
        }),
      });

      if (response.ok) {
        setIsConfirmed(true);
        alert('✅ Присутствие подтверждено!');
      }
    } catch (error) {
      console.error('Ошибка подтверждения:', error);
      alert('❌ Не удалось подтвердить присутствие');
    } finally {
      setLoading(false);
    }
  };

  if (!isPollActive) {
    return null; // Кнопка не показывается, если опрос не активен
  }

  if (isConfirmed) {
    return <div className={styles.confirmed}>✅ Присутствие подтверждено</div>;
  }

  return (
    <button
      className={styles.confirmBtn}
      onClick={handleConfirm}
      disabled={loading}
    >
      {loading ? 'Подтверждение...' : '✅ Подтвердить присутствие'}
    </button>
  );
};