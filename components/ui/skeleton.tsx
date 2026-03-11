/**
 * Composant Skeleton pour les états de chargement
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  count?: number;
  height?: string | number;
  width?: string | number;
  circle?: boolean;
}

/**
 * Composant Skeleton
 */
export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ count = 1, height = '1rem', width = '100%', circle = false, className, ...props }, ref) => {
    const skeletons = Array.from({ length: count });

    return (
      <>
        {skeletons.map((_, i: number) => (
          <div
            key={i}
            ref={i === skeletons.length - 1 ? ref : undefined}
            className={cn(
              'bg-gray-200 animate-pulse rounded',
              circle && 'rounded-full',
              className
            )}
            style={{
              height: typeof height === 'number' ? `${height}px` : height,
              width: typeof width === 'number' ? `${width}px` : width,
              marginBottom: i < skeletons.length - 1 ? '0.75rem' : undefined
            }}
            {...props}
          />
        ))}
      </>
    );
  }
);

Skeleton.displayName = 'Skeleton';

/**
 * SkeletonList pour lister plusieurs éléments
 */
interface SkeletonListProps {
  count?: number;
  height?: string | number;
}

export function SkeletonList({ count = 3, height = '100px' }: SkeletonListProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i: number) => (
        <div key={i} className="space-y-2">
          <Skeleton height="1rem" width="60%" />
          <Skeleton height={height} />
        </div>
      ))}
    </div>
  );
}

/**
 * SkeletonGrid para uma grille d'éléments
 * Utilise des classes Tailwind statiques pour support optimal
 */
interface SkeletonGridProps {
  columns?: number;
  count?: number;
}

export function SkeletonGrid({ columns = 3, count = 6 }: SkeletonGridProps) {
  // Map static grid classes based on columns prop
  const gridClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
  }[columns] || 'grid-cols-3';

  const mdGridClass = {
    1: 'md:grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
    5: 'md:grid-cols-5',
    6: 'md:grid-cols-6',
  }[columns] || 'md:grid-cols-3';

  return (
    <div className={`grid ${gridClass} ${mdGridClass} gap-4`}>
      {Array.from({ length: count }).map((_, i: number) => (
        <div key={i} className="space-y-2">
          <Skeleton height="200px" width="100%" />
          <Skeleton height="1rem" width="80%" />
          <Skeleton height="1rem" width="60%" />
        </div>
      ))}
    </div>
  );
}
