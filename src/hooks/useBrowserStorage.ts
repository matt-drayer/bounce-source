import { useState } from 'react';

type storageType = 'localStorage' | 'sessionStorage' | undefined;

const useBrowserStorage = <S>(
  key: string,
  initialValue: S,
  storage: storageType = 'localStorage',
) => {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<S>(() => {
    try {
      // Get from local storage by key
      const item = window[storage].getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage.
  const setValue = (value: any) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      window[storage].setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // A more advanced implementation would handle the error case
    }
  };

  return [storedValue, setValue] as [S, (value: S) => void];
};

export default useBrowserStorage;
