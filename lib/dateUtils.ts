import { isPast, isToday, parseISO } from 'date-fns';

interface TodoDateStatus {
  dueDate?: string;
  completed: boolean;
}

export function checkIsOverdue(todo: TodoDateStatus): boolean {
  if (todo.completed || !todo.dueDate) return false;

  const parsedDate = parseISO(todo.dueDate);
  return isPast(parsedDate) && !isToday(parsedDate);
}

export function checkIsDueToday(todo: TodoDateStatus): boolean {
  if (!todo.dueDate) return false;

  return isToday(parseISO(todo.dueDate));
}
