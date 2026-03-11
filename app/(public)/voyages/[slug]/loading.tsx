/**
 * Skeleton Loading — Page détail voyage
 * Design Sun/Ocean V4
 */
export default function VoyageDetailLoading() {
  const pulse = {
    background: 'rgba(26,26,46,0.08)',
    borderRadius: '8px',
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: 'var(--cream, #FAF7F2)' }}
    >
      {/* Hero image skeleton */}
      <div
        className="w-full animate-pulse"
        style={{
          height: '400px',
          background: 'linear-gradient(135deg, rgba(26,26,46,0.1) 0%, rgba(26,26,46,0.06) 100%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex gap-2 items-center mb-6">
          {[60, 16, 80, 16, 120].map((w, i) => (
            <div
              key={i}
              className="h-4 animate-pulse"
              style={{ ...pulse, width: `${w}px` }}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Titre + badges */}
            <div>
              <div className="flex gap-2 mb-4">
                <div
                  className="h-7 w-20 rounded-full animate-pulse"
                  style={{ background: 'rgba(199,91,57,0.1)' }}
                />
                <div
                  className="h-7 w-24 rounded-full animate-pulse"
                  style={{ background: 'rgba(212,168,83,0.1)' }}
                />
              </div>
              <div
                className="h-10 w-3/4 animate-pulse mb-2"
                style={pulse}
              />
              <div
                className="h-5 w-1/2 animate-pulse"
                style={{ ...pulse, background: 'rgba(26,26,46,0.05)' }}
              />
            </div>

            {/* Description */}
            <div
              className="p-6 rounded-2xl"
              style={{
                background: 'white',
                border: '1px solid rgba(26,26,46,0.08)',
              }}
            >
              <div className="h-6 w-32 animate-pulse mb-4" style={pulse} />
              {[100, 95, 100, 80, 100, 60].map((w, i) => (
                <div
                  key={i}
                  className="h-4 animate-pulse mb-2.5"
                  style={{ ...pulse, width: `${w}%`, background: 'rgba(26,26,46,0.05)' }}
                />
              ))}
            </div>

            {/* Programme */}
            <div
              className="p-6 rounded-2xl"
              style={{
                background: 'white',
                border: '1px solid rgba(26,26,46,0.08)',
              }}
            >
              <div className="h-6 w-40 animate-pulse mb-6" style={pulse} />
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-4 mb-6">
                  <div
                    className="w-12 h-12 rounded-xl animate-pulse flex-shrink-0"
                    style={{ background: 'rgba(199,91,57,0.08)' }}
                  />
                  <div className="flex-1">
                    <div className="h-5 w-48 animate-pulse mb-2" style={pulse} />
                    <div className="h-4 w-full animate-pulse mb-1" style={{ ...pulse, background: 'rgba(26,26,46,0.04)' }} />
                    <div className="h-4 w-3/4 animate-pulse" style={{ ...pulse, background: 'rgba(26,26,46,0.04)' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar réservation */}
          <div>
            <div
              className="p-6 rounded-2xl sticky top-24"
              style={{
                background: 'white',
                border: '1px solid rgba(26,26,46,0.08)',
                boxShadow: '0 4px 20px rgba(26,26,46,0.06)',
              }}
            >
              {/* Prix */}
              <div className="h-8 w-40 animate-pulse mb-1" style={{ ...pulse, background: 'rgba(199,91,57,0.12)' }} />
              <div className="h-4 w-24 animate-pulse mb-6" style={{ ...pulse, background: 'rgba(26,26,46,0.04)' }} />

              {/* Dates */}
              <div className="h-5 w-20 animate-pulse mb-2" style={pulse} />
              <div className="h-10 w-full rounded-xl animate-pulse mb-4" style={{ background: 'rgba(26,26,46,0.05)' }} />

              {/* Voyageurs */}
              <div className="h-5 w-24 animate-pulse mb-2" style={pulse} />
              <div className="h-10 w-full rounded-xl animate-pulse mb-4" style={{ background: 'rgba(26,26,46,0.05)' }} />

              {/* Places restantes */}
              <div className="h-4 w-32 animate-pulse mb-6" style={{ ...pulse, background: 'rgba(26,26,46,0.04)' }} />

              {/* CTA button */}
              <div
                className="h-12 w-full rounded-xl animate-pulse"
                style={{ background: 'rgba(199,91,57,0.15)' }}
              />

              {/* Garanties */}
              <div className="mt-6 pt-4" style={{ borderTop: '1px solid rgba(26,26,46,0.06)' }}>
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 rounded-full animate-pulse" style={{ background: 'rgba(26,26,46,0.06)' }} />
                    <div className="h-3 w-36 animate-pulse" style={{ ...pulse, background: 'rgba(26,26,46,0.04)' }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
