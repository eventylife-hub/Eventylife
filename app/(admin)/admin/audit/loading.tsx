import { Skeleton } from '@/components/ui/skeleton';

/**
 * Squelette de chargement — Logs d'Audit
 */
export default function Loading() {
  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-5 w-96" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_: unknown, i: number) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <div className="space-y-2 p-6">
          {Array.from({ length: 8 }).map((_: unknown, i: number) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
