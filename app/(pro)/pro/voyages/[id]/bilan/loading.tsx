
/** Squelette de chargement — Bilan Voyage */
export default function Loading() {
  return (
      <>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    <div className="space-y-6 p-6">
      <div style={{ height: 40, width: 224, borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{ height: 128, borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
        ))}
      </div>
      <div style={{ height: 192, borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
    </div>
  </>
  );
}
