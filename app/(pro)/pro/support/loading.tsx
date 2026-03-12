/**
 * Loading skeleton — Support Pro
 */
import {
  ProShimmerStyles,
  ProSkeletonBar,
} from '@/components/pro';

export default function PageLoading() {
  return (
    <>
      <ProShimmerStyles />
      <div className="space-y-6 animate-in fade-in duration-300">
        {/* Titre */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <ProSkeletonBar width={192} height={32} />
          <ProSkeletonBar width={288} height={16} />
        </div>

        {/* Liste tickets */}
        <div className="pro-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <ProSkeletonBar width={160} height={24} />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <ProSkeletonBar circle height={40} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <ProSkeletonBar height={16} />
                <ProSkeletonBar height={12} />
              </div>
              <ProSkeletonBar width={64} height={24} radius={6} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
