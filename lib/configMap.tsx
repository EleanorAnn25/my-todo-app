import { Category, DropdownOption, PaginationState, TodoFilters } from '@/types/todo';

export const CATEGORIES: Category[] = ['Work', 'Personal', 'Urgent', 'Other'];

export const CATEGORY_COLORS: Record<Category, string> = {
  Work: '#8B9B8E',
  Personal: '#9B8FA0',
  Urgent: '#B08A7A',
  Other: '#8A9AAF',
};

export const CATEGORY_LIGHT_COLORS: Record<Category, string> = {
  Work: '#E8EDE9',
  Personal: '#EDE8EF',
  Urgent: '#EFE6E2',
  Other: '#E5E9EE',
};

export const DEFAULT_FILTERS: TodoFilters = {
  search: '',
  status: 'all',
  category: 'all',
  sortOrder: 'none',
};

export const STATUS_OPTIONS: DropdownOption[] = [
  { value: 'all', label: 'All tasks' },
  { value: 'incomplete', label: 'Incomplete' },
  { value: 'completed', label: 'Completed' },
];

export const SORT_OPTIONS: DropdownOption[] = [
  { value: 'none', label: 'Default order' },
  { value: 'asc', label: 'Earliest first' },
  { value: 'desc', label: 'Latest first' },
];

export const CATEGORY_OPTIONS: DropdownOption[] = [
  { value: 'all', label: 'All categories' },
  ...CATEGORIES.map((cat) => ({
    value: cat,
    label: (
      <span className="flex items-center gap-2">
        <span
          className="inline-block h-2 w-2 rounded-full"
          style={{ backgroundColor: CATEGORY_COLORS[cat] }}
        />
        {cat}
      </span>
    ),
  })),
];

export const DEFAULT_PAGINATION: PaginationState = {
  currentPage: 1,
  itemsPerPage: 10,
};

export const ITEMS_PER_PAGE_OPTIONS = [5, 10, 15, 20] as const;
