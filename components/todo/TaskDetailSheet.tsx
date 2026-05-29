'use client';

import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';
import { Todo } from '@/types/todo';

import { TaskRow } from './TaskRow';

interface TaskDetailSheetProps {
  tasks: Todo[];
  dateLabel?: string;
  anchorRect?: DOMRect;
  onClose: () => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

export function TaskDetailSheet({
  tasks,
  dateLabel,
  anchorRect,
  onClose,
  onEdit,
  onDelete,
  onToggle,
}: TaskDetailSheetProps) {
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!anchorRect || typeof window === 'undefined') return;

    const calculatePosition = () => {
      const panelWidth = 320; // sm:w-80
      const padding = 12;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      if (viewportWidth < 640) {
        setPosition(null); // Use mobile bottom sheet
        return;
      }

      let left = anchorRect.left;
      let top = anchorRect.top;

      // If no space on right, show on left
      if (left + panelWidth > viewportWidth - padding) {
        left = anchorRect.right - panelWidth;
      }

      if (left < padding) left = padding;

      const panelHeight = panelRef.current?.offsetHeight || 200;
      if (top + panelHeight > viewportHeight - padding) {
        top = viewportHeight - panelHeight - padding;
      }
      if (top < padding) top = padding;

      setPosition({ top, left });
    };

    calculatePosition();
    window.addEventListener('resize', calculatePosition);
    return () => window.removeEventListener('resize', calculatePosition);
  }, [anchorRect]);

  if (tasks.length === 0) return null;

  const handleDelete = (id: string) => {
    onDelete(id);
    if (tasks.length <= 1) onClose();
  };

  const desktopStyle = position ? { top: position.top, left: position.left } : {};

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/10 backdrop-blur-xs animate-in fade-in duration-150"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        style={desktopStyle}
        className={cn(
          'fixed z-50 bg-white shadow-xl',
          // Mobile (bottom sheet)
          'bottom-0 left-0 right-0 rounded-t-xl pb-safe',
          // Desktop (when anchored dynamically)
          position && 'sm:bottom-auto sm:left-auto sm:right-auto sm:rounded-xl sm:w-80 h-auto',
          // Desktop (centered fallback)
          !position &&
            'sm:bottom-auto sm:right-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-80 h-auto',
          'animate-in slide-in-from-bottom sm:slide-in-from-right-4 duration-200'
        )}
      >
        {/* Mobile Drag Handle */}
        <div className="sm:hidden flex justify-center pt-2.5 pb-1">
          <div className="h-1 w-10 rounded-full bg-neutral-200" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100">
          <div>
            {/* Current Date */}
            {dateLabel && (
              <p className="text-2xs text-neutral-400 uppercase tracking-wider font-medium mb-0.5">
                {dateLabel}
              </p>
            )}

            {/* Tasks Total */}
            <p className="text-sm font-medium text-neutral-800">
              {tasks.length === 1 ? tasks[0].title : `${tasks.length} tasks`}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 transition-colors p-1 -mr-1"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Task List */}
        <div className="overflow-y-auto max-h-[60vh] sm:max-h-96 px-4">
          {tasks.map((todo) => (
            <TaskRow
              key={todo.id}
              todo={todo}
              onEdit={onEdit}
              onDelete={handleDelete}
              onToggle={onToggle}
              onClose={onClose}
            />
          ))}
        </div>
      </div>
    </>
  );
}
