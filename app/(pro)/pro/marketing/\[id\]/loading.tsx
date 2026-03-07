import { Skeleton } from '@/components/ui/skeleton';

/** Squelette de chargement — Détail Marketing */
export default function Loading() {
  return (
    <div className="space-y-6 p-6">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-48 rounded-lg" />
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    </div>
  );
}
