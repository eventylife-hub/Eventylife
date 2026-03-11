import { Skeleton } from '@/components/ui/skeleton';

/** Squelette de chargement — Facture réservation */
export default function Loading() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <Skeleton height="2rem" width="40%" />
        <Skeleton height="2.5rem" width="100px" />
      </div>
      <div className="max-w-4xl p-6 border rounded-lg space-y-4">
        <div className="space-y-2">
          <Skeleton height="1.25rem" width="50%" />
          <Skeleton height="1rem" count={2} />
        </div>
        <Skeleton height="1px" width="100%" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_: unknown, i: number) => (
            <div key={i} className="flex justify-between">
              <Skeleton height="1rem" width="50%" />
              <Skeleton height="1rem" width="20%" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
