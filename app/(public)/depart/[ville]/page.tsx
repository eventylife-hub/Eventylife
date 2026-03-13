'use client';

/**
 * Page Voyages par ville de départ — Sun/Ocean V4
 * Hero + filtres sidebar sticky + grille voyages + CTA + Newsletter
 */

import { useState, useEffect, useMemo } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { Breadcrumb } from '@/components/seo/breadcrumb';
import { NewsletterCTA } from '@/components/newsletter-cta';
import { logger } from '@/lib/logger';

/* ─── Types ─── */
interface Travel {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  price: number;
  imageUrl?: string;
  imageEmoji?: string;
  rating: number;
  reviews: number;
  daysCount: number;
  capacity: number;
  currentBookings: number;
  transportType?: 'BUS' | 'AVION' | 'MIXTE';
}

/* ─── Helpers ─── */
const formatPrice = (cents: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(cents / 100);

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });

const TRANSPORT_LABELS: Record<string, { icon: string; label: string }> = {
  BUS: { icon: '🚌', label: 'Bus' },
  AVION: { icon: '✈️', label: 'Avion' },
  MIXTE: { icon: '🚌✈️', label: 'Mixte' },
};

/* ─── Données démo (protégées derrière NEXT_PUBLIC_DEMO_MODE) ─── */
const getDemoTravels = (): Travel[] => [
  {
    id: 'voyage-demo-1',
    title: 'Marrakech en Famille',
    destination: 'Marrakech, Maroc',
    startDate: new Date(Date.now() + 45 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 52 * 86400000).toISOString(),
    price: 89900,
    imageEmoji: '🇲🇦',
    rating: 4.8,
    reviews: 42,
    daysCount: 7,
    capacity: 30,
    currentBookings: 22,
    transportType: 'BUS',
  },
  {
    id: 'voyage-demo-2',
    title: 'Barcelone Art & Architecture',
    destination: 'Barcelone, Espagne',
    startDate: new Date(Date.now() + 60 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 65 * 86400000).toISOString(),
    price: 79900,
    imageEmoji: '🇪🇸',
    rating: 4.9,
    reviews: 58,
    daysCount: 5,
    capacity: 25,
    currentBookings: 18,
    transportType: 'BUS',
  },
  {
    id: 'voyage-demo-3',
    title: 'Istanbul Mystérieuse',
    destination: 'Istanbul, Turquie',
    startDate: new Date(Date.now() + 75 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 83 * 86400000).toISOString(),
    price: 84900,
    imageEmoji: '🇹🇷',
    rating: 4.7,
    reviews: 35,
    daysCount: 8,
    capacity: 32,
    currentBookings: 25,
    transportType: 'AVION',
  },
  {
    id: 'voyage-demo-4',
    title: 'Îles Grecques Idylliques',
    destination: 'Santorin & Mykonos, Grèce',
    startDate: new Date(Date.now() + 90 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 98 * 86400000).toISOString(),
    price: 99900,
    imageEmoji: '🇬🇷',
    rating: 4.9,
    reviews: 67,
    daysCount: 8,
    capacity: 28,
    currentBookings: 26,
    transportType: 'AVION',
  },
  {
    id: 'voyage-demo-5',
    title: 'Lisbonne & Porto Authentique',
    destination: 'Lisbonne, Portugal',
    startDate: new Date(Date.now() + 30 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 36 * 86400000).toISOString(),
    price: 74900,
    imageEmoji: '🇵🇹',
    rating: 4.6,
    reviews: 29,
    daysCount: 6,
    capacity: 35,
    currentBookings: 12,
    transportType: 'BUS',
  },
  {
    id: 'voyage-demo-6',
    title: 'Tunisie : Djerba & Sahara',
    destination: 'Djerba, Tunisie',
    startDate: new Date(Date.now() + 55 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 62 * 86400000).toISOString(),
    price: 69900,
    imageEmoji: '🇹🇳',
    rating: 4.5,
    reviews: 18,
    daysCount: 7,
    capacity: 40,
    currentBookings: 31,
    transportType: 'MIXTE',
  },
];

