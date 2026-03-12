/**
 * Loading skeleton — Admin Login
 */
export default function AdminLoginLoading() {
  return (
    <main
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
            <div
              style={{
                display: 'inline-block',
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                background: 'rgba(255,255,255,0.06)',
                marginBottom: '16px',
              }}
            />
            <div style={{ height: '24px', width: '180px', margin: '0 auto 6px', background: 'rgba(255,255,255,0.06)', borderRadius: '6px' }} />
            <div style={{ height: '14px', width: '160px', margin: '0 auto', background: 'rgba(255,255,255,0.04)', borderRadius: '4px' }} />
          </div>

          {/* Champs placeholder */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <div style={{ height: '13px', width: '140px', background: 'rgba(255,255,255,0.04)', borderRadius: '4px', marginBottom: '8px' }} />
              <div style={{ height: '44px', width: '100%', background: 'rgba(255,255,255,0.06)', borderRadius: '10px' }} />
            </div>
            <div>
              <div style={{ height: '13px', width: '100px', background: 'rgba(255,255,255,0.04)', borderRadius: '4px', marginBottom: '8px' }} />
              <div style={{ height: '44px', width: '100%', background: 'rgba(255,255,255,0.06)', borderRadius: '10px' }} />
            </div>
            <div style={{ height: '46px', width: '100%', background: 'rgba(255,255,255,0.06)', borderRadius: '10px', marginTop: '4px' }} />
          </div>
        </div>
      </div>
    </main>
  );
}
