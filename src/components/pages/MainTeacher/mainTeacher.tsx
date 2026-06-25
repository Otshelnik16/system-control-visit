import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../../../utils/auth';
import { OpenGradebook } from '../../ui/openGradebook/openGradebook';
import { ExitButton } from '../../ui/exitButton/exitButton';
import styles from './mainTeacher.module.scss';
import iconImg from '../../../assets/icone.png';

interface Group {
  id: number;
  name: string;
  fullName: string;
  students: number;
  disciplines: number;
}

export const MainTeacher = () => {
  const navigate = useNavigate();
  const user = getUser();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const groupsRes = await fetch('/api/groups');
        const groupsData = await groupsRes.json();

        const studentsRes = await fetch('/api/students');
        const studentsData = await studentsRes.json();

        const disciplinesRes = await fetch('/api/disciplines');
        const disciplinesData = await disciplinesRes.json();

        const groupsWithStats = groupsData.map((group: any) => {
          const groupId = Number(group.id);
          
          const studentsCount = studentsData.filter(
            (s: any) => Number(s.groupId) === groupId
          ).length;

          const disciplinesCount = disciplinesData.length;

          return {
            id: groupId,
            name: group.name,
            fullName: `Группа ${group.name}`,
            students: studentsCount,
            disciplines: disciplinesCount,
          };
        });

        // ✅ СОРТИРУЕМ: ИС-21 → ИС-22 → КС-21 → КС-22
        const sortedGroups = groupsWithStats.sort((a, b) => {
          const order: { [key: string]: number } = {
            'ИС-21': 1,
            'ИС-22': 2,
            'КС-21': 3,
            'КС-22': 4,
          };
          return (order[a.name] || 99) - (order[b.name] || 99);
        });

        setGroups(sortedGroups);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    navigate('/login');
  };

  const handleOpenGradebook = (groupId: number) => {
    navigate(`/gradebook/${groupId}`);
  };

  if (loading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <img src={iconImg} alt="Логотип" className={styles.icon} />
            <div className={styles.headerText}>
              <h1>Посещаемость</h1>
              <span className={styles.group}>Мои группы</span>
            </div>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.teacherInfo}>
              <p className={styles.teacherName}>{user?.fullName || 'Преподаватель'}</p>
              <span className={styles.teacherRole}>преподаватель</span>
            </div>
            <ExitButton onClick={handleLogout} />
          </div>
        </div>

        <div className={styles.groups}>
          <h2>Мои группы</h2>
          <div className={styles.groupList}>
            {groups.map((group) => (
              <div key={group.id} className={styles.groupCard}>
                <h3>{group.name}</h3>
                <p>{group.fullName}</p>
                <p>Студентов: {group.students}</p>
                <p>Дисциплин: {group.disciplines}</p>
                <OpenGradebook onClick={() => handleOpenGradebook(group.id)} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};