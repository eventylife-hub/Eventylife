'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ZodError } from 'zod';
import { apiClient } from '@/lib/api-client';
import { loginSchema, zodErrorsToRecord } from '@/lib/validations/auth';

const C = {
  navy: '#1A1A2E',
  cream: '#FAF7F2',
  terra: '#C75B39',
  terraLight: '#D97B5E',
  gold: '#D4A853',
  border: '#E5E0D8',
  muted: '#6B7280',
};

/**
 * Page de connexion — Design Eventy v2
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

      interface LoginResponse {
        user: {
          id: string;
          email: string;
          role: 'ADMIN' | 'PRO' | 'CLIENT';
        };
      }

      const response = await apiClient.post<LoginResponse>('/auth/login', {
        email: formData.email,
        password: formData.password,
      });

      const user = response.user;
      if (user?.role === 'ADMIN') {
        router.push('/admin');
      } else if (user?.role === 'PRO') {
        router.push('/pro');
      } else {
        router.push(redirect);
      }
    } catch (err) {
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
    border: `1.5px solid ${hasError ? '#E63946' : C.border}`,
    background: '#fff',
    color: C.navy,
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  });

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: C.cream }}
    >
      <div
        className="w-full max-w-md p-8 sm:p-10 animate-fade-up"
        style={{
          background: '#fff',
          borderRadius: '20px',
          border: `1.5px solid ${C.border}`,
          boxShadow: '0 8px 40px rgba(26,26,46,0.08)',
        }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-0">
            <span className="font-display text-2xl font-bold" style={{ color: C.navy }}>Eventy</span>
            <span className="font-display text-2xl font-bold" style={{ color: C.gold }}>.</span>
            <span className="font-display text-2xl font-bold" style={{ color: C.navy }}>Life</span>
          </Link>
        </div>

        {/* Titre */}
        <h2 className="font-display text-xl font-bold mb-1" style={{ color: C.navy }}>Connexion</h2>
        <p className="text-sm mb-6" style={{ color: C.muted }}>
          Bienvenue! Connectez-vous à votre compte
        </p>

        {/* Message d'erreur */}
        {error && (
          <div
            className="mb-4 p-3 rounded-lg text-sm"
            style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626' }}
          >
            {error}
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1.5" style={{ color: C.navy }}>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={inputStyle(!!errors.email)}
              placeholder="votre@email.com"
              onFocus={(e) => {
                if (!errors.email) e.currentTarget.style.borderColor = C.terra;
                e.currentTarget.style.boxShadow = `0 0 0 3px ${C.terra}15`;
              }}
              onBlur={(e) => {
                if (!errors.email) e.currentTarget.style.borderColor = C.border;
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
            {errors.email && <p className="text-xs mt-1" style={{ color: '#DC2626' }}>{errors.email}</p>}
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label htmlFor="password" className="block text-sm font-medium" style={{ color: C.navy }}>
                Mot de passe
              </label>
              <Link href="/mot-de-passe-oublie" className="text-xs font-medium" style={{ color: C.terra }}>
                Oublié?
              </Link>
            </div>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={inputStyle(!!errors.password)}
              placeholder="••••••••"
              onFocus={(e) => {
                if (!errors.password) e.currentTarget.style.borderColor = C.terra;
                e.currentTarget.style.boxShadow = `0 0 0 3px ${C.terra}15`;
              }}
              onBlur={(e) => {
                if (!errors.password) e.currentTarget.style.borderColor = C.border;
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
            {errors.password && <p className="text-xs mt-1" style={{ color: '#DC2626' }}>{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200"
            style={{
              background: loading ? C.muted : C.terra,
              color: '#fff',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.background = C.terraLight;
                e.currentTarget.style.boxShadow = `0 6px 24px ${C.terra}30`;
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.background = C.terra;
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
            <div className="w-full" style={{ borderTop: `1px solid ${C.border}` }}></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-3 bg-white" style={{ color: C.muted }}>Nouveau client?</span>
          </div>
        </div>

        {/* Lien inscription */}
        <Link
          href="/inscription"
          className="w-full py-3 rounded-xl font-semibold text-sm text-center block transition-all duration-200"
          style={{
            background: 'transparent',
            color: C.navy,
            border: `1.5px solid ${C.border}`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = C.terra;
            e.currentTarget.style.background = '#FEF0EB';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = C.border;
            e.currentTarget.style.background = 'transparent';
          }}
        >
          Créer un compte
        </Link>

        {/* Footer */}
        <p className="text-center text-xs mt-6" style={{ color: C.muted }}>
          En vous connectant, vous acceptez nos{' '}
          <Link href="/cgv" style={{ color: C.terra }}>CGV</Link>{' '}
          et notre{' '}
          <Link href="/politique-confidentialite" style={{ color: C.terra }}>politique de confidentialité</Link>
        </p>
      </div>
    </div>
  );
}
