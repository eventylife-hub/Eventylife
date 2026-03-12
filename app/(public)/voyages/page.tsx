'use client';

/**
 * Page listing des voyages avec filtres — Design Eventy v2
 */

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { Breadcrumb } from '@/components/seo/breadcrumb';
import { TravelCard } from '@/components/TravelCard';
import { NewsletterCTA } from '@/components/newsletter-cta';
import { logger } from '@/lib/logger';

// Données fallback quand le backend n'est pas disponible
const FALLBACK_TRAVELS: Travel[] = [
  {
    id: '1', slug: 'marrakech-express', title: 'Marrakech Express',
    destination: 'Marrakech, Maroc', startDate: '2026-05-15', endDate: '2026-05-22',
    price: 89900, image: '', rating: 4.8, reviews: 124, daysCount: 7, capacity: 50, currentBookings: 38, transportType: 'BUS',
  },
  {
    id: '2', slug: 'rome-eternelle', title: 'Rome Éternelle',
    destination: 'Rome, Italie', startDate: '2026-06-10', endDate: '2026-06-15',
    price: 74900, image: '', rating: 4.7, reviews: 89, daysCount: 5, capacity: 45, currentBookings: 32, transportType: 'AVION',
  },
  {
    id: '3', slug: 'barcelone-gaudi', title: 'Barcelone & Gaudí',
    destination: 'Barcelone, Espagne', startDate: '2026-06-20', endDate: '2026-06-25',
    price: 69900, image: '', rating: 4.9, reviews: 156, daysCount: 5, capacity: 50, currentBookings: 44, transportType: 'BUS',
  },
  {
    id: '4', slug: 'lisbonne-fado', title: 'Lisbonne & Fado',
    destination: 'Lisbonne, Portugal', startDate: '2026-07-05', endDate: '2026-07-11',
    price: 79900, image: '', rating: 4.6, reviews: 67, daysCount: 6, capacity: 40, currentBookings: 28, transportType: 'BUS',
  },
  {
    id: '5', slug: 'istanbul-bosphore', title: 'Istanbul & le Bosphore',
    destination: 'Istanbul, Turquie', startDate: '2026-07-18', endDate: '2026-07-25',
    price: 94900, image: '', rating: 4.8, reviews: 98, daysCount: 7, capacity: 45, currentBookings: 36, transportType: 'AVION',
  },
  {
    id: '6', slug: 'dubrovnik-perle-adriatique', title: 'Dubrovnik, Perle de l\'Adriatique',
    destination: 'Dubrovnik, Croatie', startDate: '2026-08-02', endDate: '2026-08-08',
    price: 84900, image: '', rating: 4.7, reviews: 73, daysCount: 6, capacity: 40, currentBookings: 22, transportType: 'MIXTE',
  },
];

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
  transportType?: 'BUS' | 'AVION' | 'MIXTE';
}

type LoadState = 'loading' | 'empty' | 'error' | 'data';

