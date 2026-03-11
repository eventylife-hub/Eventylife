/**
 * Loading skeleton pour la page checkout — Design V4 shimmer
 */
export default function CheckoutLoading() {
  const shimmer = {
    borderRadius: 12,
    background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
  } as const;

  return (
    <>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
      <div style={{ minHeight: '100vh', background: 'var(--cream, #FAF7F2)', padding: 16 }}>
        <div className="max-w-2xl mx-auto py-8 space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <div style={{ ...shimmer, height: 32, width: 256 }} />
            <div style={{ ...shimmer, height: 16, width: 160, borderRadius: 8 }} />
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-between mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center flex-1">
                <div style={{ ...shimmer, width: 40, height: 40, borderRadius: '50%' }} />
                {i < 3 && <div style={{ ...shimmer, height: 4, flex: 1, marginLeft: 8, marginRight: 8, borderRadius: 4 }} />}
              </div>
            ))}
          </div>

          {/* Content */}
          <div className="space-y-4">
            <div style={{ ...shimmer, height: 24, width: 192 }} />
            <div style={{ ...shimmer, height: 16, width: '100%', borderRadius: 8 }} />
            <div style={{ ...shimmer, height: 80, width: '100%', borderRadius: 20 }} />
            <div style={{ ...shimmer, height: 80, width: '100%', borderRadius: 20 }} />
            <div style={{ ...shimmer, height: 80, width: '100%', borderRadius: 20 }} />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-8">
            <div style={{ ...shimmer, flex: 1, height: 44 }} />
            <div style={{ ...shimmer, flex: 1, height: 44 }} />
          </div>
        </div>
      </div>
    </>
  );
}
