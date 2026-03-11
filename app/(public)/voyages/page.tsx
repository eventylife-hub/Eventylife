'use client';

/**
 * Page listing des voyages avec filtres — Design Eventy v2
 */

'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SkeletonGrid } from '@/components/ui/skeleton';
import { ROUTES } from '@/lib/constants';
import { formatPrice, formatDate } from '@/lib/utils';
import { apiClient } from '@/lib/api-client';

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
        const mappedTravels = travelList.map((travel: any) => ({
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
      } catch (err) {
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

    const sorted = [...result];
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
      <div
        className="p-6 rounded-2xl"
        style={{ background: '#fff', border: `1.5px solid ${C.border}` }}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: C.navy }}>Destination</label>
            <input
              placeholder="Chercher..."
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = C.terra)}
              onBlur={(e) => (e.currentTarget.style.borderColor = C.border)}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: C.navy }}>Prix min (€)</label>
            <input
              type="number"
              placeholder="0"
              onChange={(e) => setMinPrice(e.target.value ? parseInt(e.target.value) * 100 : null)}
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = C.terra)}
              onBlur={(e) => (e.currentTarget.style.borderColor = C.border)}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: C.navy }}>Prix max (€)</label>
            <input
              type="number"
              placeholder="10 000"
              onChange={(e) => setMaxPrice(e.target.value ? parseInt(e.target.value) * 100 : null)}
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = C.terra)}
              onBlur={(e) => (e.currentTarget.style.borderColor = C.border)}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: C.navy }}>Trier par</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={selectStyle}
            >
              <option value="popular">Plus populaires</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="rating">Meilleure notation</option>
            </select>
          </div>
        </div>
      </div>

      {/* Résultats */}
      <div>
        <p className="text-sm mb-4" style={{ color: C.muted }}>
          {filteredTravels.length} voyage{filteredTravels.length !== 1 ? 's' : ''} trouvé{filteredTravels.length !== 1 ? 's' : ''}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTravels.map((voyage) => {
            const available = voyage.capacity - voyage.currentBookings;

            return (
              <Link key={voyage.id} href={ROUTES.VOYAGE_DETAIL(voyage.slug)}>
                <div
                  className="h-full flex flex-col rounded-2xl overflow-hidden transition-all duration-300"
                  style={{
                    background: '#fff',
                    border: `1.5px solid ${C.border}`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(26,26,46,0.10)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div
                    className="aspect-video flex items-center justify-center text-6xl"
                    style={{ background: `linear-gradient(135deg, ${C.terra}15, ${C.gold}15)` }}
                  >
                    {voyage.image}
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-2">
                      <span
                        className="text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{ background: C.goldSoft, color: '#92400e' }}
                      >
                        {voyage.daysCount} jours
                      </span>
                      {available <= 5 && (
                        <span
                          className="text-xs font-semibold px-2.5 py-1 rounded-full animate-pulse-dot"
                          style={{ background: 'var(--terra-soft, #FEF2F2)', color: 'var(--terra, #DC2626)' }}
                        >
                          Peu de places
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-base mb-1 line-clamp-2" style={{ color: C.navy }}>
                      {voyage.title}
                    </h3>

                    <p className="text-sm mb-1" style={{ color: C.muted }}>
                      📍 {voyage.destination}
                    </p>

                    <p className="text-xs mb-3" style={{ color: '#9CA3AF' }}>
                      Du {formatDate(voyage.startDate)} au {formatDate(voyage.endDate)}
                    </p>

                    <div className="flex items-center justify-between mb-3 mt-auto">
                      <span className="text-lg font-bold" style={{ color: C.terra }}>
                        À partir de {formatPrice(voyage.price)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <span className="flex items-center gap-1 text-sm">
                        <span style={{ color: C.gold }}>★</span>
                        <span style={{ color: C.navy }}>{voyage.rating}</span>
                        <span style={{ color: C.muted }}>({voyage.reviews})</span>
                      </span>
                      <span className="text-xs" style={{ color: C.muted }}>
                        {available} place{available !== 1 ? 's' : ''} restante{available !== 1 ? 's' : ''}
                      </span>
                    </div>

                    <button
                      className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                      style={{ background: C.terra, color: '#fff' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = C.terraLight;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = C.terra;
                      }}
                    >
                      Voir détails
                    </button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function VoyagesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <span className="text-sm font-semibold uppercase tracking-widest" style={{ color: C.gold }}>
          Explorer
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-bold mt-2" style={{ color: C.navy }}>
          Nos voyages
        </h1>
        <p className="text-base mt-2" style={{ color: C.muted }}>
          Découvrez notre sélection de voyages en groupe avec accompagnement humain
        </p>
      </div>

      <Suspense fallback={<SkeletonGrid columns={2} count={4} />}>
        <VoyagesContent />
      </Suspense>
    </div>
  );
}
