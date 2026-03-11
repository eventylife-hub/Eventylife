import { Skeleton } from '@/components/ui/skeleton';

/** Squelette de chargement — Formation */
export default function Loading() {
  return (
    <div className="space-y-6 p-6">
      <Skeleton className="h-10 w-48" />
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {[...Array(4)].map((_: unknown, i: number) => (
          <Skeleton key={i} className="h-40" />
        ))}
      </div>
    </div>
  );
}
