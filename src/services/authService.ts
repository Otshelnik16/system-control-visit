import type { Student, Teacher, User } from '../types/user';

const API_URL = '/api';

const findTeacher = async (login: string, password: string): Promise<User | null> => {
  const params = new URLSearchParams({ login, password });
  const response = await fetch(`${API_URL}/teachers?${params}`);

  if (!response.ok) {
    throw new Error('Ошибка соединения с сервером');
  }

  const teachers: Teacher[] = await response.json();
  const teacher = teachers[0];

  if (!teacher) return null;

  const { password: _, ...profile } = teacher;
  return { 
    ...profile, 
    id: Number(profile.id),  // ← ПРЕОБРАЗУЕМ В number
    role: 'teacher' 
  };
};

const findStudent = async (login: string, password: string): Promise<User | null> => {
  const params = new URLSearchParams({ login, password });
  const response = await fetch(`${API_URL}/students?${params}`);

  if (!response.ok) {
    throw new Error('Ошибка соединения с сервером');
  }

  const students: Student[] = await response.json();
  const student = students[0];

  if (!student) return null;

  const { password: _, ...profile } = student;
  return { 
    ...profile, 
    id: Number(profile.id),  // ← ПРЕОБРАЗУЕМ В number
    role: 'student' 
  };
};

export const authenticateUser = async (login: string, password: string): Promise<User | null> => {
  const teacher = await findTeacher(login, password);
  if (teacher) return teacher;
  return findStudent(login, password);
};

export const generateToken = (): string => crypto.randomUUID();