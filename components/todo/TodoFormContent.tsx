import { useState } from 'react';

import { CATEGORY_OPTIONS } from '@/lib/configMap';
import { Category, Todo, TodoFormData } from '@/types/todo';

import { DatePicker } from '../shared/DatePicker';
import { Dropdown } from '../shared/Dropdown';
import { TextInput } from '../shared/TextInput';
import { FormTextarea } from '../shared/Textarea';
import { Button } from '../ui/button';

interface TodoFormContentProps {
  initialData?: Partial<Todo>;
  onSubmit: (data: TodoFormData) => void;
  onCancel: () => void;
}

export function TodoFormContent({ initialData, onSubmit, onCancel }: TodoFormContentProps) {
  const [form, setForm] = useState<TodoFormData>({
    title: initialData?.title ?? '',
    description: initialData?.description ?? '',
    category: (initialData?.category as Category) ?? 'Personal',
    dueDate: initialData?.dueDate ?? '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof TodoFormData, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof TodoFormData, string>> = {};

    if (!form.title.trim()) newErrors.title = 'Title is required';
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit(form);
    onCancel();
  };

  return (
    <div className="space-y-4">
      <TextInput
        label="Title"
        value={form.title}
        onChange={(val) => setForm((prev) => ({ ...prev, title: val }))}
        placeholder="Task title"
        error={errors.title}
        autoFocus
      />

      <FormTextarea
        label="Description"
        value={form.description}
        onChange={(val) => setForm((prev) => ({ ...prev, description: val }))}
        placeholder="Optional notes"
        error={errors.description}
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <Dropdown
          label="Category"
          value={form.category}
          onChange={(v) => setForm((prev) => ({ ...prev, category: v as Category }))}
          options={CATEGORY_OPTIONS}
          labelClassName="space-y-1.5"
        />

        <DatePicker
          label="Due Date"
          value={form.dueDate}
          onChange={(date) => setForm((prev) => ({ ...prev, dueDate: date }))}
          error={errors.dueDate}
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" size="sm" onClick={onCancel} className="h-9 sm:h-8">
          Cancel
        </Button>

        <Button size="sm" onClick={handleSubmit} className="h-9 sm:h-8">
          Save Task
        </Button>
      </div>
    </div>
  );
}
