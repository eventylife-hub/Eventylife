/**
 * Page d'accueil
 * Présente la plateforme avec hero, voyages en vedette et témoignages
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { SkeletonGrid } from '@/components/ui/skeleton';
import { ROUTES } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';
import { apiClient } from '@/lib/api-client';

/**
 * État du composant
 */
type LoadState = 'loading' | 'empty' | 'error' | 'data';

interface FeaturedVoyage {
  id: string;
  slug: string;
  title: string;
  destination: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
  daysCount: number;
}

/**
 * Composant Hero
 */
function HeroSection() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Contenu */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Vivez des voyages
              <span className="block text-blue-600">inoubliables en groupe</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Découvrez notre plateforme de voyages organisés avec accompagnement humain porte-à-porte.
              Des circuits en bus et avion conçus pour vous.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={ROUTES.VOYAGES}>
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  Découvrir les voyages
                </Button>
              </Link>
              <Link href={ROUTES.CONTACT}>
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Nous contacter
                </Button>
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="hidden md:block">
            <div className="relative w-full h-96 bg-gradient-to-br from-blue-100 to-green-100 rounded-2xl shadow-lg overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center text-6xl">
                ✈️
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Section Recherche
 */
function SearchSection() {
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Rediriger vers les voyages avec recherche
    window.location.href = `${ROUTES.VOYAGES}?destination=${encodeURIComponent(destination)}`;
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <Card elevated>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Trouvez votre prochain voyage
            </h2>
            <form onSubmit={handleSearch} className="space-y-4">
              <Input
                label="Destination"
                placeholder="Où souhaitez-vous aller?"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
              />
              <Button
                variant="primary"
                size="lg"
                type="submit"
                isLoading={loading}
                className="w-full"
              >
                Rechercher
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

/**
 * Section Voyages en vedette
 */
function FeaturedVoyagesSection() {
  const [state, setState] = useState<LoadState>('loading');
  const [voyages, setVoyages] = useState<FeaturedVoyage[]>([]);

  useEffect(() => {
    const loadFeaturedVoyages = async () => {
      try {
        setState('loading');
        // Récupérer les voyages en vedette depuis l'API
        const response = await apiClient.get<{ data: FeaturedVoyage[] }>('/travels');
        const travelList = Array.isArray(response) ? response : (response.data || []);

        // Mapper les données du backend au format du frontend
        const mappedVoyages = travelList.slice(0, 3).map((travel: any) => ({
          id: travel.id,
          slug: travel.slug,
          title: travel.title,
          destination: travel.destination,
          price: travel.pricePerPerson || travel.price,
          image: travel.image || '✈️',
          rating: travel.rating || 4.5,
          reviews: travel.reviews || 0,
          daysCount: travel.daysCount || 5,
        }));

        setVoyages(mappedVoyages);
        setState(mappedVoyages.length > 0 ? 'data' : 'empty');
      } catch (error) {
        console.error('Erreur lors du chargement des voyages en vedette:', error);
        setState('error');
      }
    };

    loadFeaturedVoyages();
  }, []);

  if (state === 'loading') {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Voyages en vedette</h2>
          <SkeletonGrid columns={3} count={3} />
        </div>
      </section>
    );
  }

  if (state === 'error') {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-red-600 mb-4">⚠️ Erreur lors du chargement des voyages</p>
          <Link href={ROUTES.VOYAGES}>
            <Button variant="primary">Voir tous les voyages</Button>
          </Link>
        </div>
      </section>
    );
  }

  if (state === 'empty' || voyages.length === 0) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-600 mb-4">Aucun voyage disponible pour le moment.</p>
          <Link href={ROUTES.VOYAGES}>
            <Button variant="primary">Voir tous les voyages</Button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Voyages en vedette</h2>
          <Link href={ROUTES.VOYAGES}>
            <Button variant="outline">Voir tous</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {voyages.map((voyage) => (
            <Link key={voyage.id} href={ROUTES.VOYAGE_DETAIL(voyage.slug)}>
              <Card elevated hoverEffect className="h-full">
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center text-6xl">
                  {voyage.image}
                </div>
                <CardContent className="p-4">
                  <Badge variant="info" className="mb-2">
                    {voyage.daysCount} jours
                  </Badge>
                  <h3 className="font-bold text-lg text-gray-900 mb-1">
                    {voyage.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {voyage.destination}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-bold text-blue-600">
                      {formatPrice(voyage.price)}
                    </span>
                    <span className="flex items-center gap-1 text-sm">
                      <span>⭐ {voyage.rating}</span>
                      <span className="text-gray-600">({voyage.reviews})</span>
                    </span>
                  </div>
                  <Button variant="primary" size="sm" className="w-full">
                    En savoir plus
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Section Témoignages
 */
function TestimonialsSection() {
  const testimonials = [
    {
      id: '1',
      name: 'Marie Dubois',
      text: 'Un voyage magnifique! L\'accompagnement était impeccable et les sites formidables. Je recommande vivement!',
      rating: 5,
      avatar: '👩'
    },
    {
      id: '2',
      name: 'Pierre Martin',
      text: 'Une excellente expérience. Groupe convivial et guide très compétent. À refaire!',
      rating: 5,
      avatar: '👨'
    },
    {
      id: '3',
      name: 'Sophie Lefevre',
      text: 'Très bon rapport qualité-prix. Tout était bien organisé du début à la fin.',
      rating: 4,
      avatar: '👩'
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Témoignages de voyageurs
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} elevated>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-3xl">{testimonial.avatar}</div>
                  <div>
                    <h3 className="font-bold text-gray-900">{testimonial.name}</h3>
                    <div className="flex gap-1 text-sm">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <span key={i}>⭐</span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm italic">"{testimonial.text}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Section Avantages
 */
function BenefitsSection() {
  const benefits = [
    {
      icon: '🚌',
      title: 'Transport confortable',
      description: 'Autocars modernes et climatisés pour vos trajets'
    },
    {
      icon: '👥',
      title: 'Accompagnement humain',
      description: 'Guides expérimentés à vos côtés du début à la fin'
    },
    {
      icon: '🏨',
      title: 'Hébergements de qualité',
      description: 'Partenaires sélectionnés pour votre confort'
    },
    {
      icon: '💰',
      title: 'Tarifs compétitifs',
      description: 'Meilleurs prix pour des voyages de qualité'
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Pourquoi choisir Eventy Life?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, i) => (
            <Card key={i}>
              <CardContent className="p-6 text-center">
                <div className="text-5xl mb-4">{benefit.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-sm text-gray-600">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Page principale
 */
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <SearchSection />
      <FeaturedVoyagesSection />
      <BenefitsSection />
      <TestimonialsSection />

      {/* CTA Final */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-green-500">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Prêt à partir à l'aventure?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Découvrez nos plus de 50 voyages et trouvez votre destination idéale
          </p>
          <Link href={ROUTES.VOYAGES}>
            <Button variant="primary" size="lg">
              Explorer nos voyages
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
