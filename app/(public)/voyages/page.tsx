'use client';

/**
 * Page listing des voyages avec filtres — Design Eventy v2
 */

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SkeletonGrid } from '@/components/ui/skeleton';
import { apiClient } from '@/lib/api-client';
import { Breadcrumb } from '@/components/seo/breadcrumb';
import { TravelCard } from '@/components/TravelCard';
import { NewsletterCTA } from '@/components/newsletter-cta';
const C = {
  navy: '#1A1A2E',
  cream: '#FAF7F2',
  terra: '#C75B39',
  terraLight: '#D97B5E',
  terraSoft: 'var(--terra-soft)',
  gold: '#D4A853',
  goldSoft: '#FDF6E8',
  border: '#E5E0D8',
  muted: '#6B7280',
  forest: '#166534',
  forestBg: '#DCFCE7',
};

interface Travel {
  id: string;
  slug: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
  daysCount: number;
  capacity: number;
  currentBookings: number;
}

type LoadState = 'loading' | 'empty' | 'error' | 'data';

function VoyagesContent() {
  const searchParams = useSearchParams();
  const [state, setState] = useState<LoadState>('loading');
  const [travels, setTravels] = useState<Travel[]>([]);
  const [filteredTravels, setFilteredTravels] = useState<Travel[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [destination, setDestination] = useState(searchParams.get('destination') || '');
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState('popular');

  useEffect(() => {
    const loadTravels = async () => {
      try {
        setState('loading');
        setError(null);
        const response = await apiClient.get<any>('/travels');
        const travelList = Array.isArray(response) ? response : (response.data || []);
        const mappedTravels = travelList.map((travel) => ({
          id: travel.id,
          slug: travel.slug,
          title: travel.title,
          destination: travel.destination,
          startDate: travel.startDate || new Date().toISOString(),
          endDate: travel.endDate || new Date().toISOString(),
          price: travel.pricePerPerson || travel.price || 0,
          image: travel.image || '✈️',
          rating: travel.rating || 4.5,
          reviews: travel.reviews || 0,
          daysCount: travel.daysCount || 5,
          capacity: travel.capacity || 50,
          currentBookings: travel.bookings || travel.currentBookings || 0,
        }));
        setTravels(mappedTravels);
        setState(mappedTravels.length > 0 ? 'data' : 'empty');
      } catch (err: unknown) {
        console.error('Erreur lors du chargement des voyages:', err);
        setError('Erreur lors du chargement des voyages');
        setState('error');
      }
    };
    loadTravels();
  }, []);

  useEffect(() => {
    let result = travels;
    if (destination) {
      result = result.filter(t =>
        t.destination.toLowerCase().includes(destination.toLowerCase()) ||
        t.title.toLowerCase().includes(destination.toLowerCase())
      );
    }
    if (minPrice !== null) result = result.filter(t => t.price >= minPrice);
    if (maxPrice !== null) result = result.filter(t => t.price <= maxPrice);

    const sorted = [...(result || [])];
    if (sortBy === 'price-asc') sorted.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') sorted.sort((a, b) => b.price - a.price);
    else if (sortBy === 'rating') sorted.sort((a, b) => b.rating - a.rating);

    setFilteredTravels(sorted);
  }, [travels, destination, minPrice, maxPrice, sortBy]);

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '10px',
    border: `1.5px solid ${C.border}`,
    background: '#fff',
    color: C.navy,
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  const selectStyle = {
    ...inputStyle,
    cursor: 'pointer' as const,
  };

  if (state === 'loading') {
    return (
      <div className="space-y-6">
        <div
          className="p-6 rounded-2xl"
          style={{ background: '#fff', border: `1.5px solid ${C.border}` }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-10 rounded-lg skeleton" />
            ))}
          </div>
        </div>
        <SkeletonGrid columns={2} count={4} />
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="text-center py-16">
        <div
          className="inline-block p-8 rounded-2xl"
          style={{ background: '#fff', border: `1.5px solid ${C.border}` }}
        >
          <p className="text-base mb-4" style={{ color: 'var(--terra, #DC2626)' }}>⚠️ {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 rounded-xl font-semibold text-sm transition-all"
            style={{ background: C.terra, color: '#fff' }}
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (state === 'data' && filteredTravels.length === 0) {
    return (
      <div className="text-center py-16">
        <div
          className="inline-block p-8 rounded-2xl"
          style={{ background: '#fff', border: `1.5px solid ${C.border}` }}
        >
          <p className="text-4xl mb-4">🔍</p>
          <p style={{ color: C.muted }}>
            {travels.length === 0
              ? 'Aucun voyage disponible pour le moment.'
              : 'Aucun voyage ne correspond à vos critères.'}
          </p>
          {destination && (
            <button
              onClick={() => setDestination('')}
              className="mt-4 px-5 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{ border: `1.5px solid ${C.border}`, color: C.navy, background: 'transparent' }}
            >
              Réinitialiser
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Filtres */}
      <form
        role="search"
        aria-label="Filtrer les voyages"
        className="p-6 rounded-2xl"
        style={{ background: '#fff', border: `1.5px solid ${C.border}` }}
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="filter-destination" className="block text-xs font-semibold mb-1.5" style={{ color: C.navy }}>Destination</label>
            <input
              id="filter-destination"
              placeholder="Chercher..."
              value={destination}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDestination((e.target as HTMLInputElement).value)}
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = C.terra)}
              onBlur={(e) => (e.currentTarget.style.borderColor = C.border)}
            />
          </div>
          <div>
            <label htmlFor="filter-min-price" className="block text-xs font-semibold mb-1.5" style={{ color: C.navy }}>Prix min (€)</label>
            <input
              id="filter-min-price"
              type="number"
              min="0"
              placeholder="0"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMinPrice((e.target as HTMLInputElement).value ? parseInt((e.target as HTMLInputElement).value) * 100 : null)}
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = C.terra)}
              onBlur={(e) => (e.currentTarget.style.borderColor = C.border)}
            />
          </div>
          <div>
            <label htmlFor="filter-max-price" className="block text-xs font-semibold mb-1.5" style={{ color: C.navy }}>Prix max (€)</label>
            <input
              id="filter-max-price"
              type="number"
              min="0"
              placeholder="10 000"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMaxPrice((e.target as HTMLInputElement).value ? parseInt((e.target as HTMLInputElement).value) * 100 : null)}
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = C.terra)}
              onBlur={(e) => (e.currentTarget.style.borderColor = C.border)}
            />
          </div>
          <div>
            <label htmlFor="filter-sort" className="block text-xs font-semibold mb-1.5" style={{ color: C.navy }}>Trier par</label>
            <select
              id="filter-sort"
              value={sortBy}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value)}
              style={selectStyle}
            >
              <option value="popular">Plus populaires</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="rating">Meilleure notation</option>
            </select>
          </div>
        </div>
      </form>

      {/* Résultats */}
      <div>
        <p className="text-sm mb-4" style={{ color: C.muted }}>
          {filteredTravels.length} voyage{filteredTravels.length !== 1 ? 's' : ''} trouvé{filteredTravels.length !== 1 ? 's' : ''}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTravels.map((voyage) => (
            <TravelCard
              key={voyage.id}
              id={voyage.id}
              title={voyage.title}
              destination={voyage.destination}
              startDate={voyage.startDate}
              endDate={voyage.endDate}
              priceInCents={voyage.price}
              imageUrl={voyage.image !== '✈️' ? voyage.image : undefined}
              rating={voyage.rating}
              reviewCount={voyage.reviews}
              capacity={voyage.capacity}
              currentBookings={voyage.currentBookings}
              slug={voyage.slug}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function VoyagesPage() {
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
        <div className="mx-auto max-w-5xl text-center">
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
            Explorer
          </p>
          <h1
            className="text-3xl sm:text-5xl mb-4"
            style={{
              fontWeight: '700',
              fontFamily: 'var(--font-playfair, Playfair Display, serif)',
            }}
          >
            Nos <span style={{ color: 'var(--terra, #C75B39)' }}>voyages</span>
          </h1>
          <p
            className="mx-auto"
            style={{
              fontSize: '1.125rem',
              color: 'rgba(255,255,255,0.75)',
              maxWidth: '42rem',
            }}
          >
            Découvrez notre sélection de voyages en groupe avec accompagnement
            humain porte-à-porte.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumb
          items={[
            { name: 'Accueil', href: '/' },
            { name: 'Nos voyages', href: '/voyages' },
          ]}
        />

        <Suspense fallback={<SkeletonGrid columns={2} count={4} />}>
          <VoyagesContent />
        </Suspense>

        {/* Newsletter */}
        <NewsletterCTA variant="terra" className="mt-16" />
      </div>
    </div>
  );
}
