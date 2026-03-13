/**
 * Loading skeleton — Client Login
 * Design Eventy v2 : cream gradient, shimmer pattern
 */
export default function LoginLoading() {
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
          background: 'linear-gradient(135deg, #FFF7ED 0%, #FEFCF3 50%, #FFF1E6 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
        }}
      >
        <div style={{ width: '100%', maxWidth: '28rem' }}>
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
              padding: '2rem',
            }}
          >
            {/* Titre placeholder */}
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ ...shimmer, height: 32, width: 192, margin: '0 auto 8px' }} />
              <div style={{ ...shimmer, height: 16, width: 144, margin: '0 auto' }} />
            </div>

            {/* Champs email + password */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <div style={{ ...shimmer, height: 14, width: 48, marginBottom: 8 }} />
                <div style={{ ...shimmer, height: 44, width: '100%' }} />
              </div>
              <div>
                <div style={{ ...shimmer, height: 14, width: 80, marginBottom: 8 }} />
                <div style={{ ...shimmer, height: 44, width: '100%' }} />
              </div>
              {/* Bouton submit */}
              <div style={{ ...shimmer, height: 44, width: '100%', borderRadius: 12, marginTop: 4 }} />
            </div>

            {/* Lien mot de passe oublié */}
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <div style={{ ...shimmer, height: 14, width: 160, margin: '0 auto' }} />
            </div>

            {/* Séparateur + lien inscription */}
            <div style={{ margin: '1.5rem 0', borderTop: '1px solid #E5E0D8' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ ...shimmer, height: 16, width: 192, margin: '0 auto' }} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
