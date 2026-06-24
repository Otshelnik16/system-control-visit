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
  groupId: number;
}

export const getStatusText = (status: string): string => {
  switch (status) {
    case 'П': return 'Присутствовал';
    case 'Н': return 'Не присутствовал';
    case 'О': return 'Опоздал';
    case 'УП': return 'Уважительная причина';
    default: return '—';
  }
};

export const generateDailyReport = async (
  students: Student[],
  attendance: AttendanceRecord[],
  discipline: Discipline | null,
  date: string,
  groupName: string
): Promise<Blob> => {
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: 'ЕЖЕДНЕВНЫЙ ОТЧЕТ',
                size: 28,
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Группа: ${groupName}`,
                size: 24,
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Дисциплина: ${discipline?.name || '—'}`,
                size: 24,
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Дата: ${date}`,
                size: 24,
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({ text: '' }),
          new Table({
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: '№' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'ФИО' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Статус' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Отметка' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Замечания' })] }),
                ],
              }),
              ...students.map((student, index) => {
                const record = attendance.find(
                  (a) => a.studentId === student.id
                );
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
        ],
      },
    ],
  });

  return await Packer.toBlob(doc);
};

export const generateWeeklyReport = async (
  students: Student[],
  attendance: AttendanceRecord[],
  groupName: string
): Promise<Blob> => {
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: 'ЕЖЕНЕДЕЛЬНЫЙ ОТЧЕТ',
                size: 28,
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Группа: ${groupName}`,
                size: 24,
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({ text: '' }),
          new Table({
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: '№' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'ФИО' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Всего' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Уважительные' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Неуважительные' })] }),
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
            ],
          }),
        ],
      },
    ],
  });

  return await Packer.toBlob(doc);
};