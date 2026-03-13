/**
 * Loading skeleton — Admin Login
 * Design Eventy v2 : dark navy background, shimmer pattern
 */
export default function AdminLoginLoading() {
  const shimmer = {
    borderRadius: 10,
    background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
  } as const;

  return (
    <>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0A1628 0%, #122040 40%, #0A1628 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
        }}
      >
        <div style={{ width: '100%', maxWidth: '440px' }}>
          <div
            style={{
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '20px',
              padding: '40px 32px',
            }}
          >
            {/* Icône placeholder */}
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{ ...shimmer, width: 56, height: 56, borderRadius: 16, margin: '0 auto 16px' }} />
              <div style={{ ...shimmer, height: 24, width: 180, margin: '0 auto 6px' }} />
              <div style={{ ...shimmer, height: 14, width: 160, margin: '0 auto' }} />
            </div>

            {/* Champs placeholder */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <div style={{ ...shimmer, height: 13, width: 140, marginBottom: 8 }} />
                <div style={{ ...shimmer, height: 44, width: '100%' }} />
              </div>
              <div>
                <div style={{ ...shimmer, height: 13, width: 100, marginBottom: 8 }} />
                <div style={{ ...shimmer, height: 44, width: '100%' }} />
              </div>
              {/* Bouton submit */}
              <div style={{ ...shimmer, height: 46, width: '100%', borderRadius: 12, marginTop: 4 }} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
