'use client';
import { useState } from 'react';

export default function MotDePasseOubliePage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) { setError('Veuillez saisir votre email.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Email invalide.'); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1500);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 50%, #0F3460 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: 440, background: '#FAF7F2', borderRadius: 16, padding: '48px 40px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <a href="/" style={{ textDecoration: 'none' }}>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: '#1A1A2E', margin: 0 }}>Eventy Life</h1>
          </a>
          <h2 style={{ fontSize: 22, fontWeight: 600, color: '#1A1A2E', margin: '8px 0 0' }}>Mot de passe oubli&#233;</h2>
        </div>

        {sent ? (
          <div>
            <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 12, padding: '24px', textAlign: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>&#9993;</div>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: '#059669', margin: '0 0 8px' }}>Email envoy&#233; !</h3>
              <p style={{ fontSize: 14, color: '#374151', margin: 0, lineHeight: 1.5 }}>
                Si un compte existe avec l&apos;adresse <strong>{email}</strong>, vous recevrez un lien pour r&#233;initialiser votre mot de passe dans les prochaines minutes.
              </p>
            </div>
            <p style={{ fontSize: 13, color: '#6B7280', textAlign: 'center', margin: '0 0 20px' }}>
              Vous n&apos;avez pas re&#231;u l&apos;email ? V&#233;rifiez votre dossier spam ou <button onClick={() => { setSent(false); setEmail(''); }} style={{ background: 'none', border: 'none', color: '#C75B39', cursor: 'pointer', fontWeight: 600, fontSize: 13, padding: 0 }}>r&#233;essayez</button>.
            </p>
            <a href="/connexion" style={{ display: 'block', textAlign: 'center', padding: '14px', background: '#1A1A2E', color: 'white', borderRadius: 10, fontSize: 16, fontWeight: 600, textDecoration: 'none' }}>Retour &#224; la connexion</a>
          </div>
        ) : (
          <div>
            <p style={{ fontSize: 14, color: '#6B7280', textAlign: 'center', marginBottom: 24, lineHeight: 1.5 }}>
              Saisissez votre adresse email et nous vous enverrons un lien pour r&#233;initialiser votre mot de passe.
            </p>

            {error && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '12px 16px', marginBottom: 20, color: '#DC2626', fontSize: 14 }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#1A1A2E', marginBottom: 6 }}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  autoFocus
                  style={{ width: '100%', padding: '12px 16px', border: '1px solid #E8E4DE', borderRadius: 8, fontSize: 15, outline: 'none', background: 'white', boxSizing: 'border-box' }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{ width: '100%', padding: '14px', background: loading ? '#D4A853' : '#C75B39', color: 'white', border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', marginBottom: 16 }}
              >
                {loading ? 'Envoi en cours...' : 'Envoyer le lien'}
              </button>
            </form>

            <a href="/connexion" style={{ display: 'block', textAlign: 'center', fontSize: 14, color: '#6B7280', textDecoration: 'none' }}>
              &#8592; Retour &#224; la connexion
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
