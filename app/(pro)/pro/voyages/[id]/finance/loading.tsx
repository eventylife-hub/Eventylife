import { Skeleton } from '@/components/ui/skeleton';

/** Squelette de chargement — Finance Voyage */
export default function Loading() {
  return (
    <div className="space-y-6 p-6">
      <Skeleton className="h-10 w-48" />
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        {[...Array(3)].map((_: unknown, i: number) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
      <Skeleton className="h-80" />
    </div>
  );
}
