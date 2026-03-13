import Link from 'next/link';

export default function BlogNotFound() {
  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem',
        backgroundColor: '#FAF7F2',
      }}
    >
      <p style={{ fontSize: '4rem', marginBottom: '1rem' }}>📝</p>
      <h1
        style={{
          fontSize: '2rem',
          fontWeight: 700,
          color: '#1A1A2E',
          marginBottom: '0.75rem',
          fontFamily: 'var(--font-fraunces, Fraunces, serif)',
        }}
      >
        Article introuvable
      </h1>
      <p style={{ color: '#64748B', fontSize: '1.125rem', marginBottom: '2rem', maxWidth: '28rem' }}>
        Cet article n'existe pas ou a été supprimé.
      </p>
      <Link
        href="/blog"
        style={{
          display: 'inline-block',
          padding: '0.75rem 2rem',
          backgroundColor: '#C75B39',
          color: 'white',
          borderRadius: '12px',
          fontWeight: 600,
          textDecoration: 'none',
          fontSize: '1rem',
        }}
      >
        Retour au blog
      </Link>
    </div>
  );
}
