/**
 * Loading page — Pro Public — Design V4 shimmer
 */
export default function ProPublicLoading() {
  const shimmer = {
    borderRadius: 12,
    background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
  } as const;

  return (
    <>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-8 animate-in fade-in duration-300">
        {/* Hero Section Skeleton */}
        <div style={{ background: 'linear-gradient(135deg, rgba(0,119,182,0.06), rgba(199,91,57,0.06))', borderRadius: 24, padding: '2rem 2rem' }} className="md:p-12">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div style={{ ...shimmer, height: 128, width: 128, borderRadius: '50%' }} />
              <div style={{ ...shimmer, height: 32, width: 256 }} />
              <div style={{ ...shimmer, height: 16, width: 192, borderRadius: 8 }} />
              <div style={{ ...shimmer, height: 80, width: '100%', borderRadius: 16 }} />
              <div className="flex gap-3">
                <div style={{ ...shimmer, height: 40, width: 128 }} />
                <div style={{ ...shimmer, height: 40, width: 96 }} />
              </div>
            </div>
            <div style={{ ...shimmer, height: 256, width: '100%', borderRadius: 20 }} />
          </div>
        </div>

        {/* Voyages Section Skeleton */}
        <div className="space-y-4">
          <div style={{ ...shimmer, height: 32, width: 256 }} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} style={{ border: '1.5px solid #E5E0D8', borderRadius: 20, padding: 24, background: 'white' }} className="space-y-4">
                <div style={{ ...shimmer, height: 24, width: 128 }} />
                <div style={{ ...shimmer, height: 24, width: '100%' }} />
                <div style={{ ...shimmer, height: 16, width: 192, borderRadius: 8 }} />
                <div style={{ ...shimmer, height: 16, width: 160, borderRadius: 8 }} />
                <div style={{ borderTop: '1px solid #E5E0D8', paddingTop: 16 }}>
                  <div style={{ ...shimmer, height: 24, width: 128, marginBottom: 12 }} />
                  <div style={{ ...shimmer, height: 40, width: '100%' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section Skeleton */}
        <div style={{ background: 'white', borderRadius: 24, border: '1.5px solid #E5E0D8', padding: 32 }} className="space-y-6">
          <div>
            <div style={{ ...shimmer, height: 32, width: 192 }} />
            <div style={{ ...shimmer, height: 16, width: 256, marginTop: 8, borderRadius: 8 }} />
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} style={{ ...shimmer, height: 40, width: '100%', borderRadius: 10 }} />
              ))}
            </div>
            <div className="space-y-4">
              <div style={{ ...shimmer, height: 24, width: 128 }} />
              <div style={{ ...shimmer, height: 16, width: 160, borderRadius: 8 }} />
              <div style={{ ...shimmer, height: 80, width: '100%', borderRadius: 16 }} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
