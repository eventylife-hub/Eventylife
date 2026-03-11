'use client';

import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

/**
 * Composant de pagination avec navigation et numéros de page
 * Affiche max 7 boutons avec ellipsis si besoin
 */
export function Pagination({ currentPage, totalPages, onPageChange, className = '' }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = (): (number | '...')[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | '...')[] = [1];

    if (currentPage > 3) pages.push('...');

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) pages.push('...');

    pages.push(totalPages);
    return pages;
  };

  return (
    <nav className={`flex items-center justify-center gap-1 ${className}`} aria-label="Pagination">
      {/* Précédent */}
      <button type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ background: '#fff', color: 'var(--navy, #1A1A2E)', border: '1.5px solid #E5E0D8' }}
        aria-label="Page précédente"
      >
        ‹
      </button>

      {/* Numéros */}
      {getPageNumbers().map((page, idx: number) =>
        page === '...' ? (
          <span key={`ellipsis-${idx}`} className="px-3 py-2 text-sm" style={{ color: '#6B7280' }}>
            …
          </span>
        ) : (
          <button type="button"
            key={page}
            onClick={() => onPageChange(page)}
            className="px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200"
            style={
              page === currentPage
                ? { background: 'var(--terra, #C75B39)', color: '#fff', border: '1.5px solid var(--terra, #C75B39)' }
                : { background: '#fff', color: 'var(--navy, #1A1A2E)', border: '1.5px solid #E5E0D8' }
            }
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        ),
      )}

      {/* Suivant */}
      <button type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ background: '#fff', color: 'var(--navy, #1A1A2E)', border: '1.5px solid #E5E0D8' }}
        aria-label="Page suivante"
      >
        ›
      </button>
    </nav>
  );
}
