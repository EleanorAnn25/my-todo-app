import { Todo, TodoFormData } from '@/types/todo';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { TodoFormContent } from './TodoFormContent';

interface TodoFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TodoFormData) => void;
  initialData?: Partial<Todo>;
  mode: 'add' | 'edit';
}

export function TodoFormDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  mode,
}: TodoFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">
            {mode === 'add' ? 'New Task' : 'Edit Task'}
          </DialogTitle>
        </DialogHeader>

        {open && (
          <TodoFormContent
            key={initialData?.id ?? 'new-task'}
            initialData={initialData}
            onSubmit={onSubmit}
            onCancel={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
