import { Skeleton } from '@/components/ui/skeleton';

/** Squelette de chargement — Nouveau Voyage */
export default function Loading() {
  return (
    <div className="space-y-6 p-6">
      <Skeleton className="h-10 w-64" />
      <div className="space-y-4">
        {[...Array(7)].map((_: unknown, i: number) => (
          <Skeleton key={i} className="h-12" />
        ))}
        <Skeleton className="h-10 w-40" />
      </div>
    </div>
  );
}
