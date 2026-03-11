'use client';

/**
 * Page Voyages par ville de départ
 * Listing filtré des voyages selon la ville de départ
 */

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Breadcrumb } from '@/components/seo/breadcrumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice, formatDate } from '@/lib/utils';
interface Travel {
  id: string;
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

export default function DepartPage() {
  const params = useParams();
  const ville = params.ville as string;

  const [state, setState] = useState<LoadState>('loading');
  const [travels, setTravels] = useState<Travel[]>([]);
  const [filteredTravels, setFilteredTravels] = useState<Travel[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Filtres
  const [minDate, setMinDate] = useState<string>('');
  const [maxDate, setMaxDate] = useState<string>('');
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [minDuration, setMinDuration] = useState<number | null>(null);
  const [maxDuration, setMaxDuration] = useState<number | null>(null);
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);

  const themes = ['Aventure', 'Culture', 'Plage', 'Montagne', 'Ville', 'Nature'];

  // Charger les données
  useEffect(() => {
    const loadTravels = async () => {
      try {
        setState('loading');
        // Appel API réel
        const res = await fetch(`/api/travels?departure=${encodeURIComponent(ville)}`);

        if (!res.ok) {
          setState('empty');
          return;
        }

        const data = (await res.json() as unknown) as unknown;
        setTravels(data?.items || []);
        setState(data.items?.length > 0 ? 'data' : 'empty');
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Erreur');
        setState('error');
      }
    };

    if (ville) loadTravels();
  }, [ville]);

  // Appliquer les filtres
  useEffect(() => {
    let result = travels;

    // Filtre date
    if (minDate) {
      result = result.filter(t => new Date(t.startDate) >= new Date(minDate));
    }
    if (maxDate) {
      result = result.filter(t => new Date(t.startDate) <= new Date(maxDate));
    }

    // Filtre prix
    if (minPrice !== null) {
      result = result.filter(t => t.price >= minPrice);
    }
    if (maxPrice !== null) {
      result = result.filter(t => t.price <= maxPrice);
    }

    // Filtre durée
    if (minDuration !== null) {
      result = result.filter(t => t.daysCount >= minDuration);
    }
    if (maxDuration !== null) {
      result = result.filter(t => t.daysCount <= maxDuration);
    }

    // Filtre thèmes
    if (selectedThemes.length > 0) {
      result = result.filter(t =>
        selectedThemes.some(theme => t.title.toLowerCase().includes(theme.toLowerCase()))
      );
    }

    setFilteredTravels(result);
  }, [travels, minDate, maxDate, minPrice, maxPrice, minDuration, maxDuration, selectedThemes]);

  const toggleTheme = (theme: string) => {
    setSelectedThemes(prev =>
      prev.includes(theme) ? prev.filter(t => t !== theme) : [...prev, theme]
    );
  };

  // Affichage selon l'état
  if (state === 'loading') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Skeleton className="h-10 w-96" />
          <Skeleton className="h-6 w-64 mt-2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-96 w-full rounded-lg" />
          <div className="col-span-2 grid grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-80 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <p style={{ color: 'var(--terra, #C75B39)' }}>⚠️ {error}</p>
        <Button variant="primary" onClick={() => window.location.reload()}>
          Réessayer
        </Button>
      </div>
    );
  }

  if (state === 'empty' || (state === 'data' && filteredTravels.length === 0)) {
    const villeUp = ville.charAt(0).toUpperCase() + ville.slice(1);
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Breadcrumb items={[
          { name: 'Accueil', href: '/' },
          { name: 'Nos voyages', href: '/voyages' },
          { name: `Départ ${villeUp}`, href: `/depart/${ville}` },
        ]} />
        <h1 style={{ fontSize: '2.25rem', fontWeight: '700', color: 'var(--navy, #1A1A2E)', marginBottom: '0.5rem' }}>
          Voyages au départ de {villeUp}
        </h1>
        <div style={{ textAlign: 'center', paddingTop: '3rem', paddingBottom: '3rem' }}>
          <p style={{ color: '#6B7280', marginBottom: '1rem', fontSize: '1.125rem' }}>
            Aucun voyage au départ de {ville} pour le moment.
          </p>
          <p style={{ color: '#6B7280', marginBottom: '1.5rem' }}>
            Découvrez nos autres destinations
          </p>
          <Link href="/voyages">
            <Button variant="primary">Voir tous les voyages</Button>
          </Link>
        </div>
      </div>
    );
  }

  const villeFormatted = ville.charAt(0).toUpperCase() + ville.slice(1);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Breadcrumb SEO */}
      <Breadcrumb items={[
        { name: 'Accueil', href: '/' },
        { name: 'Nos voyages', href: '/voyages' },
        { name: `Départ ${villeFormatted}`, href: `/depart/${ville}` },
      ]} />

      {/* Titre */}
      <div className="mb-8">
        <h1 style={{ fontSize: '2.25rem', fontWeight: '700', color: 'var(--navy, #1A1A2E)', marginBottom: '0.5rem' }}>
          Voyages au départ de {villeFormatted}
        </h1>
        <p style={{ color: '#6B7280' }}>
          Découvrez {filteredTravels.length} voyage{filteredTravels.length !== 1 ? 's' : ''} disponible{filteredTravels.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filtres Sidebar */}
        <div className="lg:col-span-1">
          <div style={{ backgroundColor: 'white', border: '1.5px solid #E5E0D8', borderRadius: '12px', padding: '1.5rem', position: 'sticky', top: '1rem' }} className="space-y-6">
            <div>
              <h3 style={{ fontWeight: '700', color: 'var(--navy, #1A1A2E)', marginBottom: '0.75rem' }}>Filtres</h3>
            </div>

            {/* Date Range */}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: 'var(--navy, #1A1A2E)', marginBottom: '0.5rem' }}>
                Date de départ
              </label>
              <div className="space-y-2">
                <Input
                  type="date"
                  value={minDate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMinDate((e.target as HTMLInputElement).value)}
                  placeholder="De"
                />
                <Input
                  type="date"
                  value={maxDate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMaxDate((e.target as HTMLInputElement).value)}
                  placeholder="À"
                />
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: 'var(--navy, #1A1A2E)', marginBottom: '0.5rem' }}>
                Budget (€)
              </label>
              <div className="space-y-2">
                <Input
                  type="number"
                  placeholder="Min"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMinPrice((e.target as HTMLInputElement).value ? parseInt((e.target as HTMLInputElement).value) * 100 : null)}
                />
                <Input
                  type="number"
                  placeholder="Max"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMaxPrice((e.target as HTMLInputElement).value ? parseInt((e.target as HTMLInputElement).value) * 100 : null)}
                />
              </div>
            </div>

            {/* Duration */}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: 'var(--navy, #1A1A2E)', marginBottom: '0.5rem' }}>
                Durée (jours)
              </label>
              <div className="space-y-2">
                <Input
                  type="number"
                  placeholder="Min"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMinDuration((e.target as HTMLInputElement).value ? parseInt((e.target as HTMLInputElement).value) : null)}
                />
                <Input
                  type="number"
                  placeholder="Max"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMaxDuration((e.target as HTMLInputElement).value ? parseInt((e.target as HTMLInputElement).value) : null)}
                />
              </div>
            </div>

            {/* Themes */}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: 'var(--navy, #1A1A2E)', marginBottom: '0.75rem' }}>
                Thème
              </label>
              <div className="space-y-2">
                {themes.map(theme => (
                  <label key={theme} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={selectedThemes.includes(theme)}
                      onChange={() => toggleTheme(theme)}
                      style={{ width: '1rem', height: '1rem', borderRadius: '4px', border: '1.5px solid #E5E0D8', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '0.875rem', color: 'var(--navy, #1A1A2E)' }}>{theme}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Reset Filters */}
            {(minDate || maxDate || minPrice || maxPrice || minDuration || maxDuration || selectedThemes.length > 0) && (
              <button
                style={{ width: '100%', backgroundColor: 'white', color: 'var(--terra, #C75B39)', padding: '0.5rem 0.75rem', borderRadius: '8px', fontSize: '0.875rem', border: '1.5px solid #E5E0D8', fontWeight: '700', cursor: 'pointer', transition: 'all 0.3s ease' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--terra, #C75B39)'; e.currentTarget.style.backgroundColor = 'rgba(199,91,57,0.1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E5E0D8'; e.currentTarget.style.backgroundColor = 'white'; }}
                onClick={() => {
                  setMinDate('');
                  setMaxDate('');
                  setMinPrice(null);
                  setMaxPrice(null);
                  setMinDuration(null);
                  setMaxDuration(null);
                  setSelectedThemes([]);
                }}
              >
                Réinitialiser
              </button>
            )}
          </div>
        </div>

        {/* Results Grid */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTravels.map((voyage) => {
              const available = voyage.capacity - voyage.currentBookings;

              return (
                <Link key={voyage.id} href={`/voyages/${voyage.id}`}>
                  <div style={{ backgroundColor: 'white', border: '1.5px solid #E5E0D8', borderRadius: '20px', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', cursor: 'pointer', transition: 'all 0.3s ease' }} onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-4px)'; }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                    <div style={{ aspectRatio: '16/9', background: `linear-gradient(135deg, var(--cream, #FAF7F2), ${'#FDF6E8'})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.75rem' }}>
                      {voyage.image}
                    </div>
                    <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: '700', backgroundColor: '#FDF6E8', color: 'var(--navy, #1A1A2E)', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>{voyage.daysCount} jours</span>
                        {available <= 5 && (
                          <span style={{ fontSize: '0.75rem', fontWeight: '700', backgroundColor: 'rgba(199,91,57,0.1)', color: 'var(--terra, #C75B39)', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>Peu de places</span>
                        )}
                      </div>

                      <h3 style={{ fontWeight: '700', fontSize: '1.125rem', color: 'var(--navy, #1A1A2E)', marginBottom: '0.25rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {voyage.title}
                      </h3>

                      <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.5rem' }}>
                        📍 {voyage.destination}
                      </p>

                      <p style={{ fontSize: '0.75rem', color: '#6B7280', marginBottom: '0.75rem' }}>
                        Du {formatDate(voyage.startDate)} au{' '}
                        {formatDate(voyage.endDate)}
                      </p>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', marginTop: 'auto', paddingTop: '1rem', borderTop: '1.5px solid #E5E0D8' }}>
                        <span style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--terra, #C75B39)' }}>
                          À partir de {formatPrice(voyage.price)}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem' }}>
                          <span>⭐ {voyage.rating}</span>
                          <span style={{ color: '#6B7280' }}>({voyage.reviews})</span>
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                          {available} place{available !== 1 ? 's' : ''} restante{available !== 1 ? 's' : ''}
                        </span>
                      </div>

                      <button style={{ width: '100%', marginTop: '1rem', backgroundColor: 'var(--terra, #C75B39)', color: 'white', padding: '0.5rem 0.75rem', borderRadius: '8px', fontSize: '0.875rem', fontWeight: '700', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#D97B5E'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--terra, #C75B39)'; }}>
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
    </div>
  );
}
