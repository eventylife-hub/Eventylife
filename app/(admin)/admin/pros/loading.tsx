import { Skeleton } from '@/components/ui/skeleton';

/**
 * Squelette de chargement — Gestion des Profils Pro
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
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <div className="space-y-2 p-6">
          {Array.from({ length: 6 }).map((_: unknown, i: number) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
