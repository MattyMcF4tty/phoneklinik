'use client';

import { useState, useEffect } from 'react';

export default function useSessionStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const item = sessionStorage.getItem(key);
      if (item !== null) {
        setStoredValue(JSON.parse(item));
      } else {
        sessionStorage.setItem(key, JSON.stringify(initialValue));
      }
    } catch (error) {
      console.error('Error reading sessionStorage:', error);
    }
  }, [key, initialValue]);

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error setting sessionStorage:', error);
    }
  };

  return [storedValue, setValue];
}
