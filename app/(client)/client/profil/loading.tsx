
/** Squelette de chargement — Profil */
export default function Loading() {
  return (
      <>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    <div className="space-y-6 p-6">
      <div className="flex items-end gap-4">
        <div style={{ height: '6rem', width: '6rem', borderRadius: '50%', background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
        <div className="space-y-2 flex-1">
          <div style={{ height: '1.5rem', width: '40%', borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
          <div style={{ height: '1rem', width: '50%', borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <div style={{ height: '1.25rem', width: '50%', borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, j: number) => (
                <div key={j} className="space-y-2">
                  <div style={{ height: '1rem', width: '30%', borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
                  <div style={{ height: '2.5rem', width: '100%', borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </>
  );
}
