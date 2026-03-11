import { Skeleton } from '@/components/ui/skeleton';

/**
 * Squelette de chargement — Détail d'un Utilisateur
 */
export default function Loading() {
  return (
    <div className="p-6 space-y-6">
      <div className="space-y-4">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-64" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <Skeleton className="h-6 w-32" />
          {Array.from({ length: 5 }).map((_: unknown, i: number) => (
            <Skeleton key={i} className="h-5 w-full" />
          ))}
        </div>

        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <Skeleton className="h-6 w-32" />
          {Array.from({ length: 4 }).map((_: unknown, i: number) => (
            <Skeleton key={i} className="h-5 w-full" />
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-24 w-full" />
      </div>

      <div className="flex gap-4">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}
