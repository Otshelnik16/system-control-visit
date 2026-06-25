import { Document, Packer, Paragraph, Table, TableRow, TableCell, AlignmentType, TextRun } from 'docx';

interface Student {
  id: number;
  fullName: string;
  groupId: number;
}

interface AttendanceRecord {
  id: number;
  studentId: number;
  disciplineId: number;
  date: string;
  status: string;
  grade: number | null;
  reason: string;
}

interface Discipline {
  id: number;
  name: string;
}

const getStatusText = (status: string): string => {
  switch (status) {
    case 'П': return 'Присутствовал';
    case 'Н': return 'Не присутствовал';
    case 'О': return 'Опоздал';
    case 'УП': return 'Уважительная причина';
    default: return '—';
  }
};

// ===== ДАННЫЕ ДЛЯ РУКОВОДИТЕЛЕЙ =====
const getClassTeacher = (groupName: string): string => {
  const teachers: { [key: string]: string } = {
    'ИС-21': 'Граков Д.В.',
    'ИС-22': 'Смирнов И.П.',
    'КС-21': 'Кузнецов А.А.',
    'КС-22': 'Морозов С.В.',
  };
  return teachers[groupName] || 'Граков Д.В.';
};

const getHeadman = (groupName: string): string => {
  const headmen: { [key: string]: string } = {
    'ИС-21': 'Гойкина И.В.',
    'ИС-22': 'Борисов И.А.',
    'КС-21': 'Ермаков О.Н.',
    'КС-22': 'Михайлова Ю.С.',
  };
  return headmen[groupName] || 'Гойкина И.В.';
};

// ============================================================
// ЕЖЕДНЕВНЫЙ ОТЧЁТ
// ============================================================
export const generateDailyReport = async (
  students: Student[],
  attendance: AttendanceRecord[],
  discipline: Discipline | null,
  date: string,
  groupName: string
): Promise<Blob> => {
  const classTeacher = getClassTeacher(groupName);
  const headman = getHeadman(groupName);

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            children: [new TextRun({ text: 'ЕЖЕДНЕВНЫЙ ОТЧЕТ', size: 28, bold: true })],
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            children: [new TextRun({ text: `Группа: ${groupName}`, size: 24 })],
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            children: [new TextRun({ text: `Дисциплина: ${discipline?.name || '—'}`, size: 24 })],
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            children: [new TextRun({ text: `Дата: ${date}`, size: 24 })],
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({ text: '' }),
          new Table({
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '№', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'ФИО', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Статус', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Отметка', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Замечания', bold: true })] })] }),
                ],
              }),
              ...students.map((student, index) => {
                const record = attendance.find((a) => a.studentId === student.id);
                return new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ text: String(index + 1) })] }),
                    new TableCell({ children: [new Paragraph({ text: student.fullName })] }),
                    new TableCell({ children: [new Paragraph({ text: record ? getStatusText(record.status) : '—' })] }),
                    new TableCell({ children: [new Paragraph({ text: record?.grade ? String(record.grade) : '—' })] }),
                    new TableCell({ children: [new Paragraph({ text: record?.reason || '—' })] }),
                  ],
                });
              }),
            ],
          }),
          new Paragraph({ text: '' }),
          new Paragraph({
            children: [
              new TextRun({ text: `Классный руководитель: ___________ ${classTeacher}`, size: 20 }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `Староста группы: ___________ ${headman}`, size: 20 }),
            ],
          }),
        ],
      },
    ],
  });

  return await Packer.toBlob(doc);
};

