/**
 * Page listing des voyages avec filtres
 */

'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SkeletonGrid } from '@/components/ui/skeleton';
import { ROUTES } from '@/lib/constants';
import { formatPrice, formatDate } from '@/lib/utils';
import { apiClient } from '@/lib/api-client';

/**
 * Interface pour un voyage
 */
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

/**
 * État du composant
 */
type LoadState = 'loading' | 'empty' | 'error' | 'data';

/**
 * Contenu principal
 */
function VoyagesContent() {
  const searchParams = useSearchParams();
  const [state, setState] = useState<LoadState>('loading');
  const [travels, setTravels] = useState<Travel[]>([]);
  const [filteredTravels, setFilteredTravels] = useState<Travel[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Filtres
  const [destination, setDestination] = useState(searchParams.get('destination') || '');
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState('popular');

  // Charger les données
  useEffect(() => {
    const loadTravels = async () => {
      try {
        setState('loading');
        setError(null);

        // Récupérer les voyages depuis l'API
        const response = await apiClient.get<any>('/travels');
        const travelList = Array.isArray(response) ? response : (response.data || []);

        // Mapper les données du backend au format du frontend
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

  // Appliquer les filtres
  useEffect(() => {
    let result = travels;

    // Filtre destination
    if (destination) {
      result = result.filter(t =>
        t.destination.toLowerCase().includes(destination.toLowerCase()) ||
        t.title.toLowerCase().includes(destination.toLowerCase())
      );
    }

    // Filtre prix
    if (minPrice !== null) {
      result = result.filter(t => t.price >= minPrice);
    }
    if (maxPrice !== null) {
      result = result.filter(t => t.price <= maxPrice);
    }

    // Tri (copie immuable pour éviter mutation de l'état)
    const sorted = [...result];
    if (sortBy === 'price-asc') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      sorted.sort((a, b) => b.rating - a.rating);
    }

    setFilteredTravels(sorted);
  }, [travels, destination, minPrice, maxPrice, sortBy]);

  // Rendu selon l'état
  if (state === 'loading') {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <Input
            placeholder="Rechercher une destination..."
            disabled
            className="flex-1"
          />
          <select disabled className="px-4 py-2.5 rounded-lg border-2 border-gray-300 bg-white">
            <option>Tri</option>
          </select>
        </div>
        <SkeletonGrid columns={2} count={4} />
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">⚠️ {error}</p>
        <Button variant="primary" onClick={() => window.location.reload()}>
          Réessayer
        </Button>
      </div>
    );
  }

  if (state === 'data' && filteredTravels.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">
          {travels.length === 0
            ? 'Aucun voyage disponible pour le moment.'
            : 'Aucun voyage ne correspond à vos critères de recherche.'}
        </p>
        {destination && (
          <Button
            variant="outline"
            onClick={() => setDestination('')}
          >
            Réinitialiser la recherche
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtres */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
        <h3 className="font-bold text-lg text-gray-900">Filtres</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Destination"
            placeholder="Chercher..."
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
          
          <Input
            label="Prix minimum (€)"
            type="number"
            placeholder="0"
            onChange={(e) => setMinPrice(e.target.value ? parseInt(e.target.value) * 100 : null)}
          />
          
          <Input
            label="Prix maximum (€)"
            type="number"
            placeholder="10000"
            onChange={(e) => setMaxPrice(e.target.value ? parseInt(e.target.value) * 100 : null)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Trier par
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          >
            <option value="popular">Plus populaires</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
            <option value="rating">Meilleure notation</option>
          </select>
        </div>
      </div>

      {/* Résultats */}
      <div>
        <p className="text-gray-600 mb-4">
          {filteredTravels.length} voyage{filteredTravels.length !== 1 ? 's' : ''} trouvé{filteredTravels.length !== 1 ? 's' : ''}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTravels.map((voyage) => {
            const available = voyage.capacity - voyage.currentBookings;
            
            return (
              <Link key={voyage.id} href={ROUTES.VOYAGE_DETAIL(voyage.slug)}>
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

                    <div className="flex items-center justify-between mb-4">
                      <span className="flex items-center gap-1 text-sm">
                        <span>⭐ {voyage.rating}</span>
                        <span className="text-gray-600">({voyage.reviews})</span>
                      </span>
                      <span className="text-xs text-gray-600">
                        {available} place{available !== 1 ? 's' : ''} restante{available !== 1 ? 's' : ''}
                      </span>
                    </div>

                    <Button variant="primary" size="sm" className="w-full">
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
  );
}

/**
 * Page voyages
 */
export default function VoyagesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Nos voyages</h1>
        <p className="text-lg text-gray-600">
          Découvrez notre sélection de voyages en groupe avec accompagnement humain
        </p>
      </div>

      <Suspense fallback={<SkeletonGrid columns={2} count={4} />}>
        <VoyagesContent />
      </Suspense>
    </div>
  );
}
