'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ZodError } from 'zod';
import { apiClient } from '@/lib/api-client';
import { forgotPasswordSchema, zodErrorsToRecord } from '@/lib/validations/auth';
import { extractErrorMessage } from '@/lib/api-error';
/**
 * Page de réinitialisation de mot de passe
 * Demande d'email
 * Message de confirmation
 * Eventy v2 Design System
 */
export default function MotDePasseOubliePage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setErrors({});
    setLoading(true);

    try {
      // Validate with Zod schema
      forgotPasswordSchema.parse({ email });

      await apiClient.post('/auth/forgot-password', { email });
      setSubmitted(true);
      setEmail('');
    } catch (err: unknown) {
      if (err instanceof ZodError) {
        setErrors(zodErrorsToRecord(err));
      } else {
        setError(extractErrorMessage(err, 'Erreur lors de la demande'));
      }
    } finally {
      setLoading(false);
    }
  };

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
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1
            style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: 'var(--navy, #1A1A2E)',
              margin: 0,
              letterSpacing: '-0.5px',
            }}
          >
            Eventy<span style={{ color: 'var(--gold, #D4A853)' }}>.</span>Life
          </h1>
        </div>

        {/* Titre */}
        <h2
          style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: 'var(--navy, #1A1A2E)',
            marginBottom: '0.5rem',
          }}
        >
          Mot de passe oublié
        </h2>
        <p style={{ color: '#6B7280', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          Entrez votre email pour recevoir les instructions de réinitialisation
        </p>

        {/* Message de confirmation */}
        {submitted && (
          <div
            role="status"
            style={{
              marginBottom: '1.5rem',
              padding: '1rem',
              backgroundColor: '#ECFDF5',
              border: '1.5px solid #A7F3D0',
              borderRadius: '10px',
              fontSize: '0.875rem',
            }}
          >
            <p style={{ fontWeight: '500', color: '#047857', margin: '0 0 0.25rem 0' }}>
              Email envoyé !
            </p>
            <p style={{ color: '#059669', margin: '0.5rem 0 0 0' }}>
              Vérifiez votre boîte mail pour les instructions de réinitialisation.
            </p>
          </div>
        )}

        {/* Message d'erreur */}
        {error && (
          <div
            role="alert"
            style={{
              marginBottom: '1rem',
              padding: '0.75rem',
              backgroundColor: 'var(--terra-soft, #FEF2F2)',
              border: '1.5px solid #FECACA',
              borderRadius: '10px',
              color: 'var(--terra, #DC2626)',
              fontSize: '0.875rem',
            }}
          >
            {error}
          </div>
        )}

        {/* Formulaire */}
        {!submitted ? (
          <form aria-label="Réinitialisation mot de passe" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} noValidate>
            <div>
              <label htmlFor="email" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: 'var(--navy, #1A1A2E)', marginBottom: '0.25rem' }}>
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                autoComplete="email"
                onChange={(e) => {
                  setEmail((e.target as HTMLInputElement).value);
                  if (errors.email) setErrors({});
                }}
                required
                placeholder="votre@email.com"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  backgroundColor: '#FFFFFF',
                  border: `1.5px solid ${errors.email ? 'var(--terra, #DC2626)' : '#E5E0D8'}`,
                  borderRadius: '10px',
                  fontSize: '0.875rem',
                  outline: 'none',
                  transition: 'all 200ms',
                  boxSizing: 'border-box',
                  color: 'var(--navy, #1A1A2E)',
                }}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'forgot-email-error' : undefined}
                onFocus={(e) => {
                  if (!errors.email) {
                    e.currentTarget.style.borderColor = '#C75B39';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(199, 91, 57, 0.1)';
                  }
                }}
                onBlur={(e) => {
                  const val = e.target.value;
                  if (!val.trim()) {
                    setErrors({ email: 'L\'email est requis' });
                    e.currentTarget.style.borderColor = 'var(--terra, #DC2626)';
                  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
                    setErrors({ email: 'Format d\'email invalide' });
                    e.currentTarget.style.borderColor = 'var(--terra, #DC2626)';
                  } else {
                    setErrors({});
                    e.currentTarget.style.borderColor = '#E5E0D8';
                  }
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
              {errors.email && (
                <p id="forgot-email-error" style={{ color: 'var(--terra, #DC2626)', fontSize: '0.75rem', marginTop: '0.25rem', margin: '0.25rem 0 0 0' }}>
                  {errors.email}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                backgroundColor: loading ? '#D97B5E' : '#C75B39',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '10px',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 200ms',
                opacity: loading ? 0.7 : 1,
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = '#B84A2F';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = '#C75B39';
                }
              }}
            >
              {loading ? 'Envoi en cours...' : 'Envoyer les instructions'}
            </button>
          </form>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setError(null);
              }}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                backgroundColor: 'var(--terra, #C75B39)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '10px',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 200ms',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#B84A2F';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#C75B39';
              }}
            >
              Envoyer à nouveau
            </button>
          </div>
        )}

        {/* Lien retour */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
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
            Retour à la connexion
          </Link>
        </div>
      </div>
    </div>
  );
}
