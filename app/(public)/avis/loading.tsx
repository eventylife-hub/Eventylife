export default function AvisLoading() {
  return (
    <div style={{ backgroundColor: 'var(--cream, #FAF7F2)', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #2d2d4e 100%)', padding: '5rem 1rem 4rem' }}>
        <div className="mx-auto max-w-6xl text-center">
          <div className="h-4 w-36 mx-auto mb-4 rounded-full animate-pulse" style={{ background: 'rgba(255,255,255,0.1)' }} />
          <div className="h-10 w-80 mx-auto mb-4 rounded-xl animate-pulse" style={{ background: 'rgba(255,255,255,0.1)' }} />
          <div className="h-5 w-64 mx-auto rounded-lg animate-pulse" style={{ background: 'rgba(255,255,255,0.1)' }} />
        </div>
      </div>
      <div className="mx-auto max-w-5xl px-4 py-12 space-y-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-40 rounded-2xl animate-pulse"
            style={{ background: 'rgba(26,26,46,0.04)' }}
          />
        ))}
      </div>
    </div>
  );
}
