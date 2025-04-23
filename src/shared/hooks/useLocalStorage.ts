import { useState, useEffect, useCallback } from 'react';

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // Получаем сохраненное значение из localStorage
  const readValue = useCallback((): T => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [key, initialValue]);

  // Устанавливаем начальное состояние
  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Функция для обновления значения в состоянии и localStorage
  const setValue = (value: T) => {
    try {
      // Сохраняем в состоянии
      setStoredValue(value);
      // Сохраняем в localStorage
      window.localStorage.setItem(key, JSON.stringify(value));
      // Вызываем событие storage для уведомления других компонентов
      window.dispatchEvent(new Event('local-storage'));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Слушаем изменения localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      setStoredValue(readValue());
    };

    // Слушаем как стандартное событие storage, так и наше кастомное
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('local-storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('local-storage', handleStorageChange);
    };
  }, [readValue]);

  return [storedValue, setValue];
}

export default useLocalStorage; 