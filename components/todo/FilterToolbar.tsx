import { SlidersHorizontal } from 'lucide-react';
import { useEffect, useState } from 'react';

import { CATEGORY_OPTIONS, SORT_OPTIONS, STATUS_OPTIONS } from '@/lib/configMap';
import { Category, SortOrder, Status, Todo, TodoFilters } from '@/types/todo';

import { Dropdown } from '../shared/Dropdown';
import { Button } from '../ui/button';
import { ExportButton } from './ExportButton';
import { ImportButton } from './ImportButton';
import { SearchInput } from './SearchInput';

interface FilterToolbarProps {
  filters: TodoFilters;
  onChange: (filters: TodoFilters) => void;
  hasActiveFilters: boolean;
  onImport: (newTodos: Omit<Todo, 'id' | 'createdAt' | 'updatedAt' | 'order'>[]) => void;
  todos: Todo[];
}

export function FilterToolbar({
  filters,
  onChange,
  hasActiveFilters,
  onImport,
  todos,
}: FilterToolbarProps) {
  const [filterOpen, setFilterOpen] = useState(false);

  const activeFilterCount = [
    filters.search !== '',
    filters.status !== 'all',
    filters.category !== 'all',
    filters.sortOrder !== 'none',
  ].filter(Boolean).length;

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 640px)');

    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) {
        setFilterOpen(true);
      }
    };

    handleChange(mediaQuery);

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const update = (patch: Partial<TodoFilters>) => onChange({ ...filters, ...patch });

  return (
    <div>
      <div className="flex items-center gap-2 px-4 py-2.5">
        <SearchInput filters={filters} onChange={onChange} />

        <Button
          variant={filterOpen || hasActiveFilters ? 'default' : 'outline'}
          className="relative px-2 sm:px-3 h-8 sm:h-9"
          onClick={() => setFilterOpen((open) => !open)}
          aria-label="Toggle filters"
        >
          <SlidersHorizontal size={14} />
          <span className="hidden sm:inline ml-2 text-sm">Filters</span>

          {activeFilterCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-neutral-400 text-white text-2xs font-bold flex items-center justify-center ring-1 ring-neutral-50">
              {activeFilterCount}
            </span>
          )}
        </Button>

        <div className="flex items-center gap-1 sm:gap-2 border-l border-neutral-100 pl-2 shrink-0">
          <ImportButton onImport={onImport} showLabel className="h-8 sm:h-9" />
          <ExportButton todos={todos} showLabel className="h-8 sm:h-9" />
        </div>
      </div>

      {filterOpen && (
        <div className="px-4 pb-3 pt-2 border-t border-neutral-100 flex flex-col sm:flex-row gap-3">
          <div className="flex-1 sm:flex-2">
            <Dropdown
              label="Status"
              value={filters.status}
              onChange={(v) => update({ status: v as Status })}
              options={STATUS_OPTIONS}
              labelClassName="text-2xs uppercase tracking-wider text-neutral-400 font-medium"
              className="w-full h-8 text-sm"
            />
          </div>

          <div className="flex-1 sm:flex-2">
            <Dropdown
              label="Category"
              value={filters.category}
              onChange={(v) => update({ category: v as Category })}
              options={CATEGORY_OPTIONS}
              labelClassName="text-2xs uppercase tracking-wider text-neutral-400 font-medium"
              className="w-full h-8 text-sm"
            />
          </div>

          <div className="flex-1 sm:flex-3">
            <Dropdown
              label="Sort by due date"
              value={filters.sortOrder}
              onChange={(v) => update({ sortOrder: v as SortOrder })}
              options={SORT_OPTIONS}
              labelClassName="text-2xs uppercase tracking-wider text-neutral-400 font-medium"
              className="w-full h-8 text-sm"
            />
          </div>
        </div>
      )}
    </div>
  );
}
