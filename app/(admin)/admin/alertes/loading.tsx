/**
 * Loading page — Alertes
 * Affiche des skeletons pendant le chargement de la page alertes
 */
import { Skeleton } from '@/components/ui/skeleton';

export default function AlertesLoading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Titre de page skeleton */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="h-24 w-32 rounded-full" />
      </div>

      {/* Filtres skeleton */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 flex gap-4">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-10 w-40" />
      </div>

      {/* Alertes skeleton */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="p-4 border rounded-lg space-y-3">
            <div className="flex items-start gap-4">
              <Skeleton className="h-4 w-4 rounded mt-1" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-full max-w-md" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <div className="flex gap-4 text-xs ml-8">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
