'use client';

import { useCallback, useMemo, useState } from 'react';

import { useTodos } from '@/hooks/useTodos';
import { DEFAULT_FILTERS, DEFAULT_PAGINATION } from '@/lib/configMap';
import { Todo, TodoFilters, TodoFormData, View } from '@/types/todo';

import { DesktopNav } from '@/components/layout/DesktopNav';
import { MobileNav } from '@/components/layout/MobileNav';
import { Loading } from '@/components/shared/Loading';
import { FilterToolbar } from '@/components/todo/FilterToolbar';
import { PaginationControls } from '@/components/todo/PaginationControls';
import { TodoFormDialog } from '@/components/todo/TodoFormDialog';
import { TodoList } from '@/components/todo/TodoList';

export default function Home() {
  const {
    todos,
    isLoaded,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    reorderTodos,
    importTodos,
    filterAndSortTodos,
  } = useTodos();

  const [view, setView] = useState<View>('list');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
  const [dialogState, setDialogState] = useState<'add' | Todo | null>(null);

  const openAddDialog = () => setDialogState('add');
  const openEditDialog = (todo: Todo) => setDialogState(todo);
  const closeDialog = () => setDialogState(null);

  const filteredTodos = useMemo(() => filterAndSortTodos(filters), [filterAndSortTodos, filters]);

  const paginatedTodos = useMemo(() => {
    const totalPages = Math.max(1, Math.ceil(filteredTodos.length / pagination.itemsPerPage));
    const boundedPage = Math.min(pagination.currentPage, totalPages);

    const start = (boundedPage - 1) * pagination.itemsPerPage;

    return filteredTodos.slice(start, start + pagination.itemsPerPage);
  }, [filteredTodos, pagination]);

  const handleFiltersChange = useCallback((newFilters: TodoFilters) => {
    setFilters(newFilters);
    setPagination((p) => (p.currentPage === 1 ? p : { ...p, currentPage: 1 }));
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
            <div className="font-serif font-semibold text-base sm:text-lg text-neutral-900 tracking-light pointer-events-none">
              My To-Do
            </div>

            <DesktopNav view={view} setView={setView} onAdd={openAddDialog} />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-28">
        <div className="bg-white rounded-xl border border-neutral-100">
          <div className="border-b border-neutral-100">
            <FilterToolbar
              filters={filters}
              onChange={handleFiltersChange}
              hasActiveFilters={hasActiveFilters}
              onImport={importTodos}
              todos={todos}
            />
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
                    closeDialog();
                  }}
                  className="ml-2 text-neutral-800 underline underline-offset-2 hover:no-underline"
                >
                  Clear
                </button>
              </p>
            </div>
          )}

          {/* List */}
          <TodoList
            todos={paginatedTodos}
            onReorder={reorderTodos}
            onToggle={toggleTodo}
            onEdit={openEditDialog}
            onDelete={deleteTodo}
            isReorderEnabled={filters.sortOrder === 'none'}
          />

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
        </div>
      </main>

      <MobileNav view={view} setView={setView} onAdd={openAddDialog} />

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
  );
}
