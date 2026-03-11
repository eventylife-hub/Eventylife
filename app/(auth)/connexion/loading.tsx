export default function Loading() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem' }}>
      <div style={{ width: 36, height: 36, border: '3px solid #E5E0D8', borderTopColor: '#1A1A2E', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );
}
