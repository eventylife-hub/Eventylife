import { Skeleton } from '@/components/ui/skeleton';

/** Squelette de chargement — Détail groupe */
export default function Loading() {
  return (
    <div className="space-y-6 p-6">
      <div className="space-y-3">
        <Skeleton height="2rem" width="50%" />
        <Skeleton height="1rem" width="40%" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-4">
          <div className="p-4 border rounded-lg space-y-3">
            <Skeleton height="1.5rem" width="70%" />
            <Skeleton height="1rem" count={3} />
          </div>
        </div>
        <div className="p-4 border rounded-lg space-y-3">
          <Skeleton height="1.5rem" width="60%" />
          <Skeleton height="2rem" count={4} />
        </div>
      </div>
    </div>
  );
}
