import { ReactNode } from 'react';

export type View = 'list' | 'calendar';

export type Category = 'Work' | 'Personal' | 'Urgent' | 'Other';

export type SortOrder = 'asc' | 'desc' | 'none';

export type Status = 'all' | 'completed' | 'incomplete';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  category: Category;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  order: number;
}

export interface TodoFormData {
  title: string;
  description: string;
  category: Category;
  dueDate: string;
}

export interface TodoFilters {
  search: string;
  status: Status;
  category: Category | 'all';
  sortOrder: SortOrder;
}

export interface DropdownOption {
  value: string;
  label: ReactNode;
}

export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
}
