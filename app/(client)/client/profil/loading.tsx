import { Skeleton } from '@/components/ui/skeleton';

/** Squelette de chargement — Profil */
export default function Loading() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-end gap-4">
        <Skeleton height="6rem" width="6rem" circle />
        <div className="space-y-2 flex-1">
          <Skeleton height="1.5rem" width="40%" />
          <Skeleton height="1rem" width="50%" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_: unknown, i: number) => (
          <div key={i} className="space-y-4">
            <Skeleton height="1.25rem" width="50%" />
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_: unknown, j: number) => (
                <div key={j} className="space-y-2">
                  <Skeleton height="1rem" width="30%" />
                  <Skeleton height="2.5rem" width="100%" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
