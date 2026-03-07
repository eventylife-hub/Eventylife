import { Skeleton } from '@/components/ui/skeleton';

export default function ReservationsLoading() {
  return (
    <div className="space-y-6 p-6">
      <Skeleton className="h-10 w-64" />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-48" />
      </div>

      <Skeleton className="h-96 w-full" />
    </div>
  );
}
