import { Skeleton } from '@/components/ui/skeleton';

/**
 * Squelette de chargement — Gestion des Documents
 */
export default function Loading() {
  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-5 w-96" />
      </div>

      <div className="flex gap-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-48" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_: unknown, i: number) => (
          <Skeleton key={i} className="h-48" />
        ))}
      </div>
    </div>
  );
}
