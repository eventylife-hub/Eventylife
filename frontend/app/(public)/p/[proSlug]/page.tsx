/**
 * Page Pro Publique — page publique d'un pro
 * Accessible via QR code ou lien partagé
 */

'use client';

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

        const data = await res.json();
        setPro(data);
        setState(data.travels?.length > 0 ? 'data' : 'empty');
      } catch (err) {
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
        <p className="text-gray-600 mb-4">Ce pro n'existe pas ou n'a pas de voyages disponibles.</p>
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
      <section className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-8 md:p-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="w-32 h-32 bg-gray-300 rounded-full mb-6 flex items-center justify-center text-5xl">
              {pro.photo || '👤'}
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{pro.name}</h1>
            <p className="text-lg text-blue-600 font-semibold mb-4">
              📍 {pro.departureZone}
            </p>
            <p className="text-gray-700 mb-6 leading-relaxed">{pro.description}</p>

            <div className="flex gap-3">
              <Button
                variant="primary"
                onClick={() => document.getElementById('voyages')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Voir les voyages
              </Button>
              {pro.whatsappNumber && (
                <a href={`https://wa.me/${pro.whatsappNumber}`} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline">WhatsApp</Button>
                </a>
              )}
            </div>
          </div>

          {/* Video Embed */}
          {pro.videoUrl && (
            <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
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
      <section id="voyages" className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">Voyages au départ de {pro.departureZone}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pro.travels.map((voyage) => (
            <Card key={voyage.id} elevated hoverEffect>
              <CardContent className="p-6 flex flex-col">
                <Badge variant="info" className="w-fit mb-3">
                  {formatDate(voyage.startDate)}
                </Badge>

                <h3 className="text-lg font-bold text-gray-900 mb-2">{voyage.title}</h3>

                <p className="text-sm text-gray-600 mb-1">
                  📍 {voyage.destination}
                </p>

                <p className="text-sm text-gray-600 mb-4">
                  🚌 Départ: {voyage.pickupPoint}
                </p>

                <div className="mt-auto pt-4 border-t border-gray-200">
                  <p className="text-2xl font-bold text-blue-600 mb-4">
                    À partir de {formatPrice(voyage.price)}
                  </p>
                  <Link href={`/voyages/${voyage.id}`}>
                    <Button variant="primary" size="sm" className="w-full">
                      Réserver
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-white rounded-2xl border border-gray-200 p-8 md:p-12 space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Nous contacter</h2>
          <p className="text-gray-600">Vous avez des questions ? Nous sommes là pour vous aider.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Form */}
          <form onSubmit={handleLeadSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <Input
                placeholder="Votre nom"
                value={leadForm.name}
                onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <Input
                type="tel"
                placeholder="06 12 34 56 78"
                value={leadForm.phone}
                onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <Input
                type="email"
                placeholder="votre@email.com"
                value={leadForm.email}
                onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                placeholder="Votre message..."
                rows={4}
                value={leadForm.message}
                onChange={(e) => setLeadForm({ ...leadForm, message: e.target.value })}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="rgpd"
                checked={rgpdConsent}
                onChange={(e) => setRgpdConsent(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <label htmlFor="rgpd" className="text-sm text-gray-600">
                J'accepte que mes données soient utilisées pour me recontacter
              </label>
            </div>

            <Button variant="primary" type="submit" className="w-full">
              Être rappelé
            </Button>
          </form>

          {/* Quick Contact */}
          <div className="space-y-6">
            {pro.phone && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Appeler</h4>
                <a href={`tel:${pro.phone}`} className="text-blue-600 hover:underline">
                  {pro.phone}
                </a>
              </div>
            )}

            {pro.whatsappNumber && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">WhatsApp</h4>
                <a
                  href={`https://wa.me/${pro.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline inline-flex items-center gap-2"
                >
                  Discuter sur WhatsApp 💬
                </a>
              </div>
            )}

            {/* Follow Email Opt-in */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Suivre les voyages</h4>
              <form onSubmit={handleFollowEmail} className="space-y-2">
                <Input
                  type="email"
                  placeholder="votre@email.com"
                  value={followEmail}
                  onChange={(e) => setFollowEmail(e.target.value)}
                  required
                />
                <Button variant="primary" size="sm" type="submit" className="w-full">
                  S'abonner
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Share Section */}
      <section className="bg-gray-50 rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-semibold text-gray-900">Partager ce profil</p>
        <div className="flex gap-2 flex-wrap">
          {shareUrl && (
            <>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="sm">
                  Facebook
                </Button>
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="sm">
                  Twitter
                </Button>
              </a>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(shareUrl);
                  toast.success('Lien copié !');
                }}
              >
                Copier le lien
              </Button>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
