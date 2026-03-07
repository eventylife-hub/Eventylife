'use client';

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

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
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
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
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead
                  key={String(col.key)}
                  className={col.width ? `w-[${col.width}]` : ''}
                >
                  {col.label}
                  {col.sortable && ' ↕'}
                </TableHead>
              ))}
              {rowActions.length > 0 && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow
                key={row.id}
                className={onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((col) => (
                  <TableCell key={String(col.key)}>
                    {col.render ? col.render(row[col.key], row) : String(row[col.key])}
                  </TableCell>
                ))}
                {rowActions.length > 0 && (
                  <TableCell>
                    <div className="flex gap-2">
                      {rowActions.map((action) => (
                        <Button
                          key={action.label}
                          size="sm"
                          variant={action.variant || 'outline'}
                          onClick={(e) => {
                            e.stopPropagation();
                            action.onClick(row);
                          }}
                        >
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {pageable && (
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            disabled={!hasPrevPage}
            onClick={onPrevPage}
          >
            Précédent
          </Button>
          <span className="text-sm text-gray-600">
            {data.length} résultats
          </span>
          <Button
            variant="outline"
            disabled={!hasNextPage}
            onClick={onNextPage}
          >
            Suivant
          </Button>
        </div>
      )}
    </div>
  );
}
