/**
 * Loading skeleton — Conditions générales
 * Design Eventy v2 : cream background, shimmer pattern
 */
export default function ConditionsLoading() {
  const shimmer = {
    borderRadius: 10,
    background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
  } as const;

  return (
    <>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
      <div style={{ minHeight: '100vh', backgroundColor: '#FEFCF3' }}>
        <div style={{ maxWidth: '48rem', margin: '0 auto', padding: '4rem 1rem' }}>
          {/* Titre */}
          <div style={{ ...shimmer, height: 40, width: 288, marginBottom: 16 }} />
          <div style={{ ...shimmer, height: 16, width: 192, marginBottom: '3rem' }} />

          {/* Blocs de texte */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i}>
                <div style={{ ...shimmer, height: 24, width: 256, marginBottom: 12 }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ ...shimmer, height: 16, width: '100%' }} />
                  <div style={{ ...shimmer, height: 16, width: '100%' }} />
                  <div style={{ ...shimmer, height: 16, width: '75%' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
