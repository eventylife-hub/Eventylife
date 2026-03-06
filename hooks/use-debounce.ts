import { useState, useEffect } from 'react';

/**
 * Hook de debounce — retarde la mise à jour d'une valeur
 * Utile pour les champs de recherche (évite les requêtes à chaque frappe)
 * @param value Valeur à debounce
 * @param delay Délai en ms (défaut: 300ms)
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
