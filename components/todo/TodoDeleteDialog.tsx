'use client';

import { Todo } from '@/types/todo';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';

interface TodoDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  todo: Todo | null;
}

export function TodoDeleteDialog({ open, onOpenChange, onConfirm, todo }: TodoDeleteDialogProps) {
  if (!todo) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-lg border border-neutral-100 shadow-xl">
        <DialogHeader className="text-left">
          <DialogTitle className="font-serif text-xl text-neutral-900">Delete Task</DialogTitle>
          <DialogDescription className="text-sm text-neutral-500 pt-2 leading-relaxed">
            Are you sure you want to delete{' '}
            <span className="font-medium text-neutral-800">“{todo.title}”</span>? This action cannot
            be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-neutral-50">
          <Button
            variant="outline"
            className="h-9 px-4 text-xs font-medium text-neutral-600 hover:bg-neutral-50 rounded-md transition-colors"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button
            variant="destructive"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            Delete Task
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
