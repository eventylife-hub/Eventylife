/**
 * Loading page — Rooming
 */
import { Skeleton } from '@/components/ui/skeleton';

export default function RoomingLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <Skeleton className="h-8 w-24 mb-4" />
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-4 w-32 mt-2" />
      </div>

      {/* Room Info Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_: unknown, i: number) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-32" />
            </div>
          ))}
        </div>
      </div>

      {/* Co-occupants Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <Skeleton className="h-8 w-32" />
        {Array.from({ length: 3 }).map((_: unknown, i: number) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>

      {/* Preferences Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        {Array.from({ length: 3 }).map((_: unknown, i: number) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Documents Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-10 w-40" />
      </div>
    </div>
  );
}
