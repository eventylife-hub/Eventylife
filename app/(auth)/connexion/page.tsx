'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ZodError } from 'zod';
import { loginSchema, zodErrorsToRecord } from '@/lib/validations/auth';
/**
 * Page de connexion — Design Eventy v2
 * Utilise fetch brut (pas apiClient) pour éviter le refresh token loop sur 401
 */
export default function ConnexionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/client/dashboard';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setErrors({});
    setLoading(true);

    try {
      loginSchema.parse(formData);

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Identifiants invalides');
        return;
      }

      const user = data.user;
      if (user?.role === 'ADMIN') {
        router.push('/admin');
      } else if (user?.role === 'PRO') {
        router.push('/pro');
      } else {
        router.push(redirect);
      }
    } catch (err: unknown) {
      if (err instanceof ZodError) {
        setErrors(zodErrorsToRecord(err));
      } else if (err instanceof Error) {
        setError(err.message || 'Erreur de connexion');
      } else {
        setError('Erreur de connexion');
      }
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (hasError: boolean) => ({
    width: '100%',
    padding: '12px 16px',
    borderRadius: '10px',
    border: `1.5px solid ${hasError ? '#E63946' : '#E5E0D8'}`,
    background: '#fff',
    color: 'var(--navy, #1A1A2E)',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  });

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: 'var(--cream, #FAF7F2)' }}
    >
      <div
        className="w-full max-w-md p-8 sm:p-10 animate-fade-up"
        style={{
          background: '#fff',
          borderRadius: '20px',
          border: '1.5px solid #E5E0D8',
          boxShadow: '0 8px 40px rgba(26,26,46,0.08)',
        }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-0">
            <span className="font-display text-2xl font-bold" style={{ color: 'var(--navy, #1A1A2E)' }}>Eventy</span>
            <span className="font-display text-2xl font-bold" style={{ color: 'var(--gold, #D4A853)' }}>.</span>
            <span className="font-display text-2xl font-bold" style={{ color: 'var(--navy, #1A1A2E)' }}>Life</span>
          </Link>
        </div>

        {/* Titre */}
        <h2 className="font-display text-xl font-bold mb-1" style={{ color: 'var(--navy, #1A1A2E)' }}>Connexion</h2>
        <p className="text-sm mb-6" style={{ color: '#6B7280' }}>
          Bienvenue ! Connectez-vous à votre compte
        </p>

        {/* Message d'erreur */}
        {error && (
          <div
            className="mb-4 p-3 rounded-lg text-sm"
            style={{ background: 'var(--terra-soft, #FEF2F2)', border: '1px solid #FECACA', color: 'var(--terra, #DC2626)' }}
          >
            {error}
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1.5" style={{ color: 'var(--navy, #1A1A2E)' }}>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
                autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={inputStyle(!!errors.email)}
              placeholder="votre@email.com"
              onFocus={(e) => {
                if (!errors.email) e.currentTarget.style.borderColor = 'var(--terra, #C75B39)';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(199,91,57,0.08)';
              }}
              onBlur={(e) => {
                if (!errors.email) e.currentTarget.style.borderColor = '#E5E0D8';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
            {errors.email && <p className="text-xs mt-1" style={{ color: 'var(--terra, #DC2626)' }}>{errors.email}</p>}
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label htmlFor="password" className="block text-sm font-medium" style={{ color: 'var(--navy, #1A1A2E)' }}>
                Mot de passe
              </label>
              <Link href="/mot-de-passe-oublie" className="text-xs font-medium" style={{ color: 'var(--terra, #C75B39)' }}>
                Oublié ?
              </Link>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                required
                style={inputStyle(!!errors.password)}
                placeholder="••••••••"
                onFocus={(e) => {
                  if (!errors.password) e.currentTarget.style.borderColor = 'var(--terra, #C75B39)';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(199,91,57,0.08)';
                }}
                onBlur={(e) => {
                  if (!errors.password) e.currentTarget.style.borderColor = '#E5E0D8';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#718096',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
            {errors.password && <p className="text-xs mt-1" style={{ color: 'var(--terra, #DC2626)' }}>{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200"
            style={{
              background: loading ? '#6B7280' : 'var(--terra, #C75B39)',
              color: '#fff',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.background = '#D97B5E';
                e.currentTarget.style.boxShadow = '0 6px 24px rgba(199,91,57,0.18)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.background = 'var(--terra, #C75B39)';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
          >
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full" style={{ borderTop: '1px solid #E5E0D8' }}></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-3 bg-white" style={{ color: '#6B7280' }}>Nouveau client ?</span>
          </div>
        </div>

        {/* Lien inscription */}
        <Link
          href="/inscription"
          className="w-full py-3 rounded-xl font-semibold text-sm text-center block transition-all duration-200"
          style={{
            background: 'transparent',
            color: 'var(--navy, #1A1A2E)',
            border: '1.5px solid #E5E0D8',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--terra, #C75B39)';
            e.currentTarget.style.background = 'var(--terra-soft)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#E5E0D8';
            e.currentTarget.style.background = 'transparent';
          }}
        >
          Créer un compte
        </Link>

        {/* Footer */}
        <p className="text-center text-xs mt-6" style={{ color: '#6B7280' }}>
          En vous connectant, vous acceptez nos{' '}
          <Link href="/cgv" style={{ color: 'var(--terra, #C75B39)' }}>CGV</Link>{' '}
          et notre{' '}
          <Link href="/politique-confidentialite" style={{ color: 'var(--terra, #C75B39)' }}>politique de confidentialité</Link>
        </p>
      </div>
    </div>
  );
}
