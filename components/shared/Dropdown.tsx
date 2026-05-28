import { cn } from '@/lib/utils';
import { DropdownOption } from '@/types/todo';

import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface DropdownProps<T extends DropdownOption | string | number> {
  label?: string;
  value: string;
  onChange: (value: string | null) => void;
  options: readonly T[] | T[];
  containerClassName?: string;
  labelClassName?: string;
  className?: string;
}

export function Dropdown<T extends DropdownOption | string | number>({
  label,
  value,
  onChange,
  options,
  containerClassName,
  labelClassName,
  className = 'h-8 text-sm w-full',
}: DropdownProps<T>) {
  const selectedOption = options.find((opt) => {
    if (typeof opt === 'string' || typeof opt === 'number') {
      return String(opt) === value;
    }
    return (opt as DropdownOption).value === value;
  });

  const displayLabel = selectedOption
    ? typeof selectedOption === 'string' || typeof selectedOption === 'number'
      ? String(selectedOption)
      : (selectedOption as DropdownOption).label
    : value;

  return (
    <div className={cn('space-y-1', containerClassName)}>
      {label && (
        <Label htmlFor={label} className={cn(labelClassName)}>
          {label}
        </Label>
      )}

      <Select id={label} value={value} onValueChange={onChange}>
        <SelectTrigger className={cn(className)}>
          <SelectValue>{displayLabel}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map((option, idx) => {
            const isPrimitive = typeof option === 'string' || typeof option === 'number';

            const optValue = isPrimitive ? String(option) : (option as DropdownOption).value;
            const optLabel = isPrimitive ? String(option) : (option as DropdownOption).label;

            return (
              <SelectItem key={`${optValue}-${idx}`} value={optValue}>
                {optLabel}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
