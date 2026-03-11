import { Skeleton } from '@/components/ui/skeleton';

/** Squelette de chargement — Marketing */
export default function Loading() {
  return (
    <div className="space-y-6 p-6">
      <Skeleton className="h-10 w-48" />
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-lg" />
        ))}
      </div>
    </div>
  );
}
