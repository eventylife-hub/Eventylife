/**
 * Loading page — Quick Sell Pro
 * Affiche des skeletons pendant le chargement
 */
import { Skeleton } from '@/components/ui/skeleton';

export default function QuickSellLoading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300 p-6">
      {/* Titre de page skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Trip selection and code input skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-3 w-full max-w-xs" />
          </div>
        ))}
      </div>

      {/* Generate button skeleton */}
      <Skeleton className="h-10 w-full rounded-lg" />

      {/* Seller link display skeleton */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <Skeleton className="h-6 w-32" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </div>

      {/* Stats cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>

      {/* Sales skeleton */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <Skeleton className="h-6 w-32" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}
