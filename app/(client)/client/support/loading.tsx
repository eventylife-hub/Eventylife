import { Skeleton } from '@/components/ui/skeleton';

/** Squelette de chargement — Support */
export default function Loading() {
  return (
    <div className="space-y-6 p-6">
      <Skeleton height="2rem" width="35%" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 2 }).map((_: unknown, i: number) => (
          <div key={i} className="space-y-2">
            <Skeleton height="1rem" width="40%" />
            <Skeleton height="2.5rem" width="100%" />
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <Skeleton height="1rem" width="25%" />
        <Skeleton height="6rem" width="100%" />
      </div>
      <div className="flex gap-3">
        <Skeleton height="2.5rem" width="110px" />
        <Skeleton height="2.5rem" width="110px" />
      </div>
    </div>
  );
}
