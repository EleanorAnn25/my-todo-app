import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { format, parseISO } from 'date-fns';
import { CalendarDays, ChevronDown, ChevronUp, GripVertical, Pencil, Trash } from 'lucide-react';
import { useState } from 'react';

import { checkIsDueToday, checkIsOverdue } from '@/lib/dateUtils';
import { cn } from '@/lib/utils';
import { Todo } from '@/types/todo';

import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { CategoryBadge } from './CategoryBadge';
import { TodoDeleteDialog } from './TodoDeleteDialog';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
  isDraggable?: boolean;
}

export function TodoItem({ todo, onToggle, onEdit, onDelete, isDraggable = true }: TodoItemProps) {
  const [expanded, setExpanded] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: todo.id,
    disabled: !isDraggable,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 30 : undefined,
  };

  const isOverdue = checkIsOverdue(todo);
  const isDueToday = checkIsDueToday(todo);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group flex items-start gap-2 sm:gap-3 border-b border-neutral-100 py-3 px-3 sm:px-4 bg-white transition-all',
        todo.completed && 'bg-neutral-50/60',
        isDragging && 'shadow-lg border-neutral-200 opacity-80 cursor-grabbing relative z-30'
      )}
    >
      {/* Drag Handle */}
      {isDraggable && (
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="mt-0.5 cursor-grab active:cursor-grabbing text-neutral-300 hover:text-neutral-500 shrink-0 touch-none p-0.5 -ml-0.5"
          aria-label="Drag to reorder"
        >
          <GripVertical size={16} />
        </button>
      )}

      {/* Checkbox */}
      <div className={cn('mt-0.5 shrink-0', !isDraggable && 'ml-1')}>
        <Checkbox
          checked={todo.completed}
          onCheckedChange={() => onToggle(todo.id)}
          className="w-4 h-4"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-start gap-2">
          <span
            className={cn(
              'text-sm font-medium text-neutral-800 wrap-break-word leading-snug',
              todo.completed && 'line-through text-neutral-400'
            )}
          >
            {todo.title}
          </span>

          <CategoryBadge category={todo.category} size="sm" />
        </div>

        {/* Due Date */}
        {todo.dueDate && (
          <div
            className={cn(
              'flex items-center gap-1 mt-1 text-xs',
              isOverdue && 'text-rose-400',
              isDueToday && !isOverdue && 'text-amber-400',
              !isOverdue && !isDueToday && 'text-neutral-400'
            )}
          >
            <CalendarDays size={12} className="shrink-0" />
            <span>
              {isDueToday
                ? 'Due today'
                : isOverdue
                  ? `Overdue: ${format(parseISO(todo.dueDate), 'MMM d, yyyy')}`
                  : format(parseISO(todo.dueDate), 'MMM d, yyyy')}
            </span>
          </div>
        )}

        {todo.description && (
          <div>
            <button
              type="button"
              onClick={() => setExpanded((e) => !e)}
              className="flex items-center gap-0.5 text-xs text-neutral-400 hover:text-neutral-600 mt-1 transition-colors min-h-5"
            >
              {expanded ? (
                <>
                  <ChevronUp size={12} /> Hide notes
                </>
              ) : (
                <>
                  <ChevronDown size={12} /> Notes
                </>
              )}
            </button>

            {expanded && (
              <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed whitespace-pre-wrap">
                {todo.description}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-0.5 shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 sm:w-7 sm:h-7"
          onClick={() => onEdit(todo)}
          aria-label="Edit task"
        >
          <Pencil size={14} />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 sm:w-7 sm:h-7 hover:bg-rose-50 hover:text-rose-400"
          onClick={() => setDeleteDialogOpen(true)}
          aria-label="Delete task"
        >
          <Trash size={14} />
        </Button>
      </div>

      <TodoDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        todo={todo}
        onConfirm={() => {
          onDelete(todo.id);
        }}
      />
    </div>
  );
}
