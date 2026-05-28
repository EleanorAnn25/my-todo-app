import { ComponentPropsWithoutRef } from 'react';

import { cn } from '@/lib/utils';

import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

interface FormTextareaProps extends Omit<
  ComponentPropsWithoutRef<typeof Textarea>,
  'value' | 'onChange'
> {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  error?: string;
  labelClassName?: string;
  className?: string;
}

export function FormTextarea({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
  error,
  labelClassName,
  className = '',
  ...props
}: FormTextareaProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <Label htmlFor={label} className={cn(error && 'text-rose-400', labelClassName)}>
          {label}
        </Label>
      )}

      <Textarea
        id={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={cn(
          'h-10 sm:h-9 resize-none',
          error && 'border-rose-300 focus-visible:ring-rose-300',
          className
        )}
        {...props}
      />

      {error && (
        <p className="text-xs text-rose-400 font-medium animate-in fade-in-50 duration-200">
          {error}
        </p>
      )}
    </div>
  );
}
