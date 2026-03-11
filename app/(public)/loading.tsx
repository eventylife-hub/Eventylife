/**
 * Loading — Pages publiques (homepage)
 */
import { Skeleton } from '@/components/ui/skeleton';

export default function PublicLoading() {
  return (
    <div className="animate-in fade-in duration-300">
      {/* Hero skeleton */}
      <div className="relative w-full" style={{ height: '70vh', minHeight: 480, background: '#FAF7F2' }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4 px-4">
            <Skeleton className="h-12 w-80 mx-auto rounded-lg" />
            <Skeleton className="h-6 w-96 mx-auto" />
            <Skeleton className="h-12 w-48 mx-auto rounded-full" />
          </div>
        </div>
      </div>

      {/* Trip cards skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-16 space-y-8">
        <div className="text-center space-y-2">
          <Skeleton className="h-8 w-64 mx-auto" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100">
              <Skeleton className="h-48 w-full" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-24 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Why section skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
        <div className="text-center space-y-2">
          <Skeleton className="h-8 w-56 mx-auto" />
          <Skeleton className="h-4 w-80 mx-auto" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 space-y-3 border border-gray-100">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
