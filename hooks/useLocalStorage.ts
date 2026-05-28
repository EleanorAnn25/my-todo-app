'use client';

import { startTransition, useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'my-todo-app';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    startTransition(() => {
      try {
        const stored = window.localStorage.getItem(key);
        if (stored !== null) {
          setValue(JSON.parse(stored) as T);
        }
      } catch (err) {
        console.warn(`Error reading localStorage key "${key}":`, err);
      } finally {
        setIsLoaded(true);
      }
    });
  }, [key]);

  const set = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved =
          typeof newValue === 'function' ? (newValue as (prev: T) => T)(prev) : newValue;
        try {
          window.localStorage.setItem(key, JSON.stringify(resolved));
        } catch (err) {
          console.warn(`Error writing localStorage key "${key}":`, err);
        }
        return resolved;
      });
    },
    [key]
  );

  return { value, set, isLoaded };
}

export { STORAGE_KEY };
