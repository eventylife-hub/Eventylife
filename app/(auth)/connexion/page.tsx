'use client';
import { useState } from 'react';

export default function ConnexionPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 50%, #0F3460 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: 440, background: '#FAF7F2', borderRadius: 16, padding: '48px 40px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <a href="/" style={{ textDecoration: 'none' }}>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: '#1A1A2E', margin: 0 }}>Eventy Life</h1>
          </a>
          <h2 style={{ fontSize: 22, fontWeight: 600, color: '#1A1A2E', margin: '8px 0 0' }}>Connexion</h2>
        </div>

        {error && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '12px 16px', marginBottom: 20, color: '#DC2626', fontSize: 14 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#1A1A2E', marginBottom: 6 }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              style={{ width: '100%', padding: '12px 16px', border: '1px solid #E8E4DE', borderRadius: 8, fontSize: 15, outline: 'none', background: 'white', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: 8 }}>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#1A1A2E', marginBottom: 6 }}>Mot de passe</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Votre mot de passe"
                style={{ width: '100%', padding: '12px 16px', paddingRight: 48, border: '1px solid #E8E4DE', borderRadius: 8, fontSize: 15, outline: 'none', background: 'white', boxSizing: 'border-box' }}
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#6B7280', fontSize: 13 }}
              >
                {showPwd ? 'Masquer' : 'Voir'}
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'right', marginBottom: 24 }}>
            <a href="/mot-de-passe-oublie" style={{ fontSize: 13, color: '#C75B39', textDecoration: 'none' }}>Mot de passe oubli&#233; ?</a>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '14px', background: loading ? '#D4A853' : '#C75B39', color: 'white', border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}
          >
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0', gap: 12 }}>
          <div style={{ flex: 1, height: 1, background: '#E8E4DE' }} />
          <span style={{ fontSize: 13, color: '#6B7280' }}>ou</span>
          <div style={{ flex: 1, height: 1, background: '#E8E4DE' }} />
        </div>

        <p style={{ textAlign: 'center', fontSize: 14, color: '#6B7280', margin: 0 }}>
          Pas encore de compte ? <a href="/inscription" style={{ color: '#C75B39', fontWeight: 600, textDecoration: 'none' }}>Cr&#233;er un compte</a>
        </p>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <a href="/" style={{ fontSize: 13, color: '#6B7280', textDecoration: 'underline' }}>Retour &#224; l&apos;accueil</a>
        </div>
      </div>
    </div>
  );
}
