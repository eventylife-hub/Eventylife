export default function Loading() {
  return (
    <div className="pro-loading">
      <div className="pro-loading-spinner" />
      <p style={{ color: 'var(--pro-text-muted)', marginTop: '1rem' }}>Chargement...</p>
    </div>
  );
}
