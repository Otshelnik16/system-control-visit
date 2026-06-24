import { api } from './client';
import type { Teacher, Student, Discipline, AttendanceRecord, User } from '../types/user';

/** Получить массив данных */
export async function getList<T>(url: string): Promise<T[]> {
  return api.get<T[]>(url);
}

/** Авторизация */
export async function loginUser(loginName: string, password: string): Promise<User | null> {
  const query = `?login=${loginName}&password=${password}`;

  // Ищем преподавателя
  const teachers = await getList<Teacher>(`/teachers${query}`);
  if (teachers.length > 0) {
    const t = teachers[0];
    return {
      id: Number(t.id),
      login: t.login,
      fullName: t.fullName,
      role: 'teacher',
    };
  }

  // Ищем студента
  const students = await getList<Student>(`/students${query}`);
  if (students.length > 0) {
    const s = students[0];
    return {
      id: Number(s.id),
      login: s.login,
      fullName: s.fullName,
      role: 'student',
      groupId: s.groupId,
    };
  }

  return null;
}

/** Получить дисциплину по ID */
export async function getDiscipline(id: number): Promise<Discipline> {
  return api.get<Discipline>(`/disciplines/${id}`);
}

/** Получить посещаемость по дисциплине и студенту (быстро) */
export async function getAttendanceByDisciplineAndStudent(
  disciplineId: number,
  studentId: number
): Promise<AttendanceRecord[]> {
  return api.get<AttendanceRecord[]>(
    `/attendance?disciplineId=${disciplineId}&studentId=${studentId}`
  );
}