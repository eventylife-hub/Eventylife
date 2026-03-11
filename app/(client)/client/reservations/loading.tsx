import { Skeleton } from '@/components/ui/skeleton';

/** Squelette de chargement — Réservations */
export default function Loading() {
  return (
    <div className="space-y-6 p-6">
      <Skeleton height="2rem" width="42%" />
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="p-4 border rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton height="1.25rem" width="50%" />
              <Skeleton height="1rem" width="80px" />
            </div>
            <Skeleton height="1rem" count={2} />
            <div className="flex gap-2">
              <Skeleton height="2rem" width="30%" />
              <Skeleton height="2rem" width="30%" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
