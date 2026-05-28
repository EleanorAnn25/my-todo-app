import { ComponentPropsWithoutRef } from 'react';

import { cn } from '@/lib/utils';

import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface TextInputProps extends Omit<
  ComponentPropsWithoutRef<typeof Input>,
  'value' | 'onChange'
> {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  labelClassName?: string;
  className?: string;
}

export function TextInput({
  label,
  value,
  onChange,
  placeholder,
  error,
  labelClassName,
  className = '',
  ...props
}: TextInputProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <Label htmlFor={label} className={cn(error && 'text-rose-400', labelClassName)}>
          {label}
        </Label>
      )}

      <Input
        id={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'h-10 sm:h-9',
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
