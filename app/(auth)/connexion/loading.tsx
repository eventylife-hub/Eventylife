/**
 * Loading skeleton — Connexion client
 * Design Eventy v2 : cream background, shimmer pattern
 */
export default function ConnexionLoading() {
  const shimmer = {
    borderRadius: 10,
    background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
  } as const;

  return (
    <>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
      <div
        style={{
          minHeight: '100vh',
          background: 'var(--cream, #FAF7F2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '28rem',
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            border: '1.5px solid #E5E0D8',
            boxShadow: '0 8px 40px rgba(26,26,46,0.08)',
            padding: '2rem 2.5rem',
          }}
        >
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ ...shimmer, height: 28, width: 120, margin: '0 auto' }} />
          </div>

          {/* Titre + sous-titre */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ ...shimmer, height: 24, width: 120, marginBottom: 8 }} />
            <div style={{ ...shimmer, height: 14, width: 240 }} />
          </div>

          {/* Champs email + password */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <div style={{ ...shimmer, height: 14, width: 48, marginBottom: 6 }} />
              <div style={{ ...shimmer, height: 44, width: '100%' }} />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <div style={{ ...shimmer, height: 14, width: 80 }} />
                <div style={{ ...shimmer, height: 14, width: 52 }} />
              </div>
              <div style={{ ...shimmer, height: 44, width: '100%' }} />
            </div>

            {/* Bouton submit */}
            <div style={{ ...shimmer, height: 44, width: '100%', borderRadius: 12 }} />
          </div>

          {/* Divider */}
          <div style={{ margin: '1.5rem 0', borderTop: '1px solid #E5E0D8' }} />

          {/* Bouton inscription */}
          <div style={{ ...shimmer, height: 44, width: '100%', borderRadius: 12 }} />

          {/* Footer */}
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <div style={{ ...shimmer, height: 12, width: 280, margin: '0 auto' }} />
          </div>
        </div>
      </div>
    </>
  );
}
