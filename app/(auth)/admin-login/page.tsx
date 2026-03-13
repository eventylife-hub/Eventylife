'use client';

/**
 * Portail de connexion Administration — Design Admin V4 (Sun/Ocean)
 * Route : /admin-login
 * Séparé du layout admin (pas de sidebar)
 */

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ZodError } from 'zod';
import { AlertCircle, Loader, Shield } from 'lucide-react';
import { extractErrorMessage } from '@/lib/api-error';
import { loginSchema, zodErrorsToRecord } from '@/lib/validations/auth';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setErrors({});

    try {
      loginSchema.parse({ email, password });
    } catch (err) {
      if (err instanceof ZodError) {
        setErrors(zodErrorsToRecord(err));
        return;
      }
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Identifiants invalides');
      }

      const data = await response.json();

      if (data.user?.role !== 'ADMIN') {
        setError('Accès réservé aux administrateurs');
        setLoading(false);
        return;
      }

      router.push('/admin');
    } catch (err: unknown) {
      setError(extractErrorMessage(err, 'Erreur de connexion'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0A1628 0%, #122040 40%, #0A1628 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Effet de grille subtile */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)',
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
        }}
      />

      {/* Accent glow */}
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,119,182,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-15%',
          left: '-10%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,107,53,0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ width: '100%', maxWidth: '440px', position: 'relative', zIndex: 1 }}>
        {/* Card principale */}
        <div
          style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '20px',
            padding: '40px 32px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}
        >
          {/* En-tête */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #0077B6, #48CAE4)',
                marginBottom: '16px',
                boxShadow: '0 8px 24px rgba(0,119,182,0.3)',
              }}
            >
              <Shield size={28} color="#fff" strokeWidth={2} />
            </div>

            <h1
              style={{
                fontSize: '24px',
                fontWeight: 700,
                color: '#FFFFFF',
                marginBottom: '6px',
                letterSpacing: '-0.02em',
              }}
            >
              Administration
            </h1>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)' }}>
              Portail sécurisé — Eventy Life
            </p>
          </div>

          {/* Message d'erreur */}
          {error && (
            <div
              role="alert"
              style={{
                marginBottom: '20px',
                padding: '12px 16px',
                background: 'rgba(230,57,70,0.15)',
                border: '1px solid rgba(230,57,70,0.25)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <AlertCircle size={18} color="#E63946" style={{ flexShrink: 0 }} />
              <p style={{ fontSize: '13px', color: '#FF8A95' }}>{error}</p>
            </div>
          )}

          {/* Formulaire */}
          <form aria-label="Connexion administrateur" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }} noValidate>
            <div>
              <label
                htmlFor="admin-email"
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: 'rgba(255,255,255,0.6)',
                  marginBottom: '8px',
                  letterSpacing: '0.02em',
                }}
              >
                Email administrateur
              </label>
              <input
                type="email"
                autoComplete="email"
                id="admin-email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => { const next = { ...prev }; delete next.email; return next; });
                }}
                placeholder="admin@eventylife.fr"
                required
                disabled={loading}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'admin-email-error' : undefined}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: `1px solid ${errors.email ? '#E63946' : 'rgba(255,255,255,0.1)'}`,
                  background: 'rgba(255,255,255,0.06)',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
                onFocus={(e) => {
                  if (!errors.email) e.currentTarget.style.borderColor = '#0077B6';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,119,182,0.2)';
                }}
                onBlur={(e) => {
                  const val = e.target.value;
                  if (!val.trim()) {
                    setErrors((prev) => ({ ...prev, email: 'L\'email est requis' }));
                    e.currentTarget.style.borderColor = '#E63946';
                  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
                    setErrors((prev) => ({ ...prev, email: 'Format d\'email invalide' }));
                    e.currentTarget.style.borderColor = '#E63946';
                  } else {
                    setErrors((prev) => { const next = { ...prev }; delete next.email; return next; });
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                  }
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
              {errors.email && <p id="admin-email-error" style={{ color: '#FF8A95', fontSize: '12px', marginTop: '4px' }}>{errors.email}</p>}
            </div>

            <div>
              <label
                htmlFor="admin-password"
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: 'rgba(255,255,255,0.6)',
                  marginBottom: '8px',
                  letterSpacing: '0.02em',
                }}
              >
                Mot de passe
              </label>
              <input
                type="password"
                autoComplete="current-password"
                id="admin-password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => { const next = { ...prev }; delete next.password; return next; });
                }}
                placeholder="••••••••"
                required
                disabled={loading}
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'admin-password-error' : undefined}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: `1px solid ${errors.password ? '#E63946' : 'rgba(255,255,255,0.1)'}`,
                  background: 'rgba(255,255,255,0.06)',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
                onFocus={(e) => {
                  if (!errors.password) e.currentTarget.style.borderColor = '#0077B6';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,119,182,0.2)';
                }}
                onBlur={(e) => {
                  const val = e.target.value;
                  if (!val) {
                    setErrors((prev) => ({ ...prev, password: 'Le mot de passe est requis' }));
                    e.currentTarget.style.borderColor = '#E63946';
                  } else {
                    setErrors((prev) => { const next = { ...prev }; delete next.password; return next; });
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                  }
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
              {errors.password && <p id="admin-password-error" style={{ color: '#FF8A95', fontSize: '12px', marginTop: '4px' }}>{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: '4px',
                width: '100%',
                padding: '13px 0',
                borderRadius: '10px',
                border: 'none',
                background: loading
                  ? 'rgba(255,255,255,0.1)'
                  : 'linear-gradient(135deg, #0077B6, #0090D9)',
                color: '#fff',
                fontSize: '14px',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: loading ? 'none' : '0 6px 20px rgba(0,119,182,0.3)',
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,119,182,0.45)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,119,182,0.3)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              {loading && <Loader size={16} className="animate-spin" />}
              {loading ? 'Vérification...' : 'Accéder au panneau'}
            </button>
          </form>

          {/* Séparateur */}
          <div style={{ margin: '24px 0', borderTop: '1px solid rgba(255,255,255,0.06)' }} />

          {/* Footer */}
          <div style={{ textAlign: 'center' }}>
            <Link
              href="/connexion"
              style={{
                fontSize: '13px',
                color: 'rgba(255,255,255,0.4)',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}
            >
              ← Retour à la connexion client
            </Link>
          </div>
        </div>

        {/* Note sécurité */}
        <p
          style={{
            textAlign: 'center',
            fontSize: '11px',
            color: 'rgba(255,255,255,0.2)',
            marginTop: '20px',
            lineHeight: 1.5,
          }}
        >
          Connexion chiffrée · 2FA recommandé · Session expirable
        </p>
      </div>
    </main>
  );
}
