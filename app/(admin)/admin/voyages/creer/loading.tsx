/**
 * Loading page — Créer un voyage
 * Affiche des skeletons pendant le chargement de la page création
 */
import { Skeleton } from '@/components/ui/skeleton';

export default function CreateTripLoading() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      {/* Titre de page skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-80" />
      </div>

      {/* Indicateur de progression skeleton */}
      <div className="flex items-center justify-between">
        {Array.from({ length: 5 }).map((_: unknown, i: number) => (
          <div key={i} className="flex items-center flex-1">
            <Skeleton className="w-10 h-10 rounded-full" />
            {i < 4 && <Skeleton className="flex-1 h-1 mx-2" />}
          </div>
        ))}
      </div>

      {/* Contenu de formulaire skeleton */}
      <div className="bg-white rounded-xl border border-gray-200 p-8 space-y-6">
        <Skeleton className="h-6 w-40" />
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_: unknown, i: number) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          ))}
        </div>
      </div>

      {/* Boutons de navigation skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}
