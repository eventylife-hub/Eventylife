'use client';

import React, { useMemo, useCallback } from 'react';

export interface DataTableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: unknown, row: T) => React.ReactNode;
  width?: string;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  loading?: boolean;
  onRowClick?: (row: T) => void;
  pageable?: boolean;
  onNextPage?: () => void;
  onPrevPage?: () => void;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
  emptyMessage?: string;
  rowActions?: {
    label: string;
    onClick: (row: T) => void;
    variant?: 'default' | 'destructive' | 'outline';
  }[];
}

/**
 * Composant de tableau de données réutilisable
 * Optimisé avec useMemo pour les rendus lourds
 */
export function DataTable<T extends { id: string }>({
  columns,
  data,
  loading = false,
  onRowClick,
  pageable = false,
  onNextPage,
  onPrevPage,
  hasNextPage = false,
  hasPrevPage = false,
  emptyMessage = 'Aucune donnée',
  rowActions = [],
}: DataTableProps<T>) {
  const skeletonRows = useMemo(() => Array.from({ length: 5 }), []);

  if (loading) {
    return (
      <>
        <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ height: 40, width: '100%', borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
          <div style={{ height: 60, width: '100%', borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
          <div style={{ height: 60, width: '100%', borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
          <div style={{ height: 60, width: '100%', borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
          <div style={{ height: 60, width: '100%', borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
        </div>
      </>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              {columns.map((col) => (
                <th
                  key={String(col.key ?? "")}
                  className={`px-4 py-3 text-left text-sm font-medium text-gray-500 ${col.width ? `w-[${col.width}]` : ''}`}
                >
                  {col.label}
                  {col.sortable && ' ↕'}
                </th>
              ))}
              {rowActions.length > 0 && <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr
                key={row.id}
                className={`border-b ${onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}`}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((col) => (
                  <td key={String(col.key ?? "")} className="px-4 py-3">
                    {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? "")}
                  </td>
                ))}
                {rowActions.length > 0 && (
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {rowActions.map((action) => (
                        <button type="button"
                          key={action.label}
                          className={`px-3 py-1.5 text-sm rounded-lg transition-colors disabled:opacity-50 min-h-[44px] min-w-[44px] ${
                            action.variant === 'destructive'
                              ? 'bg-red-600 hover:bg-red-700 text-white border border-red-600'
                              : 'px-3 py-1.5 border rounded-lg hover:bg-gray-50 transition-colors'
                          }`}
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            action.onClick(row);
                          }}
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pageable && (
        <div className="flex justify-between items-center">
          <button type="button"
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 min-h-[44px] min-w-[44px]"
            disabled={!hasPrevPage}
            onClick={onPrevPage}
          >
            Précédent
          </button>
          <span className="text-sm text-gray-600">
            {data.length} résultats
          </span>
          <button type="button"
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 min-h-[44px] min-w-[44px]"
            disabled={!hasNextPage}
            onClick={onNextPage}
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  );
}
