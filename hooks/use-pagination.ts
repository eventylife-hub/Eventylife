import { useState, useCallback, useMemo } from 'react';

interface UsePaginationOptions {
  /** Nombre d'éléments par page (défaut: 20) */
  pageSize?: number;
  /** Page initiale (défaut: 1) */
  initialPage?: number;
  /** Scroll vers le haut lors du changement de page (défaut: true) */
  scrollToTop?: boolean;
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
  const { pageSize = 20, initialPage = 1, scrollToTop = true } = options;
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

  const scrollUp = useCallback(() => {
    if (scrollToTop && typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [scrollToTop]);

  const setPage = useCallback(
    (page: number) => {
      const clamped = Math.max(1, Math.min(page, totalPages));
      setCurrentPage((prev) => {
        if (prev !== clamped) scrollUp();
        return clamped;
      });
    },
    [totalPages, scrollUp],
  );

  const nextPage = useCallback(() => {
    setCurrentPage((prev) => {
      const next = Math.min(prev + 1, totalPages);
      if (prev !== next) scrollUp();
      return next;
    });
  }, [totalPages, scrollUp]);

  const prevPage = useCallback(() => {
    setCurrentPage((prev) => {
      const next = Math.max(prev - 1, 1);
      if (prev !== next) scrollUp();
      return next;
    });
  }, [scrollUp]);

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
