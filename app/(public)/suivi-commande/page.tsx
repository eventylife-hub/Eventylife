'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ZodError } from 'zod';
import { Breadcrumb } from '@/components/seo/breadcrumb';
import { orderTrackingSchema } from '@/lib/validations/client';
import { zodErrorsToRecord } from '@/lib/validations/auth';
import { FormFieldError } from '@/components/ui/form-field-error';

export default function SuiviCommandePage() {
  const [orderRef, setOrderRef] = useState('');
  const [email, setEmail] = useState('');
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setErrors({});

    try {
      orderTrackingSchema.parse({ orderRef, email });
    } catch (err) {
      if (err instanceof ZodError) {
        setErrors(zodErrorsToRecord(err));
        return;
      }
    }

    setSearched(true);
  };

  return (
    <div style={{ backgroundColor: 'var(--cream, #FAF7F2)', minHeight: '100vh' }}>
      {/* Hero */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1A1A2E 0%, #2d2d4e 100%)',
          color: 'white',
          padding: '5rem 1rem 4rem',
        }}
      >
        <div className="mx-auto max-w-3xl text-center">
          <p
            className="mb-4"
            style={{
              color: 'var(--gold, #D4A853)',
              fontSize: '0.75rem',
              fontWeight: '700',
              letterSpacing: '3px',
              textTransform: 'uppercase',
            }}
          >
            Suivi
          </p>
          <h1
            className="text-3xl sm:text-5xl mb-4"
            style={{
              fontWeight: '700',
              fontFamily: 'var(--font-playfair, Playfair Display, serif)',
            }}
          >
            Suivi de <span style={{ color: 'var(--terra, #C75B39)' }}>commande</span>
          </h1>
          <p
            style={{
              fontSize: '1.125rem',
              color: 'rgba(255,255,255,0.75)',
            }}
          >
            Retrouvez le statut de votre réservation en quelques clics.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-xl px-4 py-12">
        <Breadcrumb
          items={[
            { name: 'Accueil', href: '/' },
            { name: 'Suivi de commande', href: '/suivi-commande' },
          ]}
        />

        {/* Formulaire de recherche */}
        <div
          className="mt-8 rounded-2xl"
          style={{
            backgroundColor: 'white',
            border: '1px solid rgba(26,26,46,0.08)',
            boxShadow: '0 2px 8px rgba(26,26,46,0.04)',
            padding: '2rem',
          }}
        >
          <form role="search" aria-label="Rechercher une réservation" onSubmit={handleSearch} className="space-y-5" noValidate>
            <div>
              <label
                htmlFor="orderRef"
                className="block text-sm font-bold mb-1.5"
                style={{ color: 'var(--navy, #1A1A2E)' }}
              >
                Référence de réservation
              </label>
              <input
                id="orderRef"
                type="text"
                value={orderRef}
                onChange={(e) => setOrderRef(e.target.value)}
                placeholder="Ex : EVT-2026-XXXXX"
                required
                className="w-full text-sm"
                aria-invalid={!!errors.orderRef}
                aria-describedby={errors.orderRef ? 'orderRef-error' : undefined}
                style={{
                  border: `1.5px solid ${errors.orderRef ? '#DC2626' : '#E5E0D8'}`,
                  borderRadius: '12px',
                  padding: '12px 16px',
                  outline: 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
                onFocus={(e) => {
                  if (!errors.orderRef) e.currentTarget.style.borderColor = 'var(--terra, #C75B39)';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(199,91,57,0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = errors.orderRef ? '#DC2626' : '#E5E0D8';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
              <FormFieldError error={errors.orderRef} id="orderRef-error" />
            </div>
            <div>
              <label
                htmlFor="suivi-email"
                className="block text-sm font-bold mb-1.5"
                style={{ color: 'var(--navy, #1A1A2E)' }}
              >
                Email utilisé lors de la réservation
              </label>
              <input
                id="suivi-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
                className="w-full text-sm"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'suivi-email-error' : undefined}
                style={{
                  border: `1.5px solid ${errors.email ? '#DC2626' : '#E5E0D8'}`,
                  borderRadius: '12px',
                  padding: '12px 16px',
                  outline: 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
                onFocus={(e) => {
                  if (!errors.email) e.currentTarget.style.borderColor = 'var(--terra, #C75B39)';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(199,91,57,0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = errors.email ? '#DC2626' : '#E5E0D8';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
              <FormFieldError error={errors.email} id="suivi-email-error" />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-sm transition-all duration-200"
              style={{
                backgroundColor: 'var(--terra, #C75B39)',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(199,91,57,0.25)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Rechercher ma réservation
            </button>
          </form>

          {searched && (
            <div
              className="mt-8 p-5 rounded-xl"
              style={{
                backgroundColor: 'var(--terra-soft, rgba(199,91,57,0.04))',
                border: '1.5px solid var(--terra, #C75B39)',
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🔍</span>
                <h3 className="font-bold" style={{ color: 'var(--navy, #1A1A2E)' }}>
                  Aucune réservation trouvée
                </h3>
              </div>
              <p className="text-sm mb-4" style={{ color: '#6B7280' }}>
                Vérifiez votre référence et votre email, ou connectez-vous à votre
                espace client pour voir toutes vos réservations.
              </p>
              <Link
                href="/connexion"
                className="text-sm font-bold transition-colors"
                style={{
                  color: 'var(--terra, #C75B39)',
                  textDecoration: 'none',
                }}
              >
                Se connecter →
              </Link>
            </div>
          )}
        </div>

        {/* Info box */}
        <div
          className="mt-6 rounded-2xl"
          style={{
            backgroundColor: 'white',
            border: '1px solid rgba(26,26,46,0.08)',
            boxShadow: '0 2px 8px rgba(26,26,46,0.04)',
            padding: '1.5rem',
          }}
        >
          <h3
            className="font-bold mb-4"
            style={{ color: 'var(--navy, #1A1A2E)' }}
          >
            Besoin d&apos;aide ?
          </h3>
          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                style={{ background: 'rgba(199,91,57,0.06)' }}
              >
                📧
              </div>
              <div>
                <p className="font-bold" style={{ color: 'var(--navy, #1A1A2E)' }}>
                  Par email
                </p>
                <p style={{ color: '#6B7280' }}>
                  contact@eventylife.fr — Réponse sous 24h
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                style={{ background: 'rgba(199,91,57,0.06)' }}
              >
                📱
              </div>
              <div>
                <p className="font-bold" style={{ color: 'var(--navy, #1A1A2E)' }}>
                  Par téléphone
                </p>
                <p style={{ color: '#6B7280' }}>
                  +33 (0)1 23 45 67 89 — Lun-Ven 9h-18h
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                style={{ background: 'rgba(199,91,57,0.06)' }}
              >
                👤
              </div>
              <div>
                <p className="font-bold" style={{ color: 'var(--navy, #1A1A2E)' }}>
                  Espace client
                </p>
                <Link
                  href="/connexion"
                  className="transition-colors"
                  style={{
                    color: 'var(--terra, #C75B39)',
                    textDecoration: 'none',
                  }}
                >
                  Connectez-vous pour voir toutes vos réservations
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
