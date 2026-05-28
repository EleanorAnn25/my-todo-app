import { CATEGORY_OPTIONS, SORT_OPTIONS, STATUS_OPTIONS } from '@/lib/configMap';
import { Category, SortOrder, Status, TodoFilters } from '@/types/todo';

import { Dropdown } from '../shared/Dropdown';
import { SearchInput } from './SearchInput';

interface FilterToolbarProps {
  filters: TodoFilters;
  onChange: (filters: TodoFilters) => void;
  mobileMode?: boolean;
}

export function FilterToolbar({ filters, onChange, mobileMode }: FilterToolbarProps) {
  const update = (patch: Partial<TodoFilters>) => onChange({ ...filters, ...patch });

  if (mobileMode)
    return (
      <div className="grid grid-cols-2 gap-2 mt-2">
        <Dropdown
          label="Status"
          value={filters.status}
          onChange={(v) => update({ status: v as Status })}
          options={STATUS_OPTIONS}
          labelClassName="text-2xs uppercase tracking-wider text-neutral-400 font-medium"
        />

        <Dropdown
          label="Category"
          value={filters.category}
          onChange={(v) => update({ category: v as Category })}
          options={CATEGORY_OPTIONS}
          labelClassName="text-2xs uppercase tracking-wider text-neutral-400 font-medium"
        />

        <Dropdown
          label="Sort by due date"
          value={filters.sortOrder}
          onChange={(v) => update({ sortOrder: v as SortOrder })}
          options={SORT_OPTIONS}
          containerClassName="col-span-2"
          labelClassName="text-2xs uppercase tracking-wider text-neutral-400 font-medium"
        />
      </div>
    );

  return (
    <div className="flex flex-wrap items-center gap-2">
      <SearchInput filters={filters} onChange={onChange} />

      <Dropdown
        label="Status"
        value={filters.status}
        onChange={(v) => update({ status: v as Status })}
        options={STATUS_OPTIONS}
        labelClassName="text-2xs uppercase tracking-wider text-neutral-400 font-medium"
        className="w-36 h-8 text-sm"
      />

      <Dropdown
        label="Category"
        value={filters.category}
        onChange={(v) => update({ category: v as Category })}
        options={CATEGORY_OPTIONS}
        labelClassName="text-2xs uppercase tracking-wider text-neutral-400 font-medium"
        className="w-36 h-8 text-sm"
      />

      <Dropdown
        label="Sort by due date"
        value={filters.sortOrder}
        onChange={(v) => update({ sortOrder: v as SortOrder })}
        options={SORT_OPTIONS}
        containerClassName="col-span-2"
        labelClassName="text-2xs uppercase tracking-wider text-neutral-400 font-medium"
        className="w-40 h-8 text-sm"
      />
    </div>
  );
}
