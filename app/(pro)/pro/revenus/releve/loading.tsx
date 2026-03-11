import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

/**
 * Loading skeleton pour la page relevé mensuel
 * Affiche un loader pendant le chargement des données
 */
export default function Loading() {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-5 w-96" />
      </div>

      {/* Month Selector */}
      <Skeleton className="h-10 w-48" />

      {/* Statement Card */}
      <Card>
        <div className="space-y-4 p-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>

          {/* Table skeleton */}
          <div className="space-y-3 mt-4">
            <div className="grid grid-cols-6 gap-2">
              {Array.from({ length: 6 }).map((_: unknown, i: number) => (
                <Skeleton key={i} className="h-8" />
              ))}
            </div>
            {Array.from({ length: 5 }).map((_: unknown, i: number) => (
              <div key={i} className="grid grid-cols-6 gap-2">
                {Array.from({ length: 6 }).map((_: unknown, j: number) => (
                  <Skeleton key={j} className="h-6" />
                ))}
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="border-t pt-4 space-y-2 mt-4">
            <div className="flex justify-between">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-24" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-24" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-24" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
