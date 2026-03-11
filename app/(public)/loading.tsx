/**
 * Loading — Pages publiques (homepage) — Design V4 shimmer
 */
export default function PublicLoading() {
  const shimmer = {
    borderRadius: 12,
    background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
  } as const;

  return (
    <>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
      <div className="animate-in fade-in duration-300">
        {/* Hero skeleton */}
        <div style={{ height: '70vh', minHeight: 480, background: '#FAF7F2', position: 'relative', width: '100%' }}>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="text-center space-y-4" style={{ padding: '0 1rem' }}>
              <div style={{ ...shimmer, height: 48, width: 320, margin: '0 auto', borderRadius: 16 }} />
              <div style={{ ...shimmer, height: 24, width: 384, margin: '0 auto' }} />
              <div style={{ ...shimmer, height: 48, width: 192, margin: '0 auto', borderRadius: 999 }} />
            </div>
          </div>
        </div>

        {/* Trip cards skeleton */}
        <div className="max-w-7xl mx-auto px-4 py-16 space-y-8">
          <div className="text-center space-y-2">
            <div style={{ ...shimmer, height: 32, width: 256, margin: '0 auto' }} />
            <div style={{ ...shimmer, height: 16, width: 384, margin: '0 auto', borderRadius: 8 }} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{ background: 'white', borderRadius: 20, overflow: 'hidden', border: '1.5px solid #E5E0D8' }}>
                <div style={{ ...shimmer, height: 192, width: '100%', borderRadius: 0 }} />
                <div style={{ padding: 16 }} className="space-y-3">
                  <div style={{ ...shimmer, height: 20, width: '75%' }} />
                  <div style={{ ...shimmer, height: 16, width: '50%', borderRadius: 8 }} />
                  <div style={{ ...shimmer, height: 32, width: 96 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why section skeleton */}
        <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
          <div className="text-center space-y-2">
            <div style={{ ...shimmer, height: 32, width: 224, margin: '0 auto' }} />
            <div style={{ ...shimmer, height: 16, width: 320, margin: '0 auto', borderRadius: 8 }} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{ background: 'white', borderRadius: 20, padding: 24, border: '1.5px solid #E5E0D8' }} className="space-y-3">
                <div style={{ ...shimmer, height: 48, width: 48 }} />
                <div style={{ ...shimmer, height: 20, width: 160 }} />
                <div style={{ ...shimmer, height: 16, width: '100%', borderRadius: 8 }} />
                <div style={{ ...shimmer, height: 16, width: '75%', borderRadius: 8 }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
