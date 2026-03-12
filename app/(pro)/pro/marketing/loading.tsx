/**
 * Squelette de chargement — Marketing Pro
 */
import {
  ProShimmerStyles,
  ProSkeletonBar,
} from '@/components/pro';

export default function Loading() {
  return (
    <>
      <ProShimmerStyles />
      <div className="space-y-6 p-6">
        <ProSkeletonBar width={192} height={40} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <ProSkeletonBar key={i} height={96} radius={8} />
          ))}
        </div>
      </div>
    </>
  );
}
