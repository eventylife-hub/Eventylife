'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { resetPasswordSchema, zodErrorsToRecord } from '@/lib/validations/auth';
import { ZodError } from 'zod';
import { extractErrorMessage } from '@/lib/api-error';
/**
 * Page de réinitialisation du mot de passe
 * Le token est passé via les paramètres d'URL
 * Eventy v2 Design System
 */
export default function ReinitialiserMotDePassePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  if (!token) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: 'var(--cream, #FAF7F2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
        }}
      >
        <div
          className="animate-fade-up"
          style={{
            width: '100%',
            maxWidth: '28rem',
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            border: '1.5px solid #E5E0D8',
            boxShadow: '0 8px 40px rgba(26,26,46,0.08)',
            padding: '2rem',
            textAlign: 'center',
          }}
        >
          <h1
            style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: 'var(--navy, #1A1A2E)',
              margin: '0 0 1.5rem 0',
              letterSpacing: '-0.5px',
            }}
          >
            Eventy<span style={{ color: 'var(--gold, #D4A853)' }}>.</span>Life
          </h1>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--terra, #DC2626)', marginBottom: '0.5rem' }}>
            Lien invalide
          </h2>
          <p style={{ color: '#6B7280', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Le lien de réinitialisation est invalide ou a expiré.
          </p>
          <Link
            href="/mot-de-passe-oublie"
            style={{
              display: 'inline-block',
              padding: '0.75rem 1.5rem',
              backgroundColor: 'var(--terra, #C75B39)',
              color: '#FFFFFF',
              borderRadius: '10px',
              textDecoration: 'none',
              fontWeight: '500',
              fontSize: '0.875rem',
              transition: 'all 200ms',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#B84A2F';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#C75B39';
            }}
          >
            Demander un nouveau lien
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setServerError('');

    // Validation Zod
    try {
      resetPasswordSchema.parse({ password, passwordConfirm });
    } catch (err: unknown) {
      if (err instanceof ZodError) {
        setErrors(zodErrorsToRecord(err));
        return;
      }
    }

    setStatus('loading');

    try {
      await apiClient.post('/auth/reset-password', { token, password });
      setStatus('success');
      setTimeout(() => {
        router.push('/connexion');
      }, 3000);
    } catch (error: unknown) {
      setStatus('error');
      setServerError(extractErrorMessage(error, 'Erreur lors de la réinitialisation. Veuillez réessayer.'));
    }
  };

  if (status === 'success') {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: 'var(--cream, #FAF7F2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
        }}
      >
        <div
          className="animate-fade-up"
          style={{
            width: '100%',
            maxWidth: '28rem',
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            border: '1.5px solid #E5E0D8',
            boxShadow: '0 8px 40px rgba(26,26,46,0.08)',
            padding: '2rem',
            textAlign: 'center',
          }}
        >
          <h1
            style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: 'var(--navy, #1A1A2E)',
              margin: '0 0 1.5rem 0',
              letterSpacing: '-0.5px',
            }}
          >
            Eventy<span style={{ color: 'var(--gold, #D4A853)' }}>.</span>Life
          </h1>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✓</div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--navy, #1A1A2E)', marginBottom: '0.5rem' }}>
            Mot de passe modifié !
          </h2>
          <p style={{ color: '#6B7280', fontSize: '0.875rem', marginBottom: '1rem' }}>
            Votre mot de passe a été réinitialisé avec succès.
          </p>
          <p style={{ color: '#9CA3AF', fontSize: '0.875rem', marginBottom: '1rem' }}>
            Redirection vers la connexion...
          </p>
          <Link
            href="/connexion"
            style={{
              color: 'var(--terra, #C75B39)',
              fontSize: '0.875rem',
              textDecoration: 'none',
              fontWeight: '500',
              transition: 'color 200ms',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#B84A2F';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#C75B39';
            }}
          >
            Cliquez ici si vous n'êtes pas redirigé
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--cream, #FAF7F2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        className="animate-fade-up"
        style={{
          width: '100%',
          maxWidth: '28rem',
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          border: '1.5px solid #E5E0D8',
          boxShadow: '0 8px 40px rgba(26,26,46,0.08)',
          padding: '2rem',
        }}
      >
        {/* Logo & Title */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h1
            style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: 'var(--navy, #1A1A2E)',
              margin: '0 0 0.5rem 0',
              letterSpacing: '-0.5px',
            }}
          >
            Nouveau mot de passe
          </h1>
          <p style={{ color: '#6B7280', fontSize: '0.875rem', margin: 0 }}>
            Choisissez un nouveau mot de passe sécurisé
          </p>
        </div>

        {/* Erreur serveur */}
        {serverError && (
          <div
            role="alert"
            style={{
              marginBottom: '1rem',
              padding: '0.75rem',
              backgroundColor: 'var(--terra-soft, #FEF2F2)',
              border: '1.5px solid #FECACA',
              borderRadius: '10px',
            }}
          >
            <p style={{ fontSize: '0.875rem', color: 'var(--terra, #DC2626)', margin: 0 }}>
              {serverError}
            </p>
          </div>
        )}

        <form aria-label="Nouveau mot de passe" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} noValidate>
          {/* Nouveau mot de passe */}
          <div>
            <label htmlFor="password" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: 'var(--navy, #1A1A2E)', marginBottom: '0.25rem' }}>
              Nouveau mot de passe
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword((e.target as HTMLInputElement).value)}
                placeholder="Min. 8 caractères"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  paddingRight: '2.5rem',
                  backgroundColor: '#FFFFFF',
                  border: `1.5px solid ${errors.password ? 'var(--terra, #DC2626)' : '#E5E0D8'}`,
                  borderRadius: '10px',
                  fontSize: '0.875rem',
                  outline: 'none',
                  transition: 'all 200ms',
                  boxSizing: 'border-box',
                  color: 'var(--navy, #1A1A2E)',
                }}
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'reset-password-error' : undefined}
                onFocus={(e) => {
                  if (!errors.password) {
                    e.currentTarget.style.borderColor = '#C75B39';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(199, 91, 57, 0.1)';
                  }
                }}
                onBlur={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9CA3AF',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none',
                  padding: '0.25rem',
                  transition: 'color 200ms',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#6B7280';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#9CA3AF';
                }}
              >
                {showPassword ? 'Masquer' : 'Afficher'}
              </button>
            </div>
            {errors.password && (
              <p id="reset-password-error" style={{ color: 'var(--terra, #DC2626)', fontSize: '0.75rem', margin: '0.25rem 0 0 0' }}>
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirmation */}
          <div>
            <label htmlFor="passwordConfirm" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: 'var(--navy, #1A1A2E)', marginBottom: '0.25rem' }}>
              Confirmer le mot de passe
            </label>
            <input
              id="passwordConfirm"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm((e.target as HTMLInputElement).value)}
              placeholder="Retapez votre mot de passe"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                backgroundColor: '#FFFFFF',
                border: `1.5px solid ${errors.passwordConfirm ? 'var(--terra, #DC2626)' : '#E5E0D8'}`,
                borderRadius: '10px',
                fontSize: '0.875rem',
                outline: 'none',
                transition: 'all 200ms',
                boxSizing: 'border-box',
                color: 'var(--navy, #1A1A2E)',
              }}
              aria-invalid={!!errors.passwordConfirm}
              aria-describedby={errors.passwordConfirm ? 'reset-confirm-error' : undefined}
              onFocus={(e) => {
                if (!errors.passwordConfirm) {
                  e.currentTarget.style.borderColor = '#C75B39';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(199, 91, 57, 0.1)';
                }
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
            {errors.passwordConfirm && (
              <p id="reset-confirm-error" style={{ color: 'var(--terra, #DC2626)', fontSize: '0.75rem', margin: '0.25rem 0 0 0' }}>
                {errors.passwordConfirm}
              </p>
            )}
          </div>

          {/* Bouton */}
          <button
            type="submit"
            disabled={status === 'loading'}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              backgroundColor: status === 'loading' ? '#D97B5E' : '#C75B39',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '10px',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: status === 'loading' ? 'not-allowed' : 'pointer',
              transition: 'all 200ms',
              opacity: status === 'loading' ? 0.7 : 1,
            }}
            onMouseEnter={(e) => {
              if (status !== 'loading') {
                e.currentTarget.style.backgroundColor = '#B84A2F';
              }
            }}
            onMouseLeave={(e) => {
              if (status !== 'loading') {
                e.currentTarget.style.backgroundColor = '#C75B39';
              }
            }}
          >
            {status === 'loading' ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#6B7280', marginTop: '1.5rem', margin: '1.5rem 0 0 0' }}>
          <Link
            href="/connexion"
            style={{
              color: 'var(--terra, #C75B39)',
              textDecoration: 'none',
              fontWeight: '500',
              transition: 'color 200ms',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#B84A2F';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#C75B39';
            }}
          >
            Retour à la connexion
          </Link>
        </p>
      </div>
    </div>
  );
}
