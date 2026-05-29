import { Category, DropdownOption, PaginationState, TodoFilters } from '@/types/todo';

export const CATEGORIES: Category[] = ['Work', 'Personal', 'Urgent', 'Other'];

export const CATEGORY_COLORS: Record<Category, string> = {
  Work: '#005F56',
  Personal: '#5A189A',
  Urgent: '#B7094C',
  Other: '#4A5560',
};

export const CATEGORY_LIGHT_COLORS: Record<Category, string> = {
  Work: '#E6F2F0',
  Personal: '#F3EBF7',
  Urgent: '#F9E6EE',
  Other: '#F0F2F5',
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

export const WEEKDAYS_FULL = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const WEEKDAYS_SHORT = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
