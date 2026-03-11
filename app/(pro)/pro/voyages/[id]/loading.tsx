import { Skeleton } from '@/components/ui/skeleton';

export default function VoyageLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Skeleton className="h-12 w-96" />
        <div className="flex flex-wrap gap-6">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-5 w-48" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>

        <Skeleton className="h-32 w-full" />

        <Skeleton className="h-40 w-full" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>

        <Skeleton className="h-40 w-full" />
      </div>
    </div>
  );
}
