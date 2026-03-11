import { Skeleton } from '@/components/ui/skeleton';

/**
 * Squelette de chargement — Cycle de Vie du Voyage
 */
export default function Loading() {
  return (
    <div className="p-6 space-y-6">
      <div className="space-y-4">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-64" />
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <Skeleton className="h-6 w-48" />
        <div className="flex items-center justify-between">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <Skeleton className="h-6 w-48" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}
