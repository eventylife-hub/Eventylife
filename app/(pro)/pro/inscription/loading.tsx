import { Skeleton } from '@/components/ui/skeleton';

export default function InscriptionLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-4">
      <div className="max-w-2xl mx-auto">
        <Skeleton className="h-8 w-full mb-8" />

        <div className="bg-white rounded-lg p-6 space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />

          <div className="space-y-3 mt-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>

          <div className="flex justify-between gap-4 mt-8">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>
    </div>
  );
}
