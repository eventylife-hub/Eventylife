/**
 * Loading page — Voyage Detail
 * Affiche des skeletons pendant le chargement de la page détail voyage
 */
import { Skeleton } from '@/components/ui/skeleton';

export default function VoyageDetailLoading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Titre de page skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-80" />
      </div>

      {/* Carte d'info skeleton */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-6 w-32" />
            </div>
          ))}
        </div>
      </div>

      {/* Timeline skeleton */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <Skeleton className="h-6 w-40 mb-4" />
        <div className="flex gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex-1 text-center space-y-2">
              <Skeleton className="h-10 w-10 rounded-full mx-auto" />
              <Skeleton className="h-3 w-full" />
            </div>
          ))}
        </div>
      </div>

      {/* KPIs skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-8 rounded" />
            </div>
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </div>

      {/* Tabs skeleton */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex gap-2 mb-6">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
        </div>
        <Skeleton className="h-40 w-full" />
      </div>
    </div>
  );
}
