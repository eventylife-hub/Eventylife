
/** Squelette de chargement — Page d'avis */
export default function Loading() {
  return (
      <>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    <div className="space-y-6 p-6">
      <div style={{ height: '2rem', width: '40%', borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-3 p-4 border rounded-lg">
            <div className="flex items-center gap-2">
              <div style={{ height: '2.5rem', width: '2.5rem', borderRadius: '50%', background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
              <div style={{ height: '1rem', width: '30%', borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
            </div>
            <div style={{ height: '1rem', borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
            <div style={{ height: '1rem', width: '80%', borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
          </div>
        ))}
      </div>
    </div>
  </>
  );
}
