/**
 * Page détail d'un voyage
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/lib/stores/ui-store';
import { ROUTES } from '@/lib/constants';
import { formatPrice, formatDate } from '@/lib/utils';
import { apiClient } from '@/lib/api-client';

/**
 * Interface voyage détaillé
 */
interface TravelDetail {
  id: string;
  title: string;
  destination: string;
  description: string;
  startDate: string;
  endDate: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
  daysCount: number;
  capacity: number;
  currentBookings: number;
  highlights: string[];
  itinerary: {
    day: number;
    city: string;
    activities: string[];
  }[];
  includes: string[];
  excludes: string[];
  accommodation: string;
  transport: string;
}

type LoadState = 'loading' | 'error' | 'data';

/**
 * Page détail
 */
export default function VoyagePage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const toast = useToast();
  const [state, setState] = useState<LoadState>('loading');
  const [travel, setTravel] = useState<TravelDetail | null>(null);

  useEffect(() => {
    const loadTravel = async () => {
      try {
        setState('loading');

        // Récupérer le voyage depuis l'API par slug
        const response = await apiClient.get<any>(`/travels/${params.slug}`);
        const travelData = Array.isArray(response) ? response[0] : (response?.data || response);

        if (!travelData) {
          setState('error');
          toast.error('Voyage non trouvé');
          return;
        }

        // Mapper les données du backend au format du frontend
        const mappedTravel: TravelDetail = {
          id: travelData.id,
          title: travelData.title,
          destination: travelData.destination,
          description: travelData.description || 'Découvrez ce voyage unique avec Eventy Life',
          startDate: travelData.startDate || new Date().toISOString(),
          endDate: travelData.endDate || new Date().toISOString(),
          price: travelData.pricePerPerson || travelData.price || 0,
          image: travelData.image || '✈️',
          rating: travelData.rating || 4.5,
          reviews: travelData.reviews || 0,
          daysCount: travelData.daysCount || 5,
          capacity: travelData.capacity || 50,
          currentBookings: travelData.bookings || travelData.currentBookings || 0,
          highlights: travelData.highlights || [
            'Découverte de destinations magnifiques',
            'Accompagnement humain professionnel',
            'Hébergements de qualité',
            'Transport confortable',
            'Expérience inoubliable'
          ],
          itinerary: travelData.itinerary || [],
          includes: travelData.includes || [
            'Transport en autocar',
            'Hébergement',
            'Petit-déjeuner quotidien',
            'Visites guidées',
            'Accompagnateur'
          ],
          excludes: travelData.excludes || [
            'Repas supplémentaires',
            'Entrées aux musées',
            'Assurance voyage',
            'Dépenses personnelles'
          ],
          accommodation: travelData.accommodation || 'Hôtel de qualité',
          transport: travelData.transport || 'Autocar climatisé'
        };

        setTravel(mappedTravel);
        setState('data');
      } catch (error) {
        console.error('Erreur lors du chargement du voyage:', error);
        setState('error');
        toast.error('Erreur lors du chargement du voyage');
      }
    };

    loadTravel();
  }, [params.slug, toast]);

  if (state === 'loading') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-6">
          <Skeleton height={300} />
          <Skeleton height={50} width="60%" />
          <Skeleton count={5} />
        </div>
      </div>
    );
  }

  if (state === 'error' || !travel) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-red-600 mb-4">⚠️ Erreur lors du chargement du voyage</p>
        <Button variant="primary" onClick={() => router.back()}>
          Retour
        </Button>
      </div>
    );
  }

  const available = travel.capacity - travel.currentBookings;
  const isAvailable = available > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <Link href={ROUTES.VOYAGES} className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
          ← Retour aux voyages
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contenu principal */}
        <div className="lg:col-span-2 space-y-8">
          {/* Image et infos rapides */}
          <div className="aspect-video bg-gradient-to-br from-blue-100 to-green-100 rounded-lg flex items-center justify-center text-9xl">
            {travel.image}
          </div>

          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {travel.title}
                </h1>
                <p className="text-xl text-gray-600">
                  📍 {travel.destination}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 justify-end mb-2">
                  <span className="text-3xl font-bold text-blue-600">
                    {formatPrice(travel.price)}
                  </span>
                  <span className="text-sm text-gray-600">par pers.</span>
                </div>
                <span className="flex items-center gap-1 text-sm justify-end">
                  <span>⭐ {travel.rating}</span>
                  <span className="text-gray-600">({travel.reviews} avis)</span>
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">À propos du voyage</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                {travel.description}
              </p>
              <p className="text-gray-600 text-sm">
                Dates : {formatDate(travel.startDate)} au {formatDate(travel.endDate)}
              </p>
            </CardContent>
          </Card>

          {/* Points forts */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold text-gray-900">Points forts</h2>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {travel.highlights.map((highlight, i) => (
                  <li key={i} className="flex gap-3 text-gray-700">
                    <span className="text-green-600 font-bold">✓</span>
                    {highlight}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Itinéraire */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold text-gray-900">Itinéraire détaillé</h2>
            </CardHeader>
            <CardContent className="space-y-6">
              {travel.itinerary.map((day) => (
                <div key={day.day} className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">
                    Jour {day.day} - {day.city}
                  </h3>
                  <ul className="space-y-1">
                    {day.activities.map((activity, i) => (
                      <li key={i} className="text-gray-600 text-sm flex gap-2">
                        <span>→</span> {activity}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Ce qui est inclus */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <h3 className="font-bold text-gray-900">Inclus</h3>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {travel.includes.map((item, i) => (
                    <li key={i} className="flex gap-2 text-gray-700 text-sm">
                      <span className="text-green-600">✓</span> {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="font-bold text-gray-900">Non inclus</h3>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {travel.excludes.map((item, i) => (
                    <li key={i} className="flex gap-2 text-gray-700 text-sm">
                      <span className="text-red-600">✗</span> {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Détails */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold text-gray-900">Informations pratiques</h2>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Hébergement</h4>
                <p className="text-gray-700">{travel.accommodation}</p>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Transport</h4>
                <p className="text-gray-700">{travel.transport}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Réservation */}
        <div>
          <Card elevated className="sticky top-24">
            <CardHeader>
              <h3 className="text-2xl font-bold text-gray-900">
                {formatPrice(travel.price)}
              </h3>
              <p className="text-sm text-gray-600">par personne</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Disponibilité */}
              <div className="bg-blue-50 p-4 rounded-lg">
                {isAvailable ? (
                  <>
                    <p className="font-bold text-blue-900 mb-1">Places disponibles</p>
                    <p className="text-sm text-blue-700">
                      {available} place{available !== 1 ? 's' : ''} sur {travel.capacity}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-bold text-red-900">Complet</p>
                    <p className="text-sm text-red-700">Aucune place disponible</p>
                  </>
                )}
              </div>

              {/* Dates */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Dates du voyage</p>
                <p className="text-gray-900">
                  {formatDate(travel.startDate)} au {formatDate(travel.endDate)}
                </p>
              </div>

              {/* Durée */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Durée</p>
                <p className="text-gray-900">{travel.daysCount} jours</p>
              </div>

              {/* Boutons */}
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                disabled={!isAvailable}
                onClick={() => router.push(`/voyages/${params.slug}/checkout`)}
              >
                {isAvailable ? 'Réserver maintenant' : 'Voyage complet'}
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => {
                  // Copier le lien
                  const url = typeof window !== 'undefined' ? window.location.href : '';
                  navigator.clipboard.writeText(url);
                  toast.success('Lien copié!');
                }}
              >
                Partager
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
