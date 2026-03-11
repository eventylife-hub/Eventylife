import { Skeleton } from '@/components/ui/skeleton';

/** Squelette de chargement — Voyages */
export default function Loading() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-lg" />
        ))}
      </div>
    </div>
  );
}
