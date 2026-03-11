import { Skeleton } from '@/components/ui/skeleton';

/** Squelette de chargement — Paiements */
export default function Loading() {
  return (
    <div className="space-y-6 p-6">
      <Skeleton height="2rem" width="38%" />
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_: unknown, i: number) => (
          <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex-1 space-y-2">
              <Skeleton height="1rem" width="50%" />
              <Skeleton height="0.875rem" width="35%" />
            </div>
            <div className="text-right space-y-2">
              <Skeleton height="1.25rem" width="100px" />
              <Skeleton height="0.875rem" width="80px" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
