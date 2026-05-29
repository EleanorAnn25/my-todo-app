import { nanoid } from 'nanoid';
import { useCallback, useMemo } from 'react';

import { Todo, TodoFilters } from '@/types/todo';
import { STORAGE_KEY, useLocalStorage } from './useLocalStorage';

export function useTodos() {
  const { value: todos, set: setTodos, isLoaded } = useLocalStorage<Todo[]>(STORAGE_KEY, []);

  const addTodo = useCallback(
    (data: Omit<Todo, 'id' | 'completed' | 'createdAt' | 'updatedAt' | 'order'>) => {
      const newTodo: Todo = {
        ...data,
        id: nanoid(),
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        order: Date.now(),
      };

      setTodos((prev) => [...prev, newTodo]);

      return newTodo;
    },
    [setTodos]
  );

  const updateTodo = useCallback(
    (id: string, data: Partial<Omit<Todo, 'id' | 'createdAt'>>) => {
      setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, ...data } : t)));
    },
    [setTodos]
  );

  const deleteTodo = useCallback(
    (id: string) => {
      setTodos((prev) => prev.filter((t) => t.id !== id));
    },
    [setTodos]
  );

  const toggleTodo = useCallback(
    (id: string) => {
      setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
    },
    [setTodos]
  );

  const reorderTodos = useCallback(
    (orderedIds: string[]) => {
      setTodos((prev) => {
        const reorderedIdsSet = new Set(orderedIds);
        const reorderedItems = prev.filter((t) => reorderedIdsSet.has(t.id));

        if (reorderedItems.length === 0) return prev;

        const originalOrders = reorderedItems.map((t) => t.order).sort((a, b) => a - b);

        const idToNewOrder = new Map<string, number>();
        orderedIds.forEach((id, index) => {
          if (index < originalOrders.length) {
            idToNewOrder.set(id, originalOrders[index]);
          }
        });

        return prev.map((t) => {
          if (idToNewOrder.has(t.id)) {
            return { ...t, order: idToNewOrder.get(t.id)! };
          }
          return t;
        });
      });
    },
    [setTodos]
  );

  const importTodos = useCallback(
    (newTodos: Omit<Todo, 'id' | 'createdAt' | 'updatedAt' | 'order'>[]) => {
      const now = new Date().toISOString();
      const imported: Todo[] = newTodos.map((t, idx) => ({
        ...t,
        id: nanoid(),
        createdAt: now,
        updatedAt: now,
        order: Date.now() + idx,
      }));

      setTodos((prev) => [...prev, ...imported]);
    },
    [setTodos]
  );

  const filterAndSortTodos = useCallback(
    (filters: TodoFilters): Todo[] => {
      let result = [...todos];

      if (filters.search.trim()) {
        const q = filters.search.toLowerCase();
        result = result.filter(
          (t) => t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q)
        );
      }

      if (filters.status === 'completed') {
        result = result.filter((t) => t.completed);
      } else if (filters.status === 'incomplete') {
        result = result.filter((t) => !t.completed);
      }

      if (filters.category !== 'all') {
        result = result.filter((t) => t.category === filters.category);
      }

      if (filters.sortOrder === 'asc') {
        result.sort((a, b) => {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;

          return a.dueDate.localeCompare(b.dueDate);
        });
      } else if (filters.sortOrder === 'desc') {
        result.sort((a, b) => {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;

          return b.dueDate.localeCompare(a.dueDate);
        });
      } else {
        result.sort((a, b) => a.order - b.order);
      }

      return result;
    },
    [todos]
  );

  const todosByDate = useMemo(() => {
    const map = new Map<string, Todo[]>();
    todos.forEach((t) => {
      if (t.dueDate) {
        const existing = map.get(t.dueDate) ?? [];
        map.set(t.dueDate, [...existing, t]);
      }
    });
    return map;
  }, [todos]);

  return {
    todos,
    isLoaded,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    reorderTodos,
    importTodos,
    filterAndSortTodos,
    todosByDate,
  };
}
