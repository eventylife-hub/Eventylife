/**
 * Loading skeleton — Vérification email
 * Design Eventy v2 : cream background, shimmer pattern
 */
export default function VerificationEmailLoading() {
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
          backgroundColor: 'var(--cream, #FAF7F2)',
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
            padding: '2rem',
            textAlign: 'center',
          }}
        >
          {/* Icône placeholder */}
          <div style={{ ...shimmer, height: 64, width: 64, borderRadius: 16, margin: '0 auto 1.5rem' }} />

          {/* Titre */}
          <div style={{ ...shimmer, height: 24, width: 200, margin: '0 auto 8px' }} />

          {/* Description */}
          <div style={{ ...shimmer, height: 14, width: 280, margin: '0 auto 6px' }} />
          <div style={{ ...shimmer, height: 14, width: 240, margin: '0 auto 1.5rem' }} />

          {/* Bouton */}
          <div style={{ ...shimmer, height: 44, width: '100%', borderRadius: 12 }} />

          {/* Lien retour */}
          <div style={{ ...shimmer, height: 14, width: 140, margin: '1.5rem auto 0' }} />
        </div>
      </div>
    </>
  );
}
