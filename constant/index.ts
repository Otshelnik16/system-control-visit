export const API_URL = '/api';

export const USER_ROLES = {
  STUDENT: 'student',
  TEACHER: 'teacher',
} as const;

export const ATTENDANCE_STATUSES = {
  PRESENT: 'P',
  ABSENT: 'N',
  LATE: 'L',
  SICK: 'Б',
} as const;

export const STATUS_LABELS: Record<string, string> = {
  P: 'Присутствовал',
  N: 'Не присутствовал',
  L: 'Опоздал',
  Б: 'По болезни',
};

export const STATUS_COLORS: Record<string, string> = {
  P: '#E8F5E9',
  N: '#FFEBEE',
  L: '#FFF3E0',
  Б: '#E3F2FD',
};