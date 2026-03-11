/**
 * Loading page — Depart
 */
import { Skeleton } from '@/components/ui/skeleton';

export default function DepartLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-in fade-in duration-300">
      <div className="mb-8">
        <Skeleton className="h-10 w-96" />
        <Skeleton className="h-4 w-64 mt-2" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
            <Skeleton className="h-6 w-32" />
            {Array.from({ length: 4 }).map((_: unknown, i: number) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_: unknown, i: number) => (
              <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
