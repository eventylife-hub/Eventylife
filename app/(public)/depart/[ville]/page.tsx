/**
 * Page Voyages par ville de départ
 * Listing filtré des voyages selon la ville de départ
 */

'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
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

        const data = await res.json();
        setTravels(data.items || []);
        setState(data.items?.length > 0 ? 'data' : 'empty');
      } catch (err) {
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
        <p className="text-red-600 mb-4">⚠️ {error}</p>
        <Button variant="primary" onClick={() => window.location.reload()}>
          Réessayer
        </Button>
      </div>
    );
  }

  if (state === 'empty' || (state === 'data' && filteredTravels.length === 0)) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Voyages au départ de {ville.charAt(0).toUpperCase() + ville.slice(1)}
        </h1>
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4 text-lg">
            Aucun voyage au départ de {ville} pour le moment.
          </p>
          <p className="text-gray-600 mb-6">
            Découvrez nos autres destinations
          </p>
          <Link href="/voyages">
            <Button variant="primary">Voir tous les voyages</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Titre */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Voyages au départ de {ville.charAt(0).toUpperCase() + ville.slice(1)}
        </h1>
        <p className="text-gray-600">
          Découvrez {filteredTravels.length} voyage{filteredTravels.length !== 1 ? 's' : ''} disponible{filteredTravels.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filtres Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6 sticky top-4">
            <div>
              <h3 className="font-bold text-gray-900 mb-3">Filtres</h3>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de départ
              </label>
              <div className="space-y-2">
                <Input
                  type="date"
                  value={minDate}
                  onChange={(e) => setMinDate(e.target.value)}
                  placeholder="De"
                />
                <Input
                  type="date"
                  value={maxDate}
                  onChange={(e) => setMaxDate(e.target.value)}
                  placeholder="À"
                />
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget (€)
              </label>
              <div className="space-y-2">
                <Input
                  type="number"
                  placeholder="Min"
                  onChange={(e) => setMinPrice(e.target.value ? parseInt(e.target.value) * 100 : null)}
                />
                <Input
                  type="number"
                  placeholder="Max"
                  onChange={(e) => setMaxPrice(e.target.value ? parseInt(e.target.value) * 100 : null)}
                />
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Durée (jours)
              </label>
              <div className="space-y-2">
                <Input
                  type="number"
                  placeholder="Min"
                  onChange={(e) => setMinDuration(e.target.value ? parseInt(e.target.value) : null)}
                />
                <Input
                  type="number"
                  placeholder="Max"
                  onChange={(e) => setMaxDuration(e.target.value ? parseInt(e.target.value) : null)}
                />
              </div>
            </div>

            {/* Themes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Thème
              </label>
              <div className="space-y-2">
                {themes.map(theme => (
                  <label key={theme} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedThemes.includes(theme)}
                      onChange={() => toggleTheme(theme)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{theme}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Reset Filters */}
            {(minDate || maxDate || minPrice || maxPrice || minDuration || maxDuration || selectedThemes.length > 0) && (
              <Button
                variant="outline"
                size="sm"
                className="w-full"
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
              </Button>
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
                  <Card elevated hoverEffect className="h-full flex flex-col">
                    <div className="aspect-video bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center text-6xl">
                      {voyage.image}
                    </div>
                    <CardContent className="p-4 flex-1 flex flex-col">
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant="info">{voyage.daysCount} jours</Badge>
                        {available <= 5 && (
                          <Badge variant="warning">Peu de places</Badge>
                        )}
                      </div>

                      <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-2">
                        {voyage.title}
                      </h3>

                      <p className="text-sm text-gray-600 mb-2">
                        📍 {voyage.destination}
                      </p>

                      <p className="text-xs text-gray-500 mb-3">
                        Du {formatDate(voyage.startDate)} au{' '}
                        {formatDate(voyage.endDate)}
                      </p>

                      <div className="flex items-center justify-between mb-4 mt-auto">
                        <span className="text-xl font-bold text-blue-600">
                          À partir de {formatPrice(voyage.price)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-sm">
                          <span>⭐ {voyage.rating}</span>
                          <span className="text-gray-600">({voyage.reviews})</span>
                        </span>
                        <span className="text-xs text-gray-600">
                          {available} place{available !== 1 ? 's' : ''} restante{available !== 1 ? 's' : ''}
                        </span>
                      </div>

                      <Button variant="primary" size="sm" className="w-full mt-4">
                        Voir détails
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