// ============================================================
// ЕЖЕНЕДЕЛЬНЫЙ ОТЧЁТ
// ============================================================
export const generateWeeklyReport = async (
  students: Student[],
  attendance: AttendanceRecord[],
  groupName: string,
  startDate: string,
  endDate: string
): Promise<Blob> => {
  const classTeacher = getClassTeacher(groupName);
  const headman = getHeadman(groupName);

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            children: [new TextRun({ text: 'ЕЖЕНЕДЕЛЬНЫЙ ОТЧЕТ', size: 28, bold: true })],
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            children: [new TextRun({ text: `Группа: ${groupName}`, size: 24 })],
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            children: [new TextRun({ text: `Период: ${startDate} — ${endDate}`, size: 24 })],
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({ text: '' }),
          new Table({
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '№', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'ФИО', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Всего', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Уважительные', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Неуважительные', bold: true })] })] }),
                ],
              }),
              ...students.map((student, index) => {
                const records = attendance.filter((a) => a.studentId === student.id);
                const total = records.length;
                const valid = records.filter((r) => r.status === 'УП').length;
                const invalid = records.filter((r) => r.status === 'Н').length;
                return new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ text: String(index + 1) })] }),
                    new TableCell({ children: [new Paragraph({ text: student.fullName })] }),
                    new TableCell({ children: [new Paragraph({ text: String(total) })] }),
                    new TableCell({ children: [new Paragraph({ text: String(valid) })] }),
                    new TableCell({ children: [new Paragraph({ text: String(invalid) })] }),
                  ],
                });
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Итого', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ text: '' })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: String(attendance.length), bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: String(attendance.filter(r => r.status === 'УП').length), bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: String(attendance.filter(r => r.status === 'Н').length), bold: true })] })] }),
                ],
              }),
            ],
          }),
          new Paragraph({ text: '' }),
          new Paragraph({
            children: [
              new TextRun({ text: `Классный руководитель: ___________ ${classTeacher}`, size: 20 }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `Староста группы: ___________ ${headman}`, size: 20 }),
            ],
          }),
        ],
      },
    ],
  });

  return await Packer.toBlob(doc);
};

// ============================================================
// ЕЖЕМЕСЯЧНЫЙ ОТЧЁТ
// ============================================================
export const generateMonthlyReport = async (
  students: Student[],
  attendance: AttendanceRecord[],
  groupName: string,
  month: string,
  year: string
): Promise<Blob> => {
  const classTeacher = getClassTeacher(groupName);
  const headman = getHeadman(groupName);

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            children: [new TextRun({ text: 'ЕЖЕМЕСЯЧНЫЙ ОТЧЕТ', size: 28, bold: true })],
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            children: [new TextRun({ text: `Группа: ${groupName}`, size: 24 })],
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            children: [new TextRun({ text: `Месяц: ${month} ${year}`, size: 24 })],
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({ text: '' }),
          new Table({
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '№', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'ФИО', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Всего', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Уважительные', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Неуважительные', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Беседа со студентом', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Работа с родителями', bold: true })] })] }),
                ],
              }),
              ...students.map((student, index) => {
                const records = attendance.filter((a) => a.studentId === student.id);
                const total = records.length;
                const valid = records.filter((r) => r.status === 'УП').length;
                const invalid = records.filter((r) => r.status === 'Н').length;
                return new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ text: String(index + 1) })] }),
                    new TableCell({ children: [new Paragraph({ text: student.fullName })] }),
                    new TableCell({ children: [new Paragraph({ text: String(total) })] }),
                    new TableCell({ children: [new Paragraph({ text: String(valid) })] }),
                    new TableCell({ children: [new Paragraph({ text: String(invalid) })] }),
                    new TableCell({ children: [new Paragraph({ text: '' })] }),
                    new TableCell({ children: [new Paragraph({ text: '' })] }),
                  ],
                });
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Итого', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ text: '' })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: String(attendance.length), bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: String(attendance.filter(r => r.status === 'УП').length), bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: String(attendance.filter(r => r.status === 'Н').length), bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ text: '' })] }),
                  new TableCell({ children: [new Paragraph({ text: '' })] }),
                ],
              }),
            ],
          }),
          new Paragraph({ text: '' }),
          new Paragraph({
            children: [
              new TextRun({ text: `Классный руководитель: ___________ ${classTeacher}`, size: 20 }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `Староста группы: ___________ ${headman}`, size: 20 }),
            ],
          }),
        ],
      },
    ],
  });

  return await Packer.toBlob(doc);
};