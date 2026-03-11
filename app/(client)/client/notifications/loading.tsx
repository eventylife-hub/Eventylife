import { Skeleton } from '@/components/ui/skeleton';

/** Squelette de chargement — Notifications */
export default function Loading() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <Skeleton height="2rem" width="35%" />
        <Skeleton height="2rem" width="100px" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-start gap-4 p-4 border rounded-lg">
            <Skeleton height="2.5rem" width="2.5rem" circle />
            <div className="flex-1 space-y-2">
              <Skeleton height="1rem" width="60%" />
              <Skeleton height="1rem" width="85%" />
              <Skeleton height="0.875rem" width="40%" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
