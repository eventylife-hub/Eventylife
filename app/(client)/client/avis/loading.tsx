import { Skeleton } from '@/components/ui/skeleton';

/** Squelette de chargement — Page d'avis */
export default function Loading() {
  return (
    <div className="space-y-6 p-6">
      <Skeleton height="2rem" width="40%" />
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_: unknown, i: number) => (
          <div key={i} className="space-y-3 p-4 border rounded-lg">
            <div className="flex items-center gap-2">
              <Skeleton height="2.5rem" width="2.5rem" circle />
              <Skeleton height="1rem" width="30%" />
            </div>
            <Skeleton height="1rem" count={2} />
            <Skeleton height="1rem" width="80%" />
          </div>
        ))}
      </div>
    </div>
  );
}
