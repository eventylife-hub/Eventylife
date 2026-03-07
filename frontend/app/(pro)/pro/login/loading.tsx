import { Skeleton } from '@/components/ui/skeleton';

/** Squelette de chargement — Connexion */
export default function Loading() {
  return (
    <div className="space-y-6 p-6 max-w-md mx-auto">
      <Skeleton className="h-10 w-40" />
      <div className="space-y-4">
        <Skeleton className="h-12" />
        <Skeleton className="h-12" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}
