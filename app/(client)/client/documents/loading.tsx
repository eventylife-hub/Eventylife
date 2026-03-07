import { Skeleton } from '@/components/ui/skeleton';

/** Squelette de chargement — Page documents */
export default function Loading() {
  return (
    <div className="space-y-6 p-6">
      <Skeleton height="2rem" width="45%" />
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-3 border rounded-lg">
            <Skeleton height="2rem" width="2rem" />
            <div className="flex-1 space-y-2">
              <Skeleton height="1rem" width="60%" />
              <Skeleton height="0.875rem" width="40%" />
            </div>
            <Skeleton height="1rem" width="80px" />
          </div>
        ))}
      </div>
    </div>
  );
}
