import { Skeleton } from '@/components/ui/skeleton';

/**
 * Squelette de chargement — Paramètres
 */
export default function Loading() {
  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-5 w-96" />
      </div>

      <div className="flex gap-2 border-b">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 space-y-3">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );
}
