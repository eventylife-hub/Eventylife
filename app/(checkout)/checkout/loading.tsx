/**
 * Loading page — Checkout
 * Affiche des skeletons pendant le chargement des étapes checkout
 */
import { Skeleton } from '@/components/ui/skeleton';

export default function CheckoutLoading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Étapes skeleton */}
      <div className="flex items-center justify-between">
        {Array.from({ length: 4 }).map((_: unknown, i: number) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>

      {/* Formulaire skeleton */}
      <div className="space-y-6">
        <Skeleton className="h-6 w-48" />
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
    </div>
  );
}
