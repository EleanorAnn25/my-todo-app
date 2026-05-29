import { CalendarDays, ListTodo, Plus } from 'lucide-react';

import { cn } from '@/lib/utils';
import { View } from '@/types/todo';

import { Button } from '../ui/button';

interface MobileNavProps {
  view: View;
  setView: (val: View) => void;
  onAdd: () => void;
}

export function MobileNav({ view, setView, onAdd }: MobileNavProps) {
  return (
    <nav
      className="sm:hidden fixed bottom-0 left-0 right-0 z-30 bg-background/80 backdrop-blur-lg border-t border-border shadow-[0_-2px_10px_rgba(0,0,0,0.05)] pb-safe"
    >
      <div className="flex items-center h-16 px-6">
        <button
          onClick={() => setView('list')}
          className={cn(
            'flex-1 flex flex-col items-center justify-center gap-1 h-full transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary rounded-lg',
            view === 'list' ? 'text-primary' : 'text-muted-foreground'
          )}
          aria-label="List view"
        >
          <div
            className={cn(
              'p-1.5 rounded-xl transition-all duration-200',
              view === 'list' ? 'bg-primary/10 scale-110' : 'bg-transparent'
            )}
          >
            <ListTodo size={20} strokeWidth={view === 'list' ? 2 : 1.5} />
          </div>
          <span
            className={cn(
              'text-2xs font-semibold transition-all duration-200',
              view === 'list' ? 'opacity-100' : 'opacity-80'
            )}
          >
            Tasks
          </span>
        </button>

        <div className="flex-1 flex items-center justify-center relative -top-6">
          <Button
            className="w-16 h-16 rounded-full shadow-xl border-2 border-background bg-primary hover:bg-primary/90 transition-transform active:scale-90"
            onClick={onAdd}
            aria-label="Add task"
            size="icon"
          >
            <Plus size={28} strokeWidth={2.5} className="text-primary-foreground" />
          </Button>
        </div>

        <button
          onClick={() => setView('calendar')}
          className={cn(
            'flex-1 flex flex-col items-center justify-center gap-1 h-full transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary rounded-lg',
            view === 'calendar' ? 'text-primary' : 'text-muted-foreground'
          )}
          aria-label="Calendar view"
        >
          <div
            className={cn(
              'p-1.5 rounded-xl transition-all duration-200',
              view === 'calendar' ? 'bg-primary/10 scale-110' : 'bg-transparent'
            )}
          >
            <CalendarDays size={20} strokeWidth={view === 'calendar' ? 2 : 1.5} />
          </div>
          <span
            className={cn(
              'text-2xs font-semibold transition-all duration-200',
              view === 'calendar' ? 'opacity-100' : 'opacity-80'
            )}
          >
            Calendar
          </span>
        </button>
      </div>
    </nav>
  );
}
