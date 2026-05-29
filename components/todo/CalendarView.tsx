'use client';

import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isSameMonth,
  startOfMonth,
  subMonths,
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';

import { CATEGORIES, CATEGORY_COLORS, WEEKDAYS_FULL, WEEKDAYS_SHORT } from '@/lib/configMap';
import { Todo } from '@/types/todo';

import { Button } from '../ui/button';
import { DayCell } from './DayCell';
import { TaskDetailSheet } from './TaskDetailSheet';

interface SheetState {
  dateStr: string;
  dateLabel: string;
  singleTodoId?: string;
}

interface CalendarViewProps {
  todosByDate: Map<string, Todo[]>;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

export function CalendarView({ todosByDate, onEdit, onDelete, onToggle }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [sheet, setSheet] = useState<SheetState | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const startPadding = getDay(monthStart);
  const paddedDays: (Date | null)[] = [...Array(startPadding).fill(null), ...days];
  while (paddedDays.length % 7 !== 0) paddedDays.push(null);

  const handleTaskClick = (todoId: string, dateLabel: string, dateStr: string) => {
    setSheet({ dateStr, dateLabel, singleTodoId: todoId });
  };

  const handleDayClick = (dateLabel: string, dateStr: string) => {
    setSheet({ dateStr, dateLabel });
  };

  const handleDelete = (id: string) => {
    const hasConfirmed = window.confirm(
      'Are you sure you want to delete this task? This action cannot be undone.'
    );
    if (!hasConfirmed) return;

    onDelete(id);
  };

  const sheetTasks = useMemo(() => {
    if (!sheet) return [];
    const dayTasks = todosByDate.get(sheet.dateStr) ?? [];
    if (sheet.singleTodoId) {
      const todo = dayTasks.find((t) => t.id === sheet.singleTodoId);
      return todo ? [todo] : [];
    }
    return dayTasks;
  }, [sheet, todosByDate]);

  if (sheet && sheetTasks.length === 0) {
    setSheet(null);
  }

  return (
    <div>
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="font-serif text-base sm:text-lg text-neutral-800">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>

        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
          >
            <ChevronLeft size={16} />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs px-2"
            onClick={() => setCurrentMonth(new Date())}
          >
            Today
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>

      {/* Desktop Grid */}
      <div className="hidden sm:block border-l border-t border-neutral-100 overflow-hidden">
        {/* Day (Sun - Sat) */}
        <div className="grid grid-cols-7 border-b border-neutral-100">
          {WEEKDAYS_FULL.map((day) => (
            <div
              key={day}
              className="px-2 py-1.5 text-[11px] font-medium text-neutral-400 uppercase tracking-wider text-center border-r border-neutral-100"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Day Cells */}
        <div className="grid grid-cols-7">
          {paddedDays.map((date, idx) => {
            if (!date)
              return (
                <div
                  key={`pad-${idx}`}
                  className="min-h-20 border-b border-r border-neutral-100 bg-neutral-50/30"
                />
              );

            const dateStr = format(date, 'yyyy-MM-dd');

            return (
              <DayCell
                key={dateStr}
                date={date}
                todos={todosByDate.get(dateStr) ?? []}
                isCurrentMonth={isSameMonth(date, currentMonth)}
                onTaskClick={handleTaskClick}
                onDayClick={handleDayClick}
              />
            );
          })}
        </div>
      </div>

      {/* Mobile Grid */}
      <div className="sm:hidden border-l border-t border-neutral-100 overflow-hidden">
        {/* Day (Sun - Sat) */}
        <div className="grid grid-cols-7 border-b border-neutral-100">
          {WEEKDAYS_SHORT.map((day, i) => (
            <div
              key={`${day}-${i}`}
              className="py-1 text-2xs font-medium text-neutral-400 uppercase text-center border-r border-neutral-100"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Day Cells */}
        <div className="grid grid-cols-7">
          {paddedDays.map((date, idx) => {
            if (!date)
              return (
                <div
                  key={`pad-${idx}`}
                  className="min-h-14 border-b border-r border-neutral-100 bg-neutral-50/30"
                />
              );

            const dateStr = format(date, 'yyyy-MM-dd');

            return (
              <DayCell
                key={dateStr}
                date={date}
                todos={todosByDate.get(dateStr) ?? []}
                isCurrentMonth={isSameMonth(date, currentMonth)}
                compact
                onTaskClick={handleTaskClick}
                onDayClick={handleDayClick}
              />
            );
          })}
        </div>
      </div>

      {/* Category Legend */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-3 sm:mt-4">
        {CATEGORIES.map((cat) => (
          <div key={cat} className="flex items-center gap-1.5">
            <span
              className="h-2 w-2 rounded-full shrink-0"
              style={{ backgroundColor: CATEGORY_COLORS[cat] }}
            />
            <span className="text-xs text-neutral-500">{cat}</span>
          </div>
        ))}
      </div>

      {/* Task Detail Sheet */}
      {sheet && sheetTasks.length > 0 && (
        <TaskDetailSheet
          tasks={sheetTasks}
          dateLabel={sheet.dateLabel}
          onClose={() => setSheet(null)}
          onEdit={onEdit}
          onDelete={handleDelete}
          onToggle={onToggle}
        />
      )}
    </div>
  );
}
