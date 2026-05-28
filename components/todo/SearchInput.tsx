import { LucideIcon, Search } from 'lucide-react';

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
  const update = (patch: Partial<TodoFilters>) => onChange({ ...filters, ...patch });

  return (
    <div className={cn(containerClassName)}>
      <Icon
        size={14}
        className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
      />
      <Input
        value={filters.search}
        onChange={(e) => update({ search: e.target.value })}
        placeholder={placeholder}
        className={cn('pl-8 h-8 text-sm', className)}
        {...props}
      />
    </div>
  );
}
