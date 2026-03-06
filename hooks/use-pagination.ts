import { useState, useCallback, useMemo } from 'react';

interface UsePaginationOptions {
  /** Nombre d'éléments par page (défaut: 20) */
  pageSize?: number;
  /** Page initiale (défaut: 1) */
  initialPage?: number;
}

interface UsePaginationReturn {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  offset: number;
  setPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  setTotalItems: (total: number) => void;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * Hook de pagination — gère l'état de pagination côté client
 * Compatible avec la pagination cursor-based du backend
 */
export function usePagination(options: UsePaginationOptions = {}): UsePaginationReturn {
  const { pageSize = 20, initialPage = 1 } = options;
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalItems, setTotalItems] = useState(0);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalItems / pageSize)),
    [totalItems, pageSize],
  );

  const offset = useMemo(
    () => (currentPage - 1) * pageSize,
    [currentPage, pageSize],
  );

  const setPage = useCallback(
    (page: number) => {
      setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    },
    [totalPages],
  );

  const nextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  }, []);

  return {
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    offset,
    setPage,
    nextPage,
    prevPage,
    setTotalItems,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
}
