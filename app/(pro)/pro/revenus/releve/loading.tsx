/**
 * Loading skeleton pour la page relevé mensuel — Design V4 shimmer
 */
export default function Loading() {
  const shimmer = {
    borderRadius: 12,
    background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
  } as const;

  return (
    <>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="space-y-2">
          <div style={{ ...shimmer, height: 40, width: 256 }} />
          <div style={{ ...shimmer, height: 20, width: 384 }} />
        </div>

        {/* Month Selector */}
        <div style={{ ...shimmer, height: 40, width: 192 }} />

        {/* Statement Card */}
        <div style={{ background: 'white', borderRadius: 20, border: '1.5px solid #E5E0D8' }}>
          <div className="space-y-4 p-6">
            <div className="flex items-center justify-between">
              <div style={{ ...shimmer, height: 24, width: 128 }} />
              <div className="flex gap-2">
                <div style={{ ...shimmer, height: 40, width: 128 }} />
                <div style={{ ...shimmer, height: 40, width: 128 }} />
              </div>
            </div>

            {/* Table skeleton */}
            <div className="space-y-3 mt-4">
              <div className="grid grid-cols-6 gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} style={{ ...shimmer, height: 32 }} />
                ))}
              </div>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="grid grid-cols-6 gap-2">
                  {Array.from({ length: 6 }).map((_, j: number) => (
                    <div key={j} style={{ ...shimmer, height: 24 }} />
                  ))}
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t pt-4 space-y-2 mt-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <div style={{ ...shimmer, height: 20, width: 128 }} />
                  <div style={{ ...shimmer, height: 20, width: 96 }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
