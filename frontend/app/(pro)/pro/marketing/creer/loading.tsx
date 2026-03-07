import { Skeleton } from '@/components/ui/skeleton';

/** Squelette de chargement — Créer Marketing */
export default function Loading() {
  return (
    <div className="space-y-6 p-6">
      <Skeleton className="h-10 w-64" />
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12" />
        ))}
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}
