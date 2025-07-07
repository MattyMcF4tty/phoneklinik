'use client';

import { useState, useEffect } from 'react';

export default function useSessionStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void, boolean] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const item = sessionStorage.getItem(key);
      if (item !== null) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error('Error reading sessionStorage:', error);
    } finally {
      setIsHydrated(true);
    }
  }, [key]);

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error setting sessionStorage:', error);
    }
  };

  return [storedValue, setValue, isHydrated];
}
