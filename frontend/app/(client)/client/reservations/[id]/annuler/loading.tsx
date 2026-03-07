import { Skeleton } from '@/components/ui/skeleton';

/** Squelette de chargement — Annuler réservation */
export default function Loading() {
  return (
    <div className="space-y-6 p-6">
      <Skeleton height="2rem" width="48%" />
      <div className="max-w-2xl space-y-4">
        <div className="p-4 border rounded-lg space-y-3">
          <Skeleton height="1.25rem" width="70%" />
          <Skeleton height="1rem" count={3} />
        </div>
        <div className="space-y-3">
          <Skeleton height="1rem" width="35%" />
          <Skeleton height="1rem" count={2} />
        </div>
        <div className="flex gap-3 pt-4">
          <Skeleton height="2.5rem" width="130px" />
          <Skeleton height="2.5rem" width="120px" />
        </div>
      </div>
    </div>
  );
}