/* ─── Tri options ─── */
type SortOption = 'price-asc' | 'price-desc' | 'date-asc' | 'rating-desc';
const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'price-asc', label: 'Prix croissant' },
  { value: 'price-desc', label: 'Prix décroissant' },
  { value: 'date-asc', label: 'Prochains départs' },
  { value: 'rating-desc', label: 'Mieux notés' },
];

export default function DepartVillePage() {
  const params = useParams();
  const ville = (params.ville as string) || '';
  const villeFormatted = ville.charAt(0).toUpperCase() + ville.slice(1).replace(/-/g, ' ');

  const [travels, setTravels] = useState<Travel[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>('date-asc');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000]);
  const [durationFilter, setDurationFilter] = useState<string>('all');
  const [transportFilter, setTransportFilter] = useState<string>('all');

  /* Charger les données */
  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/travels?departure=${encodeURIComponent(ville)}`, { signal: controller.signal });
        if (res.status === 404) { notFound(); return; }
        if (res.ok) {
          const data = await res.json() as { items: Travel[] };
          setTravels(data?.items || []);
        } else {
          if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
            setTravels(getDemoTravels());
          }
        }
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        logger.warn('API voyages indisponible — données démo');
        if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
          setTravels(getDemoTravels());
        }
      } finally {
        setLoading(false);
      }
    };
    if (ville) load();
    return () => controller.abort();
  }, [ville]);

  /* Filtrer + trier */
  const filteredTravels = useMemo(() => {
    let result = [...travels];

    // Filtre prix
    result = result.filter((t) => t.price >= priceRange[0] && t.price <= priceRange[1]);

    // Filtre durée
    if (durationFilter === 'short') result = result.filter((t) => t.daysCount <= 5);
    else if (durationFilter === 'medium') result = result.filter((t) => t.daysCount >= 6 && t.daysCount <= 8);
    else if (durationFilter === 'long') result = result.filter((t) => t.daysCount > 8);

    // Filtre transport
    if (transportFilter !== 'all') result = result.filter((t) => t.transportType === transportFilter);

    // Tri
    switch (sortBy) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      case 'date-asc': result.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()); break;
      case 'rating-desc': result.sort((a, b) => b.rating - a.rating); break;
    }

    return result;
  }, [travels, priceRange, durationFilter, transportFilter, sortBy]);

  const hasActiveFilters = durationFilter !== 'all' || transportFilter !== 'all' || priceRange[0] > 0 || priceRange[1] < 200000;

  /* ─── Skeleton Loading ─── */
  if (loading) {
    return (
      <div style={{ backgroundColor: 'var(--cream, #FAF7F2)', minHeight: '100vh' }}>
        <div style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #2d2d4e 100%)', padding: '5rem 1rem 4rem' }}>
          <div className="mx-auto max-w-6xl text-center">
            <div className="h-4 w-32 mx-auto mb-4 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }} />
            <div className="h-10 w-96 mx-auto mb-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.1)' }} />
            <div className="h-5 w-72 mx-auto rounded-lg" style={{ background: 'rgba(255,255,255,0.1)' }} />
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="h-64 rounded-2xl" style={{ background: 'rgba(26,26,46,0.04)' }} />
            </div>
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-80 rounded-2xl" style={{ background: 'rgba(26,26,46,0.04)' }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--cream, #FAF7F2)', minHeight: '100vh' }}>
      {/* Hero V4 */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1A1A2E 0%, #2d2d4e 100%)',
          color: 'white',
          padding: '5rem 1rem 4rem',
        }}
      >
        <div className="mx-auto max-w-6xl text-center">
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
            Départ de {villeFormatted}
          </p>
          <h1
            className="text-3xl sm:text-5xl mb-4"
            style={{
              fontWeight: '700',
              fontFamily: 'var(--font-playfair, Playfair Display, serif)',
            }}
          >
            Voyages au départ de{' '}
            <span style={{ color: 'var(--terra, #C75B39)' }}>{villeFormatted}</span>
          </h1>
          <p
            className="mx-auto"
            style={{
              fontSize: '1.125rem',
              color: 'rgba(255,255,255,0.75)',
              maxWidth: '42rem',
            }}
          >
            Découvrez nos voyages de groupe avec transport porte-à-porte et accompagnement personnalisé.
          </p>

          {/* Stats rapides */}
          <div className="flex justify-center gap-8 mt-8">
            {[
              { value: `${travels.length}`, label: 'Voyages' },
              { value: '4.8', label: 'Note moyenne' },
              { value: '98%', label: 'Satisfaits' },
            ].map((stat) => (
              <div key={stat.label}>
                <div
                  className="text-2xl sm:text-3xl font-bold"
                  style={{ color: 'var(--terra, #C75B39)' }}
                >
                  {stat.value}
                </div>
                <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-12">
        <Breadcrumb
          items={[
            { name: 'Accueil', href: '/' },
            { name: 'Villes de départ', href: '/depart' },
            { name: villeFormatted, href: `/depart/${ville}` },
          ]}
        />

        {/* Barre de tri + compteur */}
        <div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-8 mb-6 gap-4"
        >
          <p className="text-sm" style={{ color: '#64748B' }}>
            <strong style={{ color: 'var(--navy, #1A1A2E)' }}>{filteredTravels.length}</strong>{' '}
            voyage{filteredTravels.length !== 1 ? 's' : ''} disponible{filteredTravels.length !== 1 ? 's' : ''}
          </p>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            aria-label="Trier les voyages"
            className="text-sm"
            style={{
              padding: '8px 16px',
              borderRadius: '12px',
              border: '1.5px solid #E5E0D8',
              background: 'white',
              color: 'var(--navy, #1A1A2E)',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* ─── Filtres Sidebar ─── */}
          <aside className="lg:col-span-1">
            <div
              className="rounded-2xl"
              style={{
                background: 'white',
                border: '1px solid rgba(26,26,46,0.08)',
                boxShadow: '0 2px 8px rgba(26,26,46,0.04)',
                padding: '1.5rem',
                position: 'sticky',
                top: '1.5rem',
              }}
            >
              <h3
                className="text-base font-bold mb-5"
                style={{ color: 'var(--navy, #1A1A2E)' }}
              >
                Filtrer
              </h3>

              {/* Transport */}
              <div className="mb-6">
                <label
                  className="block text-xs font-semibold mb-2 uppercase tracking-wider"
                  style={{ color: '#64748B' }}
                >
                  Transport
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'all', label: 'Tous' },
                    { value: 'BUS', label: '🚌 Bus' },
                    { value: 'AVION', label: '✈️ Avion' },
                    { value: 'MIXTE', label: '🚌✈️ Mixte' },
                  ].map((opt) => (
                    <button
                      type="button"
                      key={opt.value}
                      onClick={() => setTransportFilter(opt.value)}
                      className="text-xs font-semibold rounded-full transition-all duration-200"
                      style={{
                        padding: '6px 14px',
                        background: transportFilter === opt.value ? 'var(--terra, #C75B39)' : 'rgba(199,91,57,0.06)',
                        color: transportFilter === opt.value ? '#fff' : 'var(--navy, #1A1A2E)',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Durée */}
              <div className="mb-6">
                <label
                  className="block text-xs font-semibold mb-2 uppercase tracking-wider"
                  style={{ color: '#64748B' }}
                >
                  Durée
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'all', label: 'Toutes' },
                    { value: 'short', label: '≤ 5 jours' },
                    { value: 'medium', label: '6-8 jours' },
                    { value: 'long', label: '9+ jours' },
                  ].map((opt) => (
                    <button
                      type="button"
                      key={opt.value}
                      onClick={() => setDurationFilter(opt.value)}
                      className="text-xs font-semibold rounded-full transition-all duration-200"
                      style={{
                        padding: '6px 14px',
                        background: durationFilter === opt.value ? 'var(--terra, #C75B39)' : 'rgba(199,91,57,0.06)',
                        color: durationFilter === opt.value ? '#fff' : 'var(--navy, #1A1A2E)',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget */}
              <div className="mb-6">
                <label
                  htmlFor="depart-budgetMax"
                  className="block text-xs font-semibold mb-2 uppercase tracking-wider"
                  style={{ color: '#64748B' }}
                >
                  Budget max
                </label>
                <input
                  id="depart-budgetMax"
                  type="range"
                  min={0}
                  max={200000}
                  step={5000}
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  aria-label="Budget maximum"
                  className="w-full"
                  style={{ accentColor: 'var(--terra, #C75B39)' }}
                />
                <div className="flex justify-between text-xs mt-1" style={{ color: '#64748B' }}>
                  <span>0 €</span>
                  <span className="font-semibold" style={{ color: 'var(--terra, #C75B39)' }}>
                    {formatPrice(priceRange[1])}
                  </span>
                </div>
              </div>

              {/* Reset */}
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={() => {
                    setDurationFilter('all');
                    setTransportFilter('all');
                    setPriceRange([0, 200000]);
                  }}
                  className="w-full text-sm font-semibold rounded-xl transition-all duration-200"
                  style={{
                    padding: '10px',
                    background: 'transparent',
                    color: 'var(--terra, #C75B39)',
                    border: '1.5px solid #E5E0D8',
                    cursor: 'pointer',
                  }}
                >
                  Réinitialiser les filtres
                </button>
              )}
            </div>
          </aside>

          {/* ─── Grille voyages ─── */}
          <div className="lg:col-span-3">
            {filteredTravels.length === 0 ? (
              <div className="text-center py-16">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4"
                  style={{ backgroundColor: 'rgba(199,91,57,0.08)' }}
                >
                  🔍
                </div>
                <p
                  className="text-lg font-semibold mb-2"
                  style={{ color: 'var(--navy, #1A1A2E)' }}
                >
                  Aucun voyage ne correspond
                </p>
                <p className="mb-4" style={{ color: '#64748B' }}>
                  Essayez de modifier vos filtres ou découvrez tous nos voyages.
                </p>
                <div className="flex justify-center gap-3">
                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={() => {
                        setDurationFilter('all');
                        setTransportFilter('all');
                        setPriceRange([0, 200000]);
                      }}
                      className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
                      style={{
                        border: '1.5px solid #E5E0D8',
                        color: 'var(--navy, #1A1A2E)',
                        background: 'white',
                        cursor: 'pointer',
                      }}
                    >
                      Réinitialiser
                    </button>
                  )}
                  <Link
                    href="/voyages"
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
                    style={{
                      background: 'var(--terra, #C75B39)',
                      color: '#fff',
                      textDecoration: 'none',
                    }}
                  >
                    Tous les voyages
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredTravels.map((voyage) => {
                  const available = voyage.capacity - voyage.currentBookings;
                  const transport = voyage.transportType ? TRANSPORT_LABELS[voyage.transportType] : null;

                  return (
                    <Link key={voyage.id} href={`/voyages/${voyage.id}`} className="block group">
                      <article
                        className="overflow-hidden h-full flex flex-col transition-all duration-300"
                        style={{
                          background: '#FFFFFF',
                          borderRadius: '16px',
                          border: '1px solid rgba(26,26,46,0.08)',
                          boxShadow: '0 2px 8px rgba(26,26,46,0.04)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = '0 8px 30px rgba(26,26,46,0.12)';
                          e.currentTarget.style.transform = 'translateY(-4px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(26,26,46,0.04)';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        {/* Image */}
                        <div
                          className="relative aspect-[4/3] overflow-hidden flex items-center justify-center"
                          style={{
                            background: 'linear-gradient(135deg, #0077B6 0%, #48CAE4 50%, #FF6B35 100%)',
                          }}
                        >
                          <span className="text-6xl">{voyage.imageEmoji || '✈️'}</span>

                          {/* Badges flottants */}
                          <div className="absolute top-3 left-3 flex gap-2">
                            <span
                              className="px-3 py-1 text-xs font-bold rounded-full backdrop-blur-sm"
                              style={{ background: 'rgba(255,255,255,0.92)', color: 'var(--navy, #1A1A2E)' }}
                            >
                              {voyage.daysCount} jour{voyage.daysCount !== 1 ? 's' : ''}
                            </span>
                            {available <= 5 && available > 0 && (
                              <span
                                className="px-3 py-1 text-xs font-bold rounded-full"
                                style={{ background: 'rgba(199,91,57,0.9)', color: '#FFFFFF' }}
                              >
                                Peu de places
                              </span>
                            )}
                            {available <= 0 && (
                              <span
                                className="px-3 py-1 text-xs font-bold rounded-full"
                                style={{ background: 'rgba(26,26,46,0.85)', color: '#FFFFFF' }}
                              >
                                Complet
                              </span>
                            )}
                          </div>
                          {transport && (
                            <div className="absolute top-3 right-3">
                              <span
                                className="px-3 py-1 text-xs font-bold rounded-full backdrop-blur-sm"
                                style={{ background: 'rgba(0,119,182,0.9)', color: '#FFFFFF' }}
                              >
                                {transport.icon} {transport.label}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Contenu */}
                        <div className="p-5 flex-1 flex flex-col">
                          <h3
                            className="text-lg font-bold mb-2 line-clamp-2 leading-snug"
                            style={{ color: 'var(--navy, #1A1A2E)' }}
                          >
                            {voyage.title}
                          </h3>
                          <p className="text-sm mb-1" style={{ color: '#4A5568' }}>
                            📍 {voyage.destination}
                          </p>
                          <p className="text-xs mb-4" style={{ color: '#64748B' }}>
                            {formatDate(voyage.startDate)} — {formatDate(voyage.endDate)}
                          </p>

                          <div className="mt-auto">
                            <p
                              className="text-2xl font-bold mb-3"
                              style={{ color: 'var(--terra, #C75B39)' }}
                            >
                              À partir de {formatPrice(voyage.price)}
                            </p>

                            <div
                              className="flex justify-between items-center pt-3 mb-4"
                              style={{ borderTop: '1px solid rgba(26,26,46,0.08)' }}
                            >
                              {voyage.rating > 0 && (
                                <span className="flex items-center gap-1 text-sm">
                                  <span style={{ color: 'var(--gold, #D4A853)' }}>
                                    ⭐ {voyage.rating.toFixed(1)}
                                  </span>
                                  <span style={{ color: '#64748B' }}>({voyage.reviews})</span>
                                </span>
                              )}
                              <span className="text-xs" style={{ color: '#64748B' }}>
                                {available} place{available !== 1 ? 's' : ''} restante{available !== 1 ? 's' : ''}
                              </span>
                            </div>

                            <button
                              type="button"
                              className="w-full px-4 py-2.5 rounded-xl font-semibold text-white text-sm transition-all duration-200"
                              style={{ background: 'var(--terra, #C75B39)', border: 'none', cursor: 'pointer' }}
                              onMouseEnter={(e) => { e.currentTarget.style.background = '#B5502F'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--terra, #C75B39)'; }}
                            >
                              Voir détails
                            </button>
                          </div>
                        </div>
                      </article>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* CTA */}
        <section
          className="mt-16 text-center rounded-3xl"
          style={{
            background: 'linear-gradient(135deg, #C75B39, #D97B5E)',
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
            Votre voyage idéal vous attend
          </h2>
          <p
            className="mx-auto mb-6"
            style={{ color: 'rgba(255,255,255,0.9)', maxWidth: '32rem' }}
          >
            Transport porte-à-porte, accompagnement personnalisé, prix tout compris.
            Réservez en toute sérénité.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/voyages"
              className="inline-block px-8 py-3 rounded-xl font-bold text-base transition-all duration-200 hover:-translate-y-0.5"
              style={{
                backgroundColor: 'white',
                color: 'var(--terra, #C75B39)',
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }}
            >
              Tous nos voyages
            </Link>
            <Link
              href="/contact"
              className="inline-block px-8 py-3 rounded-xl font-bold text-base transition-all duration-200 hover:-translate-y-0.5"
              style={{
                backgroundColor: 'transparent',
                color: 'white',
                textDecoration: 'none',
                border: '2px solid rgba(255,255,255,0.5)',
              }}
            >
              Nous contacter
            </Link>
          </div>
        </section>

        {/* Newsletter */}
        <NewsletterCTA variant="navy" className="mt-16" />
      </div>
    </div>
  );
}
