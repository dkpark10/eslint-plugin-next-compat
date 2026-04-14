import { useState, useEffect } from 'react';
import { getLocalStorage, setLocalStorage } from '../utils/storage';

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    const stored = getLocalStorage(key);
    if (stored) {
      setValue(JSON.parse(stored));
    }
  }, [key]);

  const updateValue = (newValue) => {
    setValue(newValue);
    setLocalStorage(key, JSON.stringify(newValue));
  };

  return [value, updateValue];
}
