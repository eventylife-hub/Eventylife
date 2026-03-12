/**
 * Loading — Dashboard Pro
 * Utilise les composants skeleton réutilisables du design system Pro.
 */
import {
  ProShimmerStyles,
  ProSkeletonBar,
  ProSkeletonCard,
} from '@/components/pro';

export default function ProDashboardLoading() {
  return (
    <>
      <ProShimmerStyles />
      <div className="space-y-6 animate-in fade-in duration-300">
        {/* Titre + sous-titre */}
        <div className="space-y-2">
          <ProSkeletonBar width={224} height={32} />
          <ProSkeletonBar width={320} height={16} />
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProSkeletonCard key={i} />
          ))}
        </div>

        {/* Graphique placeholder */}
        <div className="pro-card" style={{ padding: '24px' }}>
          <ProSkeletonBar width={192} height={24} />
          <ProSkeletonBar width="100%" height={256} radius={8} style={{ marginTop: '16px' }} />
        </div>

        {/* Activité récente */}
        <div className="pro-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <ProSkeletonBar width={160} height={24} />
          {Array.from({ length: 4 }).map((_, i) => (
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
