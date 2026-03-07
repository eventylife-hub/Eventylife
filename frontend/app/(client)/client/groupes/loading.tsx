import { Skeleton } from '@/components/ui/skeleton';

/** Squelette de chargement — Groupes */
export default function Loading() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <Skeleton height="2rem" width="40%" />
        <Skeleton height="2.5rem" width="120px" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3 p-4 border rounded-lg">
            <Skeleton height="1.5rem" width="85%" />
            <Skeleton height="1rem" count={2} />
            <div className="flex gap-2 pt-2">
              <Skeleton height="2rem" width="50%" />
              <Skeleton height="2rem" width="50%" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
