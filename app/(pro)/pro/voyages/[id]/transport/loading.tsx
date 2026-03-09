import { Skeleton } from '@/components/ui/skeleton';

/** Squelette de chargement — Transport Voyage */
export default function Loading() {
  return (
    <div className="space-y-6 p-6">
      <Skeleton className="h-10 w-56" />
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-lg" />
        ))}
      </div>
    </div>
  );
}
