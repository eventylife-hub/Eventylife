import { Skeleton } from '@/components/ui/skeleton';

/** Squelette de chargement — Manifeste Transport */
export default function Loading() {
  return (
    <div className="space-y-6 p-6">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-48 rounded-lg" />
      <div className="space-y-3">
        {[...Array(3)].map((_: unknown, i: number) => (
          <Skeleton key={i} className="h-16" />
        ))}
      </div>
    </div>
  );
}
