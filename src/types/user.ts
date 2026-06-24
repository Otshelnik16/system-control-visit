export type UserRole = 'student' | 'teacher';

export interface User {
  id: number;
  login: string;
  fullName: string;
  role: UserRole;
  groupId?: number;
}

export interface Teacher {
  id: string;
  login: string;
  password: string;
  fullName: string;
}

export interface Student {
  id: string;
  login: string;
  password: string;
  fullName: string;
  groupId: number;
}

export interface Group {
  id: number;
  name: string;
  teacherId: number;
}

export interface Discipline {
  id: number;
  name: string;
  groupId: number;
}

export interface AttendanceRecord {
  id: number;
  studentId: number;
  disciplineId: number;
  date: string;
  status: string;
  grade: number | null;
  reason: string;
}