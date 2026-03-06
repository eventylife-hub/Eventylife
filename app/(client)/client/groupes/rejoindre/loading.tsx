import { Skeleton } from '@/components/ui/skeleton';

/** Squelette de chargement — Rejoindre groupe */
export default function Loading() {
  return (
    <div className="space-y-6 p-6">
      <Skeleton height="2rem" width="50%" />
      <div className="max-w-md space-y-4">
        <div className="space-y-2">
          <Skeleton height="1rem" width="32%" />
          <Skeleton height="2.5rem" width="100%" />
        </div>
        <div className="p-4 border rounded-lg space-y-3">
          <Skeleton height="1.25rem" width="70%" />
          <Skeleton height="1rem" count={2} />
          <Skeleton height="2rem" width="100%" />
        </div>
      </div>
    </div>
  );
}
