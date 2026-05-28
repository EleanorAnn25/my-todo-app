'use client';

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { Todo } from '@/types/todo';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onReorder: (orderedIds: string[]) => void;
  isReorderEnabled?: boolean;
}

export function TodoList({ 
  todos, 
  onToggle, 
  onEdit, 
  onDelete, 
  onReorder,
  isReorderEnabled = true 
}: TodoListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = todos.findIndex((t) => t.id === active.id);
      const newIndex = todos.findIndex((t) => t.id === over.id);

      const newOrder = arrayMove(todos, oldIndex, newIndex);
      onReorder(newOrder.map((t) => t.id));
    }
  };

  if (todos.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-neutral-400 font-light tracking-wide">No tasks found</p>
      </div>
    );
  }

  const listContent = (
    <div className="flex flex-col">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
          isDraggable={isReorderEnabled}
        />
      ))}
    </div>
  );

  if (!isReorderEnabled) {
    return listContent;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis]}
    >
      <SortableContext items={todos.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        {listContent}
      </SortableContext>
    </DndContext>
  );
}
