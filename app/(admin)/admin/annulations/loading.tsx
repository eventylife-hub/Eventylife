
/**
 * Squelette de chargement — Gestion des Annulations
 */
export default function Loading() {
  return (
      <>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    <div className="p-8 space-y-6">
      <div className="space-y-2">
        <div style={{ height: 40, width: 256, borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
        <div style={{ height: 20, width: 384, borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
      </div>

      <div className="flex gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} style={{ height: 40, width: 128, borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
        ))}
      </div>

      <div className="overflow-x-auto">
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ height: 64, width: '100%', borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
          ))}
        </div>
      </div>
    </div>
  </>
  );
}
