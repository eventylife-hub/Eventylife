'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
/**
 * Page de vérification d'email
 * Traite le token depuis les params d'URL
 * Affiche succès ou erreur
 * Eventy v2 Design System
 */
export default function VerificationEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Vérification en cours...');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Token de vérification manquant');
      return;
    }

    const verify = async () => {
      try {
        await apiClient.post('/auth/verify-email', { token });
        setStatus('success');
        setMessage('Email vérifié avec succès!');
        // Rediriger après 3 secondes
        setTimeout(() => {
          router.push('/connexion');
        }, 3000);
      } catch (error: unknown) {
        setStatus('error');
        if (error instanceof Error) {
          setMessage(error.message || 'Erreur lors de la vérification');
        } else {
          setMessage('Erreur lors de la vérification');
        }
      }
    };

    verify();
  }, [token, router]);

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#FAF7F2',
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
        {/* Logo */}
        <h1
          style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#1A1A2E',
            margin: '0 0 1.5rem 0',
            letterSpacing: '-0.5px',
          }}
        >
          Eventy<span style={{ color: '#D4A853' }}>.</span>Life
        </h1>

        {/* Contenu selon le statut */}
        {status === 'loading' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div
                style={{
                  width: '3rem',
                  height: '3rem',
                  border: '4px solid #E5E0D8',
                  borderTop: '4px solid #C75B39',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                }}
              />
            </div>
            <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>{message}</p>
          </div>
        )}

        {status === 'success' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ fontSize: '3rem' }}>✓</div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1A1A2E', margin: 0 }}>
              {message}
            </h2>
            <p style={{ color: '#6B7280', fontSize: '0.875rem', margin: 0 }}>
              Redirection vers connexion...
            </p>
            <Link
              href="/connexion"
              style={{
                color: '#C75B39',
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
        )}

        {status === 'error' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ fontSize: '3rem' }}>✗</div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--terra, #DC2626)', margin: 0 }}>
              Erreur
            </h2>
            <p style={{ color: '#6B7280', fontSize: '0.875rem', margin: 0 }}>
              {message}
            </p>
            <Link
              href="/connexion"
              style={{
                display: 'inline-block',
                padding: '0.75rem 1rem',
                backgroundColor: '#C75B39',
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
              Retour à la connexion
            </Link>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
