import { Skeleton } from '@/components/ui/skeleton';

export default function EquipeLoading() {
  return (
    <div className="space-y-6 p-6">
      <Skeleton className="h-10 w-64" />

      <Skeleton className="h-40 w-full" />

      <div className="space-y-2">
        {[...Array(3)].map((_: unknown, i: number) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>

      <Skeleton className="h-64 w-full" />
    </div>
  );
}
