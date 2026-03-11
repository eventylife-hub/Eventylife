'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AlertCircle, Loader, CheckCircle2, ArrowLeft } from 'lucide-react';
export default function ProForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role: 'pro' }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Erreur lors de l\'envoi');
      }

      setSent(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#FEFCF3', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ width: '100%', maxWidth: '448px' }}>
        <div className="pro-panel" style={{ padding: '32px' }}>
          <Link
            href="/pro/login"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '14px', color: '#8896A6', marginBottom: '24px', textDecoration: 'none' }}
          >
            <ArrowLeft className="w-4 h-4" />
            Retour connexion
          </Link>

          <h1 className="pro-page-title" style={{ marginBottom: '8px', fontSize: '24px' }}>Mot de passe oublie</h1>
          <p style={{ color: '#8896A6', marginBottom: '24px', fontSize: '14px' }}>
            Entrez votre email professionnel pour recevoir un lien de reinitialisation.
          </p>

          {sent ? (
            <div style={{ padding: '24px', backgroundColor: '#E0FFF5', border: '1px solid #E0FFF5', borderRadius: '8px', textAlign: 'center' }}>
              <CheckCircle2 className="w-12 h-12" style={{ color: 'var(--pro-mint)', margin: '0 auto 12px' }} />
              <h2 style={{ fontWeight: 600, color: 'var(--pro-mint)', marginBottom: '8px' }}>Email envoye</h2>
              <p style={{ fontSize: '14px', color: 'var(--pro-mint)', marginBottom: '12px' }}>
                Si un compte existe avec l&apos;adresse <strong>{email}</strong>,
                vous recevrez un lien de reinitialisation dans quelques minutes.
              </p>
              <p style={{ fontSize: '12px', color: 'var(--pro-mint)' }}>
                Pensez a verifier vos spams.
              </p>
            </div>
          ) : (
            <>
              {error && (
                <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#FFE0E3', border: '1px solid #FFE0E3', borderRadius: '8px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <AlertCircle className="w-5 h-5" style={{ color: 'var(--pro-coral)', marginTop: '2px', flexShrink: 0 }} />
                  <p style={{ fontSize: '14px', color: 'var(--pro-coral)' }}>{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label
                    htmlFor="email"
                    style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#0A1628', marginBottom: '8px' }}
                  >
                    Email professionnel
                  </label>
                  <input
                    type="email"
                autoComplete="email"
                    id="email"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail((e.target as HTMLInputElement).value)}
                    placeholder="pro@eventy.life"
                    className="pro-input"
                    required
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="pro-btn-sun"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  {loading && <Loader className="w-4 h-4 animate-spin" />}
                  {loading ? 'Envoi...' : 'Envoyer le lien'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
