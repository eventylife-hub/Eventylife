/**
 * Loading skeleton — Comment ça marche
 * Design Eventy v2 : cream background, shimmer pattern
 */
export default function CommentCaMarcheLoading() {
  const shimmer = {
    borderRadius: 10,
    background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
  } as const;

  const shimmerLight = {
    borderRadius: 10,
    background: 'linear-gradient(90deg, rgba(255,255,255,0.08) 25%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.08) 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
  } as const;

  return (
    <>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
      <div style={{ backgroundColor: '#FAF7F2', minHeight: '100vh' }}>
        {/* Hero skeleton */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1A1A2E 0%, #2d2d4e 100%)',
            padding: '5rem 1rem 4rem',
            textAlign: 'center',
          }}
        >
          <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
            <div style={{ ...shimmerLight, height: 16, width: 160, margin: '0 auto 16px' }} />
            <div style={{ ...shimmerLight, height: 40, width: 320, margin: '0 auto 16px' }} />
            <div style={{ ...shimmerLight, height: 20, width: 256, margin: '0 auto' }} />
          </div>
        </div>

        <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '3rem 1rem' }}>
          {/* Breadcrumb skeleton */}
          <div style={{ display: 'flex', gap: 8, marginBottom: '2.5rem' }}>
            <div style={{ ...shimmer, height: 16, width: 64 }} />
            <div style={{ ...shimmer, height: 16, width: 16 }} />
            <div style={{ ...shimmer, height: 16, width: 144 }} />
          </div>

          {/* 4 étapes skeleton */}
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={{ display: 'flex', gap: '2rem', marginBottom: '4rem', alignItems: 'flex-start' }}>
              {/* Icône + numéro */}
              <div style={{ flexShrink: 0, textAlign: 'center' }}>
                <div style={{ ...shimmer, width: 80, height: 80, borderRadius: 16 }} />
                <div style={{ ...shimmer, height: 12, width: 64, margin: '12px auto 0' }} />
              </div>
              {/* Contenu */}
              <div
                style={{
                  flex: 1,
                  padding: '1.5rem',
                  borderRadius: 16,
                  background: 'white',
                  border: '1px solid rgba(26,26,46,0.08)',
                }}
              >
                <div style={{ ...shimmer, height: 24, width: 192, marginBottom: 12 }} />
                <div style={{ ...shimmer, height: 16, width: '100%', marginBottom: 8 }} />
                <div style={{ ...shimmer, height: 16, width: '75%', marginBottom: 16 }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ ...shimmer, height: 12, width: 224 }} />
                  <div style={{ ...shimmer, height: 12, width: 192 }} />
                  <div style={{ ...shimmer, height: 12, width: 208 }} />
                </div>
              </div>
            </div>
          ))}

          {/* Garanties skeleton */}
          <div style={{ marginBottom: '5rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <div style={{ ...shimmer, height: 12, width: 128, margin: '0 auto 12px' }} />
              <div style={{ ...shimmer, height: 32, width: 192, margin: '0 auto' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  style={{
                    textAlign: 'center',
                    padding: '1.25rem',
                    borderRadius: 16,
                    background: 'white',
                    border: '1px solid rgba(26,26,46,0.08)',
                  }}
                >
                  <div style={{ ...shimmer, width: 40, height: 40, borderRadius: '50%', margin: '0 auto 12px' }} />
                  <div style={{ ...shimmer, height: 16, width: 112, margin: '0 auto 8px' }} />
                  <div style={{ ...shimmer, height: 12, width: 144, margin: '0 auto' }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
