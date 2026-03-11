import { Skeleton } from '@/components/ui/skeleton';

/** Squelette de chargement — Préférences réservation */
export default function Loading() {
  return (
    <div className="space-y-6 p-6">
      <Skeleton height="2rem" width="48%" />
      <div className="max-w-2xl space-y-4">
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_: unknown, i: number) => (
            <div key={i} className="space-y-2">
              <Skeleton height="1rem" width="35%" />
              <Skeleton height="2.5rem" width="100%" />
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <Skeleton height="1rem" width="28%" />
          <Skeleton height="5rem" width="100%" />
        </div>
        <div className="flex gap-3 pt-4">
          <Skeleton height="2.5rem" width="120px" />
          <Skeleton height="2.5rem" width="120px" />
        </div>
      </div>
    </div>
  );
}
