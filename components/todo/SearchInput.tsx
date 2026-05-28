import { LucideIcon, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';
import { TodoFilters } from '@/types/todo';

import { Input } from '../ui/input';

interface SearchInputProps {
  filters: TodoFilters;
  onChange: (filters: TodoFilters) => void;
  placeholder?: string;
  icon?: LucideIcon;
  containerClassName?: string;
  className?: string;
}

export function SearchInput({
  filters,
  onChange,
  placeholder = 'Search...',
  icon: Icon = Search,
  containerClassName = 'relative flex-1 sm:min-w-40',
  className = '',
  ...props
}: SearchInputProps) {
  const [localValue, setLocalValue] = useState(() => filters.search);

  const debouncedValue = useDebounce(localValue, 300);

  useEffect(() => {
    if (debouncedValue !== filters.search) {
      onChange({
        ...filters,
        search: debouncedValue,
      });
    }
  }, [debouncedValue, filters, onChange]);

  const handleClear = () => {
    setLocalValue('');
    onChange({ ...filters, search: '' });
  };

  return (
    <div className={cn('relative flex-1 min-w-0', containerClassName)}>
      <Icon
        size={14}
        className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
      />

      <Input
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className={cn('pl-8 h-8 text-sm', className)}
        {...props}
      />

      {localValue && (
        <button
          onClick={handleClear}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors"
          aria-label="Clear search"
        >
          <X size={12} />
        </button>
      )}
    </div>
  );
}
