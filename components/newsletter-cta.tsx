'use client';

import { useState } from 'react';
import { useToast } from '@/lib/stores/ui-store';

/**
 * NewsletterCTA — Bloc d'inscription newsletter réutilisable.
 *
 * Deux variantes :
 * - "terra" : fond gradient terra→terraLight (blog, pages intérieures)
 * - "navy"  : fond navy avec input semi-transparent (accueil, footer)
 *
 * Design Sun/Ocean V4.
 */

interface NewsletterCTAProps {
  /** Variante visuelle */
  variant?: 'terra' | 'navy';
  /** Surtitre (optionnel, affiché uniquement en variante navy) */
  subtitle?: string;
  /** Titre principal */
  title?: string;
  /** Description sous le titre */
  description?: string;
  /** Classe CSS additionnelle pour le wrapper */
  className?: string;
}

export function NewsletterCTA({
  variant = 'terra',
  subtitle,
  title,
  description,
  className = '',
}: NewsletterCTAProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;

    setIsSubmitting(true);
    try {
      // TODO: brancher API newsletter (Brevo/Resend)
      // Simule un appel réseau
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success('Inscription confirmée ! Vérifiez votre boîte mail.');
      setEmail('');
    } catch {
      toast.error('Une erreur est survenue. Réessayez plus tard.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const defaults = {
    terra: {
      title: 'Ne manquez aucune inspiration',
      description:
        'Inscrivez-vous à notre newsletter et recevez nos meilleurs conseils voyage et offres exclusives.',
    },
    navy: {
      title: 'Recevez nos dernières offres',
      description:
        'Inscrivez-vous pour découvrir nos meilleures destinations avant tout le monde.',
    },
  };

  const resolvedTitle = title || defaults[variant].title;
  const resolvedDesc = description || defaults[variant].description;

  if (variant === 'navy') {
    return (
      <div
        className={`text-center ${className}`}
        style={{
          background: 'var(--navy, #1A1A2E)',
          borderRadius: '24px',
          padding: '3rem 2rem',
        }}
      >
        <div className="max-w-2xl mx-auto">
          {(subtitle ?? 'Newsletter') && (
            <span
              className="text-sm font-semibold uppercase tracking-widest"
              style={{ color: 'var(--gold, #D4A853)' }}
            >
              {subtitle ?? 'Newsletter'}
            </span>
          )}
          <h2
            className="text-2xl sm:text-3xl mt-3 mb-4"
            style={{
              fontWeight: '700',
              fontFamily: 'var(--font-playfair, Playfair Display, serif)',
              color: '#FAF7F2',
            }}
          >
            {resolvedTitle}
          </h2>
          <p
            className="mb-8 text-sm"
            style={{ color: 'rgba(250,247,242,0.6)' }}
          >
            {resolvedDesc}
          </p>

          <form aria-label="Inscription newsletter"
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre email"
              required
              autoComplete="email"
              aria-label="Adresse email pour la newsletter"
              className="flex-1 px-5 py-3.5 rounded-xl text-sm focus:outline-none transition-shadow"
              style={{
                background: 'rgba(250,247,242,0.08)',
                color: '#FAF7F2',
                border: '1.5px solid rgba(250,247,242,0.15)',
              }}
              onFocus={(e) =>
                (e.currentTarget.style.borderColor = 'var(--terra, #C75B39)')
              }
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = 'rgba(250,247,242,0.15)')
              }
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200"
              style={{
                background: 'var(--terra, #C75B39)',
                color: '#fff',
                border: 'none',
                cursor: isSubmitting ? 'wait' : 'pointer',
                opacity: isSubmitting ? 0.7 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.background = 'var(--terra-light, #D97B5E)';
                  e.currentTarget.style.boxShadow =
                    '0 6px 24px rgba(199,91,57,0.25)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--terra, #C75B39)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {isSubmitting ? 'Envoi…' : "S'inscrire"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Variante terra (défaut)
  return (
    <div
      className={`text-center ${className}`}
      style={{
        background: 'linear-gradient(135deg, #C75B39, #D97B5E)',
        borderRadius: '24px',
        padding: '3rem 2rem',
        color: 'white',
      }}
    >
      <h2
        className="text-2xl sm:text-3xl mb-3"
        style={{
          fontWeight: '700',
          fontFamily: 'var(--font-playfair, Playfair Display, serif)',
        }}
      >
        {resolvedTitle}
      </h2>
      <p
        className="mx-auto mb-6"
        style={{
          color: 'rgba(255,255,255,0.9)',
          maxWidth: '42rem',
        }}
      >
        {resolvedDesc}
      </p>
      <form aria-label="Inscription newsletter"
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Votre email..."
          required
          autoComplete="email"
          aria-label="Adresse email pour la newsletter"
          className="flex-1 px-4 py-3 rounded-xl text-sm"
          style={{
            color: 'var(--navy, #1A1A2E)',
            border: 'none',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 rounded-xl font-bold text-sm transition-opacity hover:opacity-90"
          style={{
            backgroundColor: 'var(--navy, #1A1A2E)',
            color: 'white',
            border: 'none',
            cursor: isSubmitting ? 'wait' : 'pointer',
            opacity: isSubmitting ? 0.7 : 1,
          }}
        >
          {isSubmitting ? 'Envoi…' : "S'inscrire"}
        </button>
      </form>
    </div>
  );
}
