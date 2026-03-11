
/**
 * Squelette de chargement — Cycle de Vie du Voyage
 */
export default function Loading() {
  return (
      <>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    <div className="p-6 space-y-6">
      <div className="space-y-4">
        <div style={{ height: 40, width: 96, borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
        <div style={{ height: 40, width: 256, borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div style={{ height: 24, width: 192, borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
        <div className="flex items-center justify-between">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div style={{ height: 48, width: 48, borderRadius: '50%', background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
              <div style={{ height: 12, width: 64, borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div style={{ height: 24, width: 192, borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} style={{ height: 48, width: '100%', borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <div style={{ height: 40, width: 128, borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
        <div style={{ height: 40, width: 128, borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
      </div>
    </div>
  </>
  );
}
