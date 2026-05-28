'use client';

import { Plus, SlidersHorizontal, X } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

import { useTodos } from '@/hooks/useTodos';
import { DEFAULT_FILTERS, DEFAULT_PAGINATION } from '@/lib/configMap';
import { Todo, TodoFilters, TodoFormData } from '@/types/todo';

import { Loading } from '@/components/shared/Loading';
import { FilterToolbar } from '@/components/todo/FilterToolbar';
import { PaginationControls } from '@/components/todo/PaginationControls';
import { SearchInput } from '@/components/todo/SearchInput';
import { TodoFormDialog } from '@/components/todo/TodoFormDialog';
import { TodoItem } from '@/components/todo/TodoItem';
import { Button } from '@/components/ui/button';

export default function Home() {
  const { todos, isLoaded, addTodo, updateTodo, deleteTodo, toggleTodo, filterAndSortTodos } =
    useTodos();

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
  const [dialogState, setDialogState] = useState<'add' | Todo | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const openAddDialog = () => setDialogState('add');
  const openEditDialog = (todo: Todo) => setDialogState(todo);
  const closeDialog = () => setDialogState(null);

  const filteredTodos = useMemo(() => filterAndSortTodos(filters), [filterAndSortTodos, filters]);

  const paginatedTodos = useMemo(() => {
    const start = (pagination.currentPage - 1) * pagination.itemsPerPage;

    return filteredTodos.slice(start, start + pagination.itemsPerPage);
  }, [filteredTodos, pagination]);

  const handleFiltersChange = useCallback((newFilters: TodoFilters) => {
    setFilters(newFilters);
    setPagination((p) => ({ ...p, currentPage: 1 }));
  }, []);

  const handleAdd = useCallback(
    (data: TodoFormData) => {
      addTodo({
        title: data.title,
        description: data.description || undefined,
        category: data.category,
        dueDate: data.dueDate || undefined,
      });
    },
    [addTodo]
  );

  const handleEdit = useCallback(
    (id: string, data: TodoFormData) => {
      if (!id) return;

      updateTodo(id, {
        title: data.title,
        description: data.description || undefined,
        category: data.category,
        dueDate: data.dueDate || undefined,
      });
    },
    [updateTodo]
  );

  const handleSubmit = useCallback(
    (formData: TodoFormData) => {
      if (dialogState === 'add') {
        handleAdd(formData);
      } else if (typeof dialogState === 'object' && dialogState !== null) {
        handleEdit(dialogState.id, formData);
      }
      closeDialog();
    },
    [dialogState, handleAdd, handleEdit]
  );

  const hasActiveFilters =
    filters.search !== '' ||
    filters.status !== 'all' ||
    filters.category !== 'all' ||
    filters.sortOrder !== 'none';

  if (!isLoaded) return <Loading />;

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-white border-b border-neutral-100 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="font-serif text-base sm:text-lg text-neutral-900 tracking-light">
              My To-Do
            </div>

            <div className="flex items-center gap-2">
              <Button size="sm" onClick={openAddDialog}>
                <Plus size={14} />
                <span className="hidden sm:inline">Add Task</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="bg-white border border-neutral-100">
          <div className="border-b border-neutral-100">
            <div className="flex items-center gap-2 px-4 py-2.5 sm:hidden">
              <SearchInput filters={filters} onChange={handleFiltersChange} />

              <Button
                variant={filterOpen || hasActiveFilters ? 'default' : 'outline'}
                className="relative"
                onClick={() => setFilterOpen((open) => !open)}
              >
                {filterOpen ? <X size={14} /> : <SlidersHorizontal size={14} />}
                {hasActiveFilters && !filterOpen && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-current" />
                )}
                Filters
              </Button>
            </div>

            {/* Mobile Filter Panel */}
            {filterOpen && (
              <div className="px-4 pb-3 sm:hidden border-t border-neutral-100">
                <FilterToolbar filters={filters} onChange={handleFiltersChange} mobileMode />
              </div>
            )}

            {/* Desktop Filter Panel */}
            <div className="hidden sm:block px-4 py-3">
              <FilterToolbar filters={filters} onChange={handleFiltersChange} />
            </div>

            {/* Active Filter Notice */}
            {hasActiveFilters && (
              <div className="px-4 py-2 bg-neutral-50 border-b border-neutral-100">
                <p className="text-xs text-neutral-500">
                  {filteredTodos.length} task{filteredTodos.length !== 1 ? 's' : ''} match your
                  filters
                  <button
                    type="button"
                    onClick={() => {
                      handleFiltersChange(DEFAULT_FILTERS);
                      setFilterOpen(false);
                    }}
                    className="ml-2 text-neutral-800 underline underline-offset-2 hover:no-underline"
                  >
                    Clear
                  </button>
                </p>
              </div>
            )}
          </div>

          {/* List */}
          {/* // TODO: add Drag-and-Drop Reordering */}
          {paginatedTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onEdit={openEditDialog}
              onDelete={deleteTodo}
            />
          ))}

          {/* Pagination */}
          {filteredTodos.length > 0 && (
            <div className="px-4 pb-4">
              <PaginationControls
                pagination={pagination}
                totalItems={filteredTodos.length}
                onPageChange={(p) => setPagination((prev) => ({ ...prev, currentPage: p }))}
                onItemsPerPageChange={(n) => setPagination({ currentPage: 1, itemsPerPage: n })}
              />
            </div>
          )}

          <TodoFormDialog
            key={dialogState === 'add' ? 'add' : (dialogState as Todo)?.id || 'closed'}
            open={dialogState !== null}
            onOpenChange={(isOpen) => {
              if (!isOpen) closeDialog();
            }}
            mode={dialogState === 'add' ? 'add' : 'edit'}
            initialData={
              typeof dialogState === 'object' && dialogState !== null ? dialogState : undefined
            }
            onSubmit={handleSubmit}
          />
        </div>
      </main>
    </div>
  );
}
