export default function Loading() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '40vh', gap: '1rem' }}>
      <div style={{ width: 40, height: 40, border: '3px solid #E5E0D8', borderTopColor: '#C75B39', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ color: '#6B7280' }}>Chargement...</p>
    </div>
  );
}
