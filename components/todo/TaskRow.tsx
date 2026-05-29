import { format, parseISO } from 'date-fns';
import { CalendarDays, Pencil, Trash } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Todo } from '@/types/todo';

import { checkIsDueToday, checkIsOverdue } from '@/lib/dateUtils';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { CategoryBadge } from './CategoryBadge';

interface TaskRowProps {
  todo: Todo;
  onEdit: (t: Todo) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onClose: () => void;
}

export function TaskRow({ todo, onEdit, onDelete, onToggle, onClose }: TaskRowProps) {
  const isOverdue = checkIsOverdue(todo);
  const isDueToday = checkIsDueToday(todo);

  return (
    <div className="py-3 border-b border-neutral-100 last:border-0">
      <div className="flex items-start gap-3">
        {/* Completion Toggle */}
        <Checkbox
          checked={todo.completed}
          onCheckedChange={() => onToggle(todo.id)}
          className="w-4 h-4"
          aria-label={todo.completed ? 'Mark incomplete' : 'Mark complete'}
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p
            className={cn(
              'text-sm font-medium text-neutral-800 leading-snug',
              todo.completed && 'line-through text-neutral-400'
            )}
          >
            {todo.title}
          </p>

          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <CategoryBadge category={todo.category} size="sm" />

            {todo.dueDate && (
              <span
                className={cn(
                  'flex items-center gap-1 text-xs',
                  isOverdue && 'text-rose-400',
                  isDueToday && !isOverdue && 'text-amber-400',
                  !isOverdue && !isDueToday && 'text-neutral-400'
                )}
              >
                <CalendarDays size={12} />
                {format(parseISO(todo.dueDate), 'MMM d, yyyy')}
              </span>
            )}
          </div>

          {todo.description && (
            <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">{todo.description}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-0.5 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => {
              onEdit(todo);
              onClose();
            }}
            aria-label="Edit task"
          >
            <Pencil size={14} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 hover:bg-red-50 hover:text-red-600"
            onClick={() => onDelete(todo.id)}
            aria-label="Delete task"
          >
            <Trash size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
}