function VoyagesContent() {
  const searchParams = useSearchParams();
  const [state, setState] = useState<LoadState>('loading');
  const [travels, setTravels] = useState<Travel[]>([]);
  const [filteredTravels, setFilteredTravels] = useState<Travel[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [destination, setDestination] = useState(searchParams.get('destination') || searchParams.get('dest') || '');
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [transportFilter, setTransportFilter] = useState<string>(searchParams.get('type') === 'weekend' ? '' : '');
  const [durationFilter, setDurationFilter] = useState<string>(searchParams.get('type') === 'weekend' ? 'short' : '');
  const [sortBy, setSortBy] = useState('popular');

  useEffect(() => {
    const loadTravels = async () => {
      try {
        setState('loading');
        setError(null);
        const response = await apiClient.get<Travel[] | { data: Travel[] }>('/travels');
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
        logger.warn('API indisponible, utilisation des données de démonstration');
        setTravels(FALLBACK_TRAVELS);
        setState('data');
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
    if (transportFilter) {
      result = result.filter(t => t.transportType === transportFilter);
    }
    if (durationFilter === 'short') {
      result = result.filter(t => t.daysCount <= 4);
    } else if (durationFilter === 'week') {
      result = result.filter(t => t.daysCount >= 5 && t.daysCount <= 7);
    } else if (durationFilter === 'long') {
      result = result.filter(t => t.daysCount >= 8);
    }

    const sorted = [...(result || [])];
    if (sortBy === 'price-asc') sorted.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') sorted.sort((a, b) => b.price - a.price);
    else if (sortBy === 'rating') sorted.sort((a, b) => b.rating - a.rating);
    else if (sortBy === 'date') sorted.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

    setFilteredTravels(sorted);
  }, [travels, destination, minPrice, maxPrice, transportFilter, durationFilter, sortBy]);

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '10px',
    border: '1.5px solid #E5E0D8',
    background: '#fff',
    color: 'var(--navy, #1A1A2E)',
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
      <>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
      <div className="space-y-6">
        <div
          className="p-6 rounded-2xl"
          style={{ background: '#fff', border: '1.5px solid #E5E0D8' }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => (
              <div key={i} style={{ height: 40, borderRadius: 10, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1,2,3,4].map(i => (
            <div key={i} style={{ border: '1.5px solid #E5E0D8', borderRadius: 20, overflow: 'hidden', background: 'white' }}>
              <div style={{ height: 192, width: '100%', background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
              <div style={{ padding: 16 }} className="space-y-3">
                <div style={{ height: 20, width: '75%', borderRadius: 8, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
                <div style={{ height: 16, width: '50%', borderRadius: 6, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
                <div style={{ height: 32, width: 96, borderRadius: 10, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      </>
    );
  }

  if (state === 'error') {
    return (
      <div className="text-center py-16">
        <div
          className="inline-block p-8 rounded-2xl"
          style={{ background: '#fff', border: '1.5px solid #E5E0D8' }}
        >
          <p className="text-base mb-4" style={{ color: 'var(--terra, #DC2626)' }}>⚠️ {error}</p>
          <button type="button"
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 rounded-xl font-semibold text-sm transition-all"
            style={{ background: 'var(--terra, #C75B39)', color: '#fff' }}
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
          style={{ background: '#fff', border: '1.5px solid #E5E0D8' }}
        >
          <p className="text-4xl mb-4">🔍</p>
          <p style={{ color: '#6B7280' }}>
            {travels.length === 0
              ? 'Aucun voyage disponible pour le moment.'
              : 'Aucun voyage ne correspond à vos critères.'}
          </p>
          {destination && (
            <button type="button"
              onClick={() => setDestination('')}
              className="mt-4 px-5 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{ border: '1.5px solid #E5E0D8', color: 'var(--navy, #1A1A2E)', background: 'transparent' }}
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
      {/* Quick-filter chips */}
      <div className="flex flex-wrap gap-2 mb-4" role="group" aria-label="Filtres rapides">
        {[
          { label: 'Tous', dest: '', transport: '', duration: '' },
          { label: '🚌 Bus', dest: '', transport: 'BUS', duration: '' },
          { label: '✈️ Avion', dest: '', transport: 'AVION', duration: '' },
          { label: '⚡ Week-end', dest: '', transport: '', duration: 'short' },
          { label: '📅 1 semaine', dest: '', transport: '', duration: 'week' },
          { label: '🌍 +8 jours', dest: '', transport: '', duration: 'long' },
          { label: '💰 - de 700€', dest: '', transport: '', duration: '', maxP: 70000 },
        ].map((chip, i) => {
          const isActive =
            (chip.transport === transportFilter || (!chip.transport && !transportFilter)) &&
            (chip.duration === durationFilter || (!chip.duration && !durationFilter)) &&
            (!('maxP' in chip) || maxPrice === (chip.maxP ?? null));
          const isAllChip = !chip.transport && !chip.duration && !('maxP' in chip && chip.maxP);
          const activeForAll = isAllChip && !transportFilter && !durationFilter && maxPrice === null;
          const active = isAllChip ? activeForAll : (chip.transport === transportFilter && chip.duration === durationFilter && (('maxP' in chip) ? maxPrice === (chip.maxP ?? null) : true));
          return (
            <button
              key={i}
              type="button"
              onClick={() => {
                setTransportFilter(chip.transport);
                setDurationFilter(chip.duration);
                if ('maxP' in chip && chip.maxP) setMaxPrice(chip.maxP);
                else if (isAllChip) { setMaxPrice(null); setMinPrice(null); setDestination(''); }
              }}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
              style={{
                background: active ? 'var(--terra, #C75B39)' : '#fff',
                color: active ? '#fff' : 'var(--navy, #1A1A2E)',
                border: `1.5px solid ${active ? 'var(--terra, #C75B39)' : '#E5E0D8'}`,
                cursor: 'pointer',
              }}
            >
              {chip.label}
            </button>
          );
        })}
      </div>

      {/* Filtres */}
      <form aria-label="Filtrer les voyages"
        role="search"
        aria-label="Filtrer les voyages"
        className="p-6 rounded-2xl"
        style={{ background: '#fff', border: '1.5px solid #E5E0D8' }}
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="sm:col-span-2">
            <label htmlFor="filter-destination" className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--navy, #1A1A2E)' }}>Destination</label>
            <input
              id="filter-destination"
              placeholder="Chercher une destination..."
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--terra, #C75B39)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#E5E0D8')}
            />
          </div>
          <div>
            <label htmlFor="filter-min-price" className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--navy, #1A1A2E)' }}>Prix min (€)</label>
            <input
              id="filter-min-price"
              type="number"
              min="0"
              placeholder="0"
              onChange={(e) => setMinPrice(e.target.value ? parseInt(e.target.value) * 100 : null)}
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--terra, #C75B39)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#E5E0D8')}
            />
          </div>
          <div>
            <label htmlFor="filter-max-price" className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--navy, #1A1A2E)' }}>Prix max (€)</label>
            <input
              id="filter-max-price"
              type="number"
              min="0"
              placeholder="10 000"
              onChange={(e) => setMaxPrice(e.target.value ? parseInt(e.target.value) * 100 : null)}
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--terra, #C75B39)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#E5E0D8')}
            />
          </div>
          <div>
            <label htmlFor="filter-transport" className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--navy, #1A1A2E)' }}>Transport</label>
            <select
              id="filter-transport"
              value={transportFilter}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTransportFilter(e.target.value)}
              style={selectStyle}
            >
              <option value="">Tous</option>
              <option value="BUS">🚌 Bus</option>
              <option value="AVION">✈️ Avion</option>
              <option value="MIXTE">🔄 Mixte</option>
            </select>
          </div>
          <div>
            <label htmlFor="filter-sort" className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--navy, #1A1A2E)' }}>Trier par</label>
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
              <option value="date">Départ le plus proche</option>
            </select>
          </div>
        </div>
        {(destination || minPrice !== null || maxPrice !== null || transportFilter || durationFilter) && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs" style={{ color: '#6B7280' }}>Filtres actifs :</span>
            {destination && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium" style={{ background: 'rgba(199,91,57,0.1)', color: 'var(--terra, #C75B39)' }}>
                {destination}
                <button type="button" onClick={() => setDestination('')} className="ml-0.5 hover:opacity-70" aria-label={`Supprimer filtre ${destination}`}>&times;</button>
              </span>
            )}
            {transportFilter && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium" style={{ background: 'rgba(0,119,182,0.1)', color: 'var(--ocean, #0077B6)' }}>
                {transportFilter === 'BUS' ? '🚌 Bus' : transportFilter === 'AVION' ? '✈️ Avion' : '🔄 Mixte'}
                <button type="button" onClick={() => setTransportFilter('')} className="ml-0.5 hover:opacity-70" aria-label="Supprimer filtre transport">&times;</button>
              </span>
            )}
            {durationFilter && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium" style={{ background: 'rgba(123,47,247,0.1)', color: 'var(--violet, #7B2FF7)' }}>
                {durationFilter === 'short' ? '⚡ Week-end' : durationFilter === 'week' ? '📅 1 semaine' : '🌍 +8 jours'}
                <button type="button" onClick={() => setDurationFilter('')} className="ml-0.5 hover:opacity-70" aria-label="Supprimer filtre durée">&times;</button>
              </span>
            )}
            <button
              type="button"
              onClick={() => { setDestination(''); setMinPrice(null); setMaxPrice(null); setTransportFilter(''); setDurationFilter(''); }}
              className="text-xs underline ml-auto"
              style={{ color: '#6B7280', cursor: 'pointer' }}
            >
              Tout effacer
            </button>
          </div>
        )}
      </form>

      {/* Résultats */}
      <div>
        <p className="text-sm mb-4" style={{ color: '#6B7280' }}>
          {filteredTravels.length} voyage{filteredTravels.length !== 1 ? 's' : ''} trouvé{filteredTravels.length !== 1 ? 's' : ''}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTravels.map((voyage) => (
            <div key={voyage.id} className="hover-lift">
              <TravelCard
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
                transportType={voyage.transportType}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function VoyagesPage() {
  return (
    <div className="page-enter" style={{ backgroundColor: 'var(--cream, #FAF7F2)', minHeight: '100vh' }}>
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

        <Suspense fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1,2,3,4].map(i => (
              <div key={i} style={{ border: '1.5px solid #E5E0D8', borderRadius: 20, overflow: 'hidden', background: 'white' }}>
                <div style={{ height: 192, width: '100%', background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
                <div style={{ padding: 16 }} className="space-y-3">
                  <div style={{ height: 20, width: '75%', borderRadius: 8, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
                  <div style={{ height: 16, width: '50%', borderRadius: 6, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
                </div>
              </div>
            ))}
          </div>
        }>
          <VoyagesContent />
        </Suspense>

        {/* Newsletter */}
        <NewsletterCTA variant="terra" className="mt-16" />
      </div>
    </div>
  );
}
