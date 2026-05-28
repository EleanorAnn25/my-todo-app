'use client';

import { Upload } from 'lucide-react';
import { ChangeEvent, useRef } from 'react';

import { parseImportFile } from '@/lib/excelUtils';
import { Todo } from '@/types/todo';

import { Button } from '../ui/button';

interface ImportButtonProps {
  className?: string;
  onImport: (newTodos: Omit<Todo, 'id' | 'createdAt' | 'updatedAt' | 'order'>[]) => void;
  showLabel?: boolean;
}

export function ImportButton({ className, onImport, showLabel }: ImportButtonProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImport = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const importedTasks = await parseImportFile(file);
      onImport(importedTasks);
      alert(`Successfully imported ${importedTasks.length} tasks!`);
    } catch (error) {
      console.error('Failed to import todos:', error);
      alert(
        'Failed to import tasks. Please check the file format and ensure headings contain "Title" and "Category".'
      );
    }

    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <>
      <input
        ref={fileRef}
        type="file"
        accept=".csv,.xlsx,.xls"
        onChange={handleImport}
        className="hidden"
        aria-label="Import tasks file"
      />
      <Button
        variant="ghost"
        size={showLabel ? 'default' : 'icon'}
        onClick={() => fileRef.current?.click()}
        className={className}
        title="Import Tasks (CSV or Excel)"
        aria-label="Import tasks"
      >
        <Upload size={16} />
        {showLabel && <span className="hidden sm:inline ml-2 text-sm">Import</span>}
      </Button>
    </>
  );
}
