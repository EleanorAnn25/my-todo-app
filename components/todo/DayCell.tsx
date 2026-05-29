import { format, isToday } from 'date-fns';
import { MouseEvent } from 'react';

import { CATEGORY_COLORS } from '@/lib/configMap';
import { cn } from '@/lib/utils';
import { Todo } from '@/types/todo';

interface DayCellProps {
  date: Date;
  todos: Todo[];
  isCurrentMonth: boolean;
  compact?: boolean;
  onTaskClick: (todoId: string, dateLabel: string, dateStr: string, e: MouseEvent) => void;
  onDayClick: (dateLabel: string, dateStr: string, e: MouseEvent) => void;
}

export function DayCell({
  date,
  todos,
  isCurrentMonth,
  compact = false,
  onTaskClick,
  onDayClick,
}: DayCellProps) {
  const today = isToday(date);
  const maxVisible = 2;
  const visible = todos.slice(0, maxVisible);
  const hiddenCount = todos.length - maxVisible;
  const dateLabel = format(date, 'MMMM d, yyyy');
  const dateStr = format(date, 'yyyy-MM-dd');

  return (
    <div
      className={cn(
        'border-b border-r border-neutral-100',
        compact ? 'min-h-14 p-1' : 'min-h-20 p-1.5',
        !isCurrentMonth && 'bg-neutral-50/50',
        today && 'bg-stone-50'
      )}
    >
      {/* Day Number */}
      <div
        className={cn(
          'font-medium mb-0.5 flex items-center justify-center',
          compact ? 'text-2xs w-5 h-5' : 'text-xs w-6 h-6',
          today && 'bg-neutral-900 text-white rounded-full',
          !today && isCurrentMonth && 'text-neutral-700',
          !isCurrentMonth && 'text-neutral-300'
        )}
      >
        {format(date, 'd')}
      </div>

      {/* Desktop (task chips) */}
      {!compact && (
        <div className="space-y-0.5">
          {visible.map((todo) => (
            <button
              key={todo.id}
              onClick={(e) => onTaskClick(todo.id, dateLabel, dateStr, e)}
              className={cn(
                'w-full text-left text-2xs px-1.5 py-0.5 leading-tight truncate transition-opacity hover:opacity-80 active:opacity-60',
                todo.completed && 'opacity-50 line-through'
              )}
              style={{
                backgroundColor: CATEGORY_COLORS[todo.category] + '22',
                color: CATEGORY_COLORS[todo.category],
                borderLeft: `2px solid ${CATEGORY_COLORS[todo.category]}`,
              }}
              title={todo.title}
            >
              {todo.title}
            </button>
          ))}

          {hiddenCount > 0 && (
            <button
              onClick={(e) => onDayClick(dateLabel, dateStr, e)}
              className="text-2xs text-neutral-400 hover:text-neutral-700 pl-1 transition-colors"
            >
              +{hiddenCount} more
            </button>
          )}
        </div>
      )}

      {/* Mobile (dot indicators) */}
      {compact && todos.length > 0 && (
        <button
          onClick={(e) => onDayClick(dateLabel, dateStr, e)}
          className="w-full flex flex-wrap gap-0.5 mt-0.5 justify-center"
          aria-label={`${todos.length} task${todos.length !== 1 ? 's' : ''} on ${dateLabel}`}
        >
          {todos.slice(0, 3).map((todo) => (
            <span
              key={todo.id}
              className="h-1.5 w-1.5 rounded-full shrink-0"
              style={{ backgroundColor: CATEGORY_COLORS[todo.category] }}
            />
          ))}

          {todos.length > 3 && (
            <span className="text-[8px] text-neutral-400 leading-none">+{todos.length - 3}</span>
          )}
        </button>
      )}
    </div>
  );
}
