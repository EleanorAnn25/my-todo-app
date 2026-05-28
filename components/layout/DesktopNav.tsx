import { CalendarDays, ListTodo, Plus } from 'lucide-react';

import { View } from '@/types/todo';

import { Button } from '../ui/button';
import { ButtonGroup } from '../ui/button-group';

interface DesktopNavProps {
  view: View;
  setView: (val: View) => void;
  onAdd: () => void;
}

export function DesktopNav({ view, setView, onAdd }: DesktopNavProps) {
  return (
    <div className="hidden sm:flex items-center gap-3">
      <ButtonGroup>
        <Button
          variant={view === 'list' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setView('list')}
        >
          <ListTodo size={14} />
          List
        </Button>
        <Button
          variant={view === 'calendar' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setView('calendar')}
        >
          <CalendarDays size={14} />
          Calendar
        </Button>
      </ButtonGroup>

      <Button size="sm" onClick={onAdd}>
        <Plus size={14} />
        Add Task
      </Button>
    </div>
  );
}
