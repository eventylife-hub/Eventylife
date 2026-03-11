import { Skeleton } from '@/components/ui/skeleton';

/** Squelette de chargement — Page d'assurance */
export default function Loading() {
  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <Skeleton height="2rem" width="50%" />
        <Skeleton height="1rem" width="70%" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 2 }).map((_: unknown, i: number) => (
          <div key={i} className="space-y-3 p-4 border rounded-lg">
            <Skeleton height="1.5rem" width="80%" />
            <Skeleton height="1rem" width="100%" />
            <Skeleton height="1rem" width="90%" />
          </div>
        ))}
      </div>
    </div>
  );
}
