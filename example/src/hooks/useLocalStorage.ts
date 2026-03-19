import { useState, useEffect } from 'react';
import { getLocalStorage, setLocalStorage } from '../utils/storage';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);

  useEffect(() => {
    const stored = getLocalStorage(key);
    if (stored) {
      setValue(JSON.parse(stored));
    }
  }, [key]);

  const updateValue = (newValue: T) => {
    setValue(newValue);
    setLocalStorage(key, JSON.stringify(newValue));
  };

  return [value, updateValue] as const;
}
