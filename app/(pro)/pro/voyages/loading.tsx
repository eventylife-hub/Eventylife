/**
 * Squelette de chargement — Voyages Pro
 */
import { ProShimmerStyles, ProSkeletonBar } from '@/components/pro';

export default function Loading() {
  return (
    <>
      <ProShimmerStyles />
      <div className="space-y-6 p-6">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <ProSkeletonBar width={192} height={40} />
          <ProSkeletonBar width={128} height={40} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <ProSkeletonBar key={i} height={80} radius={8} />
          ))}
        </div>
      </div>
    </>
  );
}
