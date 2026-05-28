import { Download } from 'lucide-react';

import { exportToExcel } from '@/lib/excelUtils';
import { Todo } from '@/types/todo';

import { Button } from '../ui/button';

interface ExportButtonProps {
  className?: string;
  todos: Todo[];
  showLabel?: boolean;
}

export function ExportButton({ className, todos, showLabel }: ExportButtonProps) {
  return (
    <Button
      variant="ghost"
      size={showLabel ? 'default' : 'icon'}
      onClick={() => exportToExcel(todos)}
      disabled={todos.length === 0}
      className={className}
      title="Export Tasks as Excel"
      aria-label="Export tasks"
    >
      <Download size={16} />
      {showLabel && <span className="hidden sm:inline ml-2 text-sm">Export</span>}
    </Button>
  );
}
