import { Skeleton } from '@/components/ui/skeleton';

/**
 * Squelette de chargement — Détail d'une Annulation
 */
export default function Loading() {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="space-y-4">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-64" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <Skeleton className="h-6 w-32" />
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-5 w-full" />
          ))}
        </div>

        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <Skeleton className="h-6 w-32" />
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-5 w-full" />
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-32 w-full" />
      </div>

      <div className="flex gap-4">
        <Skeleton className="h-12 w-32" />
        <Skeleton className="h-12 w-32" />
      </div>
    </div>
  );
}
