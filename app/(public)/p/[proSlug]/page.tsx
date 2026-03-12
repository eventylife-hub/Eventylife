'use client';

/**
 * Page Pro Publique — page publique d'un pro
 * Accessible via QR code ou lien partagé
 */


import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ZodError } from 'zod';
import { useToast } from '@/lib/stores/ui-store';
import { formatPrice, formatDate } from '@/lib/utils';
import { logger } from '@/lib/logger';
import { leadFormSchema } from '@/lib/validations/client';
import { zodErrorsToRecord } from '@/lib/validations/auth';
import { FormFieldError } from '@/components/ui/form-field-error';
interface Travel {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  price: number;
  pickupPoint: string;
}

interface Pro {
  slug: string;
  name: string;
  photo?: string;
  departureZone: string;
  description: string;
  videoUrl?: string;
  whatsappNumber?: string;
  phone?: string;
  travels: Travel[];
}

type LoadState = 'loading' | 'empty' | 'error' | 'data';

export default function ProPublicPage() {
  const params = useParams();
  const proSlug = params.proSlug as string;
  const toast = useToast();

  const [state, setState] = useState<LoadState>('loading');
  const [pro, setPro] = useState<Pro | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [leadForm, setLeadForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [followEmail, setFollowEmail] = useState('');
  const [rgpdConsent, setRgpdConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Attribution tracking pour commission
  // SECURITY: Encode proSlug to prevent cookie injection attacks
  useEffect(() => {
    if (proSlug) {
      const encodedSlug = encodeURIComponent(proSlug);
      // Validate slug format (alphanumeric, hyphens only)
      if (/^[a-zA-Z0-9\-]+$/.test(proSlug)) {
        document.cookie = `LAST_TOUCH=${encodedSlug}; max-age=2592000; path=/; SameSite=Lax`;
      }
    }
  }, [proSlug]);

  // Charger les données du pro
  useEffect(() => {
    const loadPro = async () => {
      try {
        setState('loading');
        const res = await fetch(`/api/public/pros/${proSlug}`);

        if (!res.ok) {
          setState('empty');
          return;
        }

        const data = await res.json() as Pro;
        setPro(data);
        setState(data.travels?.length > 0 ? 'data' : 'empty');
      } catch (err: unknown) {
        logger.warn('API pro indisponible — données démo');
        // Fallback demo data
        const fallbackPro: Pro = {
          slug: proSlug,
          name: 'Découverte Méditerranée SARL',
          photo: '🎯',
          departureZone: 'Région Lyon-Rhône-Alpes',
          description: 'Spécialiste des voyages en groupe vers la Méditerranée depuis 15 ans. Nous proposons des séjours clé en main avec accompagnement professionnel et accueil chaleureux.',
          whatsappNumber: '+33612345678',
          phone: '+33472123456',
          travels: [
            {
              id: 'v1',
              title: 'Barcelone & Costa Brava',
              destination: 'Catalogne, Espagne',
              startDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
              endDate: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000).toISOString(),
              price: 79900, // 799 EUR
              pickupPoint: 'Lyon Presqu\'île, Gare SNCF',
            },
            {
              id: 'v2',
              title: 'Îles de Croatie',
              destination: 'Dalmatie, Croatie',
              startDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
              endDate: new Date(Date.now() + 69 * 24 * 60 * 60 * 1000).toISOString(),
              price: 94900, // 949 EUR
              pickupPoint: 'Lyon Presqu\'île, Gare SNCF',
            },
            {
              id: 'v3',
              title: 'Amalfi & Capri',
              destination: 'Côte Amalfitaine, Italie',
              startDate: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000).toISOString(),
              endDate: new Date(Date.now() + 82 * 24 * 60 * 60 * 1000).toISOString(),
              price: 89900, // 899 EUR
              pickupPoint: 'Lyon Presqu\'île, Gare SNCF',
            },
          ],
        };
        setPro(fallbackPro);
        setState(fallbackPro.travels?.length > 0 ? 'data' : 'empty');
        setError(null);
      }
    };

    if (proSlug) loadPro();
  }, [proSlug]);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      leadFormSchema.parse({ ...leadForm, consent: rgpdConsent });
    } catch (err) {
      if (err instanceof ZodError) {
        setErrors(zodErrorsToRecord(err));
        return;
      }
    }

    try {
      const res = await fetch('/api/public/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proSlug, ...leadForm }),
      });

      if (res.ok) {
        setLeadForm({ name: '', phone: '', email: '', message: '' });
        toast.success('Merci ! Nous vous recontacterons bientôt.');
      }
    } catch {
      // Erreur silencieuse — formulaire de contact échoué
    }
  };

  const handleFollowEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`/api/public/pros/${proSlug}/follow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: followEmail }),
      });
      setFollowEmail('');
      toast.success('Vous suivrez les voyages de ce pro !');
    } catch {
      // Erreur silencieuse — suivi email échoué
    }
  };

  if (state === 'loading') {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-8">
        <div className="space-y-4">
          <div style={{ height: '16rem', width: '100%', borderRadius: '12px', background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
          <div style={{ height: '2rem', width: '16rem', borderRadius: '8px', background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
          <div style={{ height: '1rem', width: '24rem', borderRadius: '8px', background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
        </div>
        <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
      </div>
    );
  }

  if (state === 'error' || state === 'empty') {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 text-center">
        <p style={{ color: '#6B7280', marginBottom: '1.5rem' }}>Ce pro n&apos;existe pas ou n&apos;a pas de voyages disponibles.</p>
        <Link
          href="/voyages"
          style={{ display: 'inline-block', backgroundColor: 'var(--terra, #C75B39)', color: 'white', padding: '0.75rem 2rem', borderRadius: '12px', fontWeight: '700', textDecoration: 'none', transition: 'all 0.3s ease' }}
        >
          Voir tous les voyages
        </Link>
      </div>
    );
  }

  if (!pro) return null;

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-16">
      {/* Hero Section */}
      <section style={{ background: `linear-gradient(135deg, ${'rgba(199,91,57,0.1)'}, ${'#FDF6E8'})`, borderRadius: '20px', padding: '2rem' }} className="md:p-12 animate-fade-up">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div style={{ width: '8rem', height: '8rem', backgroundColor: '#E5E0D8', borderRadius: '9999px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.75rem' }}>
              {pro.photo || '👤'}
            </div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: '700', color: 'var(--navy, #1A1A2E)', marginBottom: '0.5rem', fontFamily: 'Playfair, serif' }}>{pro.name}</h1>
            <p style={{ fontSize: '1.125rem', color: 'var(--terra, #C75B39)', fontWeight: '700', marginBottom: '1rem' }}>
              📍 {pro.departureZone}
            </p>
            <p style={{ color: 'var(--navy, #1A1A2E)', marginBottom: '1.5rem', lineHeight: '1.75' }}>{pro.description}</p>

            <div className="flex gap-3">
              <button type="button"
                style={{ backgroundColor: 'var(--terra, #C75B39)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '12px', fontWeight: '700', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease' }}
                onClick={() => document.getElementById('voyages')?.scrollIntoView({ behavior: 'smooth' })}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#D97B5E'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--terra, #C75B39)'; }}
              >
                Voir les voyages
              </button>
              {pro.whatsappNumber && (
                <a href={`https://wa.me/${pro.whatsappNumber}`} target="_blank" rel="noopener noreferrer">
                  <button type="button" style={{ backgroundColor: 'white', color: 'var(--navy, #1A1A2E)', padding: '0.75rem 1.5rem', borderRadius: '12px', fontWeight: '700', border: '1.5px solid #E5E0D8', cursor: 'pointer', transition: 'all 0.3s ease' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--terra, #C75B39)'; e.currentTarget.style.color = 'var(--terra, #C75B39)'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E5E0D8'; e.currentTarget.style.color = 'var(--navy, #1A1A2E)'; }}>
                    WhatsApp
                  </button>
                </a>
              )}
            </div>
          </div>

          {/* Video Embed */}
          {pro.videoUrl && (
            <div style={{ aspectRatio: '16/9', backgroundColor: 'var(--navy, #1A1A2E)', borderRadius: '12px', overflow: 'hidden' }}>
              <iframe
                width="100%"
                height="100%"
                src={pro.videoUrl.replace('youtube.com', 'youtube-nocookie.com')}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          )}
        </div>
      </section>

      {/* Voyages Section */}
      <section id="voyages" className="space-y-6 animate-fade-up">
        <h2 style={{ fontSize: '1.875rem', fontWeight: '700', color: 'var(--navy, #1A1A2E)', fontFamily: 'Playfair, serif' }}>Voyages au départ de {pro.departureZone}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pro.travels.map((voyage) => (
            <div key={voyage.id} style={{ backgroundColor: 'white', border: '1.5px solid #E5E0D8', borderRadius: '20px', overflow: 'hidden', transition: 'all 0.3s ease', cursor: 'pointer' }} onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-4px)'; }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', backgroundColor: '#FDF6E8', color: 'var(--navy, #1A1A2E)', padding: '0.25rem 0.75rem', borderRadius: '9999px', width: 'fit-content', marginBottom: '0.75rem' }}>
                  {formatDate(voyage.startDate)}
                </span>

                <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--navy, #1A1A2E)', marginBottom: '0.5rem' }}>{voyage.title}</h3>

                <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.25rem' }}>
                  📍 {voyage.destination}
                </p>

                <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '1rem' }}>
                  🚌 Départ: {voyage.pickupPoint}
                </p>

                <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1.5px solid #E5E0D8' }}>
                  <p style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--terra, #C75B39)', marginBottom: '1rem' }}>
                    À partir de {formatPrice(voyage.price)}
                  </p>
                  <Link href={`/voyages/${voyage.id}`}>
                    <button type="button" style={{ width: '100%', backgroundColor: 'var(--terra, #C75B39)', color: 'white', padding: '0.5rem 0.75rem', borderRadius: '8px', fontSize: '0.875rem', fontWeight: '700', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#D97B5E'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--terra, #C75B39)'; }}>
                      Réserver
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section style={{ backgroundColor: 'white', border: '1.5px solid #E5E0D8', borderRadius: '20px', padding: '2rem' }} className="md:p-12 space-y-8 animate-fade-up">
        <div>
          <h2 style={{ fontSize: '1.875rem', fontWeight: '700', color: 'var(--navy, #1A1A2E)', marginBottom: '0.5rem', fontFamily: 'Playfair, serif' }}>Nous contacter</h2>
          <p style={{ color: '#6B7280' }}>Vous avez des questions ? Nous sommes là pour vous aider.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Form */}
          <form role="search" onSubmit={handleLeadSubmit} className="space-y-4">
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '700', color: 'var(--navy, #1A1A2E)', marginBottom: '0.25rem' }}>Nom</label>
              <input
                placeholder="Votre nom"
                value={leadForm.name}
                onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                required
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'lead-name-error' : undefined}
                style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: `1.5px solid ${errors.name ? '#DC2626' : '#E5E0D8'}`, outline: 'none', transition: 'all 0.3s ease', fontFamily: 'inherit' }}
                onFocus={(e) => { if (!errors.name) e.currentTarget.style.borderColor = 'var(--terra, #C75B39)'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(199, 91, 57, 0.1)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = errors.name ? '#DC2626' : '#E5E0D8'; e.currentTarget.style.boxShadow = 'none'; }}
              />
              <FormFieldError error={errors.name} id="lead-name-error" />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '700', color: 'var(--navy, #1A1A2E)', marginBottom: '0.25rem' }}>Téléphone</label>
              <input
                type="tel"
                placeholder="06 12 34 56 78"
                value={leadForm.phone}
                onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                required
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? 'lead-phone-error' : undefined}
                style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: `1.5px solid ${errors.phone ? '#DC2626' : '#E5E0D8'}`, outline: 'none', transition: 'all 0.3s ease', fontFamily: 'inherit' }}
                onFocus={(e) => { if (!errors.phone) e.currentTarget.style.borderColor = 'var(--terra, #C75B39)'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(199, 91, 57, 0.1)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = errors.phone ? '#DC2626' : '#E5E0D8'; e.currentTarget.style.boxShadow = 'none'; }}
              />
              <FormFieldError error={errors.phone} id="lead-phone-error" />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '700', color: 'var(--navy, #1A1A2E)', marginBottom: '0.25rem' }}>Email</label>
              <input
                type="email"
                autoComplete="email"
                placeholder="votre@email.com"
                value={leadForm.email}
                onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                required
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'lead-email-error' : undefined}
                style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: `1.5px solid ${errors.email ? '#DC2626' : '#E5E0D8'}`, outline: 'none', transition: 'all 0.3s ease', fontFamily: 'inherit' }}
                onFocus={(e) => { if (!errors.email) e.currentTarget.style.borderColor = 'var(--terra, #C75B39)'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(199, 91, 57, 0.1)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = errors.email ? '#DC2626' : '#E5E0D8'; e.currentTarget.style.boxShadow = 'none'; }}
              />
              <FormFieldError error={errors.email} id="lead-email-error" />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '700', color: 'var(--navy, #1A1A2E)', marginBottom: '0.25rem' }}>Message</label>
              <textarea
                style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: `1.5px solid ${errors.message ? '#DC2626' : '#E5E0D8'}`, outline: 'none', transition: 'all 0.3s ease', fontFamily: 'inherit' }}
                placeholder="Votre message..."
                rows={4}
                value={leadForm.message}
                onChange={(e) => setLeadForm({ ...leadForm, message: e.target.value })}
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? 'lead-message-error' : undefined}
                onFocus={(e) => { if (!errors.message) e.currentTarget.style.borderColor = 'var(--terra, #C75B39)'; e.currentTarget.style.boxShadow = `0 0 0 2px rgba(199, 91, 57, 0.1)`; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = errors.message ? '#DC2626' : '#E5E0D8'; e.currentTarget.style.boxShadow = 'none'; }}
              />
              <FormFieldError error={errors.message} id="lead-message-error" />
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <input
                type="checkbox"
                id="rgpd"
                checked={rgpdConsent}
                onChange={(e) => setRgpdConsent(e.target.checked)}
                aria-invalid={!!errors.consent}
                aria-describedby={errors.consent ? 'lead-consent-error' : undefined}
                style={{ width: '1rem', height: '1rem', borderRadius: '4px', border: '1.5px solid #E5E0D8', cursor: 'pointer', marginTop: '2px' }}
              />
              <div>
                <label htmlFor="rgpd" style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                  J&apos;accepte que mes données soient utilisées pour me recontacter
                </label>
                <FormFieldError error={errors.consent} id="lead-consent-error" />
              </div>
            </div>

            <button
              type="submit"
              style={{ width: '100%', backgroundColor: 'var(--terra, #C75B39)', color: 'white', padding: '0.75rem 1rem', borderRadius: '12px', fontWeight: '700', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#D97B5E'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--terra, #C75B39)'; }}
            >
              Être rappelé
            </button>
          </form>

          {/* Quick Contact */}
          <div className="space-y-6">
            {pro.phone && (
              <div>
                <h4 style={{ fontWeight: '700', color: 'var(--navy, #1A1A2E)', marginBottom: '0.5rem' }}>Appeler</h4>
                <a href={`tel:${pro.phone}`} style={{ color: 'var(--terra, #C75B39)', textDecoration: 'none', transition: 'all 0.3s ease' }} onMouseEnter={(e) => { e.currentTarget.style.textDecoration = 'underline'; }} onMouseLeave={(e) => { e.currentTarget.style.textDecoration = 'none'; }}>
                  {pro.phone}
                </a>
              </div>
            )}

            {pro.whatsappNumber && (
              <div>
                <h4 style={{ fontWeight: '700', color: 'var(--navy, #1A1A2E)', marginBottom: '0.5rem' }}>WhatsApp</h4>
                <a
                  href={`https://wa.me/${pro.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--terra, #C75B39)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.3s ease' }}
                  onMouseEnter={(e) => { e.currentTarget.style.textDecoration = 'underline'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.textDecoration = 'none'; }}
                >
                  Discuter sur WhatsApp 💬
                </a>
              </div>
            )}

            {/* Follow Email Opt-in */}
            <div style={{ backgroundColor: '#FDF6E8', borderRadius: '12px', padding: '1rem' }}>
              <h4 style={{ fontWeight: '700', color: 'var(--navy, #1A1A2E)', marginBottom: '0.75rem' }}>Suivre les voyages</h4>
              <form role="search" onSubmit={handleFollowEmail} className="space-y-2">
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="votre@email.com"
                  value={followEmail}
                  onChange={(e) => setFollowEmail(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1.5px solid #E5E0D8', outline: 'none', transition: 'all 0.3s ease', fontFamily: 'inherit' }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--terra, #C75B39)'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(199, 91, 57, 0.1)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = '#E5E0D8'; e.currentTarget.style.boxShadow = 'none'; }}
                />
                <button
                  type="submit"
                  style={{ width: '100%', backgroundColor: 'var(--terra, #C75B39)', color: 'white', padding: '0.5rem 0.75rem', borderRadius: '8px', fontSize: '0.875rem', fontWeight: '700', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#D97B5E'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--terra, #C75B39)'; }}
                >
                  S&apos;abonner
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Share Section */}
      <section style={{ backgroundColor: '#FDF6E8', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }} className="md:flex-row md:items-center md:justify-between md:gap-4 animate-fade-up">
        <p style={{ fontWeight: '700', color: 'var(--navy, #1A1A2E)' }}>Partager ce profil</p>
        <div className="flex gap-2 flex-wrap">
          {shareUrl && (
            <>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button type="button" style={{ backgroundColor: 'white', color: 'var(--navy, #1A1A2E)', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.875rem', fontWeight: '700', border: '1.5px solid #E5E0D8', cursor: 'pointer', transition: 'all 0.3s ease' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--terra, #C75B39)'; e.currentTarget.style.color = 'var(--terra, #C75B39)'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E5E0D8'; e.currentTarget.style.color = 'var(--navy, #1A1A2E)'; }}>
                  Facebook
                </button>
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button type="button" style={{ backgroundColor: 'white', color: 'var(--navy, #1A1A2E)', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.875rem', fontWeight: '700', border: '1.5px solid #E5E0D8', cursor: 'pointer', transition: 'all 0.3s ease' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--terra, #C75B39)'; e.currentTarget.style.color = 'var(--terra, #C75B39)'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E5E0D8'; e.currentTarget.style.color = 'var(--navy, #1A1A2E)'; }}>
                  Twitter
                </button>
              </a>
              <button type="button"
                style={{ backgroundColor: 'white', color: 'var(--navy, #1A1A2E)', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.875rem', fontWeight: '700', border: '1.5px solid #E5E0D8', cursor: 'pointer', transition: 'all 0.3s ease' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--terra, #C75B39)'; e.currentTarget.style.color = 'var(--terra, #C75B39)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E5E0D8'; e.currentTarget.style.color = 'var(--navy, #1A1A2E)'; }}
                onClick={() => {
                  navigator.clipboard.writeText(shareUrl);
                  toast.success('Lien copié !');
                }}
              >
                Copier le lien
              </button>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
