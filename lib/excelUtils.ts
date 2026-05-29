import * as XLSX from 'xlsx';

import { Category, Todo, TodoFormData } from '@/types/todo';
import { CATEGORIES } from './configMap';

export async function parseImportFile(
  file: File
): Promise<Omit<Todo, 'id' | 'createdAt' | 'updatedAt' | 'order'>[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) throw new Error('Could not read file data.');

        const workbook = XLSX.read(data, { type: 'array' });

        const worksheet = workbook.Sheets[workbook.SheetNames[0]];

        const raw = XLSX.utils.sheet_to_json(worksheet, { raw: false });

        const parsed = (raw as TodoFormData[])
          .map((row) => {
            const normalizedRow: Record<string, unknown> = {};

            Object.keys(row).forEach((key) => {
              const typedKey = key as keyof TodoFormData;
              normalizedRow[key.toLowerCase().trim()] = row[typedKey];
            });

            const title = String(normalizedRow.title ?? '').trim();
            if (!title) return null;

            const description = String(normalizedRow.description ?? '').trim() || undefined;

            const rawCategory = String(normalizedRow.category ?? 'Personal').trim();
            const category: Category = (
              CATEGORIES.includes(rawCategory as Category) ? rawCategory : 'Personal'
            ) as Category;

            const dueDate =
              String(normalizedRow.duedate ?? normalizedRow['due date'] ?? '').trim() || undefined;

            const completed = String(normalizedRow.completed ?? '').toLowerCase() === 'true';

            return {
              title,
              description,
              category,
              dueDate,
              completed: !!completed,
            } as Omit<Todo, 'id' | 'createdAt' | 'updatedAt' | 'order'>;
          })
          .filter((r): r is Omit<Todo, 'id' | 'createdAt' | 'updatedAt' | 'order'> => r !== null);

        resolve(parsed);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error('File reading failed.'));
    reader.readAsArrayBuffer(file);
  });
}

export function exportToExcel(todos: Todo[]) {
  const data = todos.map((t) => ({
    Title: t.title,
    Description: t.description ?? '',
    Category: t.category,
    'Due Date': t.dueDate ?? '',
    Completed: t.completed ? 'Yes' : 'No',
    'Created At': new Date(t.createdAt).toLocaleDateString(),
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, ws, 'Tasks');
  ws['!cols'] = [{ wch: 30 }, { wch: 40 }, { wch: 12 }, { wch: 14 }, { wch: 12 }, { wch: 14 }];
  XLSX.writeFile(wb, `tasks-${Date.now()}.xlsx`);
}

export function downloadTemplate() {
  const data = [
    {
      Title: 'Example Task',
      Description: 'An example description',
      Category: 'Personal',
      'Due Date': '2026-06-01',
    },
    {
      Title: 'Example Task 2',
      Description: 'Another example description',
      Category: 'Other',
      'Due Date': '2026-06-25',
    },
  ];

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, ws, 'Template');
  ws['!cols'] = [{ wch: 30 }, { wch: 40 }, { wch: 12 }, { wch: 14 }];
  XLSX.writeFile(wb, `todo-template.xlsx`);
}
