/**
 * Squelette de chargement — Finance Pro
 */
import {
  ProShimmerStyles,
  ProSkeletonBar,
  ProSkeletonCard,
} from '@/components/pro';

export default function Loading() {
  return (
    <>
      <ProShimmerStyles />
      <div className="space-y-6 p-6">
        <ProSkeletonBar width={160} height={40} />
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <ProSkeletonCard key={i} />
          ))}
        </div>
        <ProSkeletonBar height={384} />
      </div>
    </>
  );
}
