/**
 * Loading skeleton pour la page checkout
 */

import { Skeleton } from '@/components/ui/skeleton';

export default function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4">
      <div className="max-w-2xl mx-auto py-8 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-40" />
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-8">
          {Array.from({ length: 4 }).map((_: unknown, i: number) => (
            <div key={i} className="flex items-center flex-1">
              <Skeleton className="w-10 h-10 rounded-full" />
              {i < 3 && <Skeleton className="h-1 flex-1 mx-2" />}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-20 w-full rounded-lg" />
          <Skeleton className="h-20 w-full rounded-lg" />
          <Skeleton className="h-20 w-full rounded-lg" />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-8">
          <Skeleton className="flex-1 h-11 rounded-lg" />
          <Skeleton className="flex-1 h-11 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
