'use client';

/**
 * Page Pro Publique — page publique d'un pro
 * Accessible via QR code ou lien partagé
 */


import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/lib/stores/ui-store';
import { formatPrice, formatDate } from '@/lib/utils';
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

  // Attribution tracking pour commission
  useEffect(() => {
    if (proSlug) {
      document.cookie = `LAST_TOUCH=${proSlug}; max-age=2592000; path=/`;
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

        const data = (await res.json() as unknown) as unknown;
        setPro(data);
        setState(data.travels?.length > 0 ? 'data' : 'empty');
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Erreur');
        setState('error');
      }
    };

    if (proSlug) loadPro();
  }, [proSlug]);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rgpdConsent) {
      toast.warning('Veuillez accepter les conditions RGPD');
      return;
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
          <Skeleton className="h-64 w-full rounded-lg" />
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
      </div>
    );
  }

  if (state === 'error' || state === 'empty') {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 text-center">
        <p style={{ color: '#6B7280' }}>Ce pro n&apos;existe pas ou n&apos;a pas de voyages disponibles.</p>
        <Link href="/voyages">
          <Button variant="primary">Voir tous les voyages</Button>
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
              <button
                style={{ backgroundColor: 'var(--terra, #C75B39)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '12px', fontWeight: '700', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease' }}
                onClick={() => document.getElementById('voyages')?.scrollIntoView({ behavior: 'smooth' })}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#D97B5E'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--terra, #C75B39)'; }}
              >
                Voir les voyages
              </button>
              {pro.whatsappNumber && (
                <a href={`https://wa.me/${pro.whatsappNumber}`} target="_blank" rel="noopener noreferrer">
                  <button style={{ backgroundColor: 'white', color: 'var(--navy, #1A1A2E)', padding: '0.75rem 1.5rem', borderRadius: '12px', fontWeight: '700', border: '1.5px solid #E5E0D8', cursor: 'pointer', transition: 'all 0.3s ease' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--terra, #C75B39)'; e.currentTarget.style.color = 'var(--terra, #C75B39)'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E5E0D8'; e.currentTarget.style.color = 'var(--navy, #1A1A2E)'; }}>
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
              <CardContent className="p-6 flex flex-col h-full">
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
                    <button style={{ width: '100%', backgroundColor: 'var(--terra, #C75B39)', color: 'white', padding: '0.5rem 0.75rem', borderRadius: '8px', fontSize: '0.875rem', fontWeight: '700', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#D97B5E'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--terra, #C75B39)'; }}>
                      Réserver
                    </button>
                  </Link>
                </div>
              </CardContent>
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
              <Input
                placeholder="Votre nom"
                value={leadForm.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLeadForm({ ...leadForm, name: (e.target as HTMLInputElement).value })}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '700', color: 'var(--navy, #1A1A2E)', marginBottom: '0.25rem' }}>Téléphone</label>
              <Input
                type="tel"
                placeholder="06 12 34 56 78"
                value={leadForm.phone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLeadForm({ ...leadForm, phone: (e.target as HTMLInputElement).value })}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '700', color: 'var(--navy, #1A1A2E)', marginBottom: '0.25rem' }}>Email</label>
              <Input
                type="email"
                autoComplete="email"
                placeholder="votre@email.com"
                value={leadForm.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLeadForm({ ...leadForm, email: (e.target as HTMLInputElement).value })}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '700', color: 'var(--navy, #1A1A2E)', marginBottom: '0.25rem' }}>Message</label>
              <textarea
                style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1.5px solid #E5E0D8', outline: 'none', transition: 'all 0.3s ease', fontFamily: 'inherit' }}
                placeholder="Votre message..."
                rows={4}
                value={leadForm.message}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLeadForm({ ...leadForm, message: (e.target as HTMLInputElement).value })}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--terra, #C75B39)'; e.currentTarget.style.boxShadow = `0 0 0 2px rgba(199, 91, 57, 0.1)`; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = '#E5E0D8'; e.currentTarget.style.boxShadow = 'none'; }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                id="rgpd"
                checked={rgpdConsent}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRgpdConsent((e.target as HTMLInputElement).checked)}
                style={{ width: '1rem', height: '1rem', borderRadius: '4px', border: '1.5px solid #E5E0D8', cursor: 'pointer' }}
              />
              <label htmlFor="rgpd" style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                J&apos;accepte que mes données soient utilisées pour me recontacter
              </label>
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
                <Input
                  type="email"
                autoComplete="email"
                  placeholder="votre@email.com"
                  value={followEmail}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFollowEmail((e.target as HTMLInputElement).value)}
                  required
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
                <button style={{ backgroundColor: 'white', color: 'var(--navy, #1A1A2E)', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.875rem', fontWeight: '700', border: '1.5px solid #E5E0D8', cursor: 'pointer', transition: 'all 0.3s ease' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--terra, #C75B39)'; e.currentTarget.style.color = 'var(--terra, #C75B39)'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E5E0D8'; e.currentTarget.style.color = 'var(--navy, #1A1A2E)'; }}>
                  Facebook
                </button>
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button style={{ backgroundColor: 'white', color: 'var(--navy, #1A1A2E)', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.875rem', fontWeight: '700', border: '1.5px solid #E5E0D8', cursor: 'pointer', transition: 'all 0.3s ease' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--terra, #C75B39)'; e.currentTarget.style.color = 'var(--terra, #C75B39)'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E5E0D8'; e.currentTarget.style.color = 'var(--navy, #1A1A2E)'; }}>
                  Twitter
                </button>
              </a>
              <button
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
