/**
 * Loading page — Dashboard Revenus Pro
 * Skeletons réutilisables du design system Pro.
 */
import {
  ProShimmerStyles,
  ProSkeletonBar,
  ProSkeletonCard,
  ProSkeletonTableRow,
} from '@/components/pro';

export default function RevenuesLoading() {
  return (
    <>
      <ProShimmerStyles />
      <div className="space-y-6 animate-in fade-in duration-300 p-6">
        {/* Titre */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <ProSkeletonBar width={256} height={32} />
          <ProSkeletonBar width={384} height={16} />
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <ProSkeletonCard key={i} />
          ))}
        </div>

        {/* Filtres */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <ProSkeletonBar key={i} width={96} height={36} radius={8} />
          ))}
        </div>

        {/* Table */}
        <div className="pro-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <ProSkeletonBar width={192} height={24} />
            <ProSkeletonBar width={128} height={36} radius={8} />
          </div>
          {Array.from({ length: 6 }).map((_, i) => (
            <ProSkeletonTableRow key={i} columns={3} />
          ))}
        </div>

        {/* Historique paiements */}
        <div className="pro-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <ProSkeletonBar width={192} height={24} />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid #E0E0E0', borderRadius: '8px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <ProSkeletonBar width={96} height={16} />
                <ProSkeletonBar width={128} height={12} />
              </div>
              <ProSkeletonBar width={80} height={24} radius={12} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
