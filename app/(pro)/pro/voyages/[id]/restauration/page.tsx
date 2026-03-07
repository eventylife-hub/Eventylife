'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { MealPlanEditor } from '@/components/restauration/meal-plan-editor';
import { RestaurantCard } from '@/components/restauration/restaurant-card';
import { AlertCircle, Loader2, FileText } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface MealPlan {
  [key: string]: Record<string, unknown>;
}

interface DietaryStats {
  total?: number;
  omnivore?: number;
  vegetarian?: number;
  vegan?: number;
  halal?: number;
  kosher?: number;
  allergies?: {
    peanut?: number;
    shellfish?: number;
    dairy?: number;
  };
}

interface Dietary {
  restrictions: string[];
  stats?: DietaryStats;
}

interface Restaurant {
  id: string;
  name: string;
  contact: string;
  phone?: string;
  cuisineType?: string;
  capacity?: number;
  address?: string;
  notes?: string;
}

interface Costs {
  totalParticipants?: number;
  breakfastPerPersonCents?: number;
  lunchPerPersonCents?: number;
  dinnerPerPersonCents?: number;
  totalCents?: number;
  costs?: {
    lunchPerPersonCents?: number;
    dinnerPerPersonCents?: number;
  };
  [key: string]: unknown;
}

/**
 * Page de gestion de la restauration pour un voyage
 * Gestion du plan de repas, préférences alimentaires et restaurants
 */
export default function RestauratPage() {
  const params = useParams();
  const travelId = params.id as string;

  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [dietary, setDietary] = useState<Dietary | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [costs, setCosts] = useState<Costs | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [
          mealRes,
          dietRes,
          restRes,
          costRes,
        ] = await Promise.all([
          fetch(`/api/restauration/${travelId}/meal-plan`, { credentials: 'include' }),
          fetch(`/api/restauration/${travelId}/dietary`, { credentials: 'include' }),
          fetch(`/api/restauration/${travelId}/restaurants`, { credentials: 'include' }),
          fetch(`/api/restauration/${travelId}/costs`, { credentials: 'include' }),
        ]);

        if (mealRes.ok) {
          const data = await mealRes.json();
          setMealPlan(data);
        }

        if (dietRes.ok) {
          const data = await dietRes.json();
          setDietary(data);
        }

        if (restRes.ok) {
          const data = await restRes.json();
          setRestaurants(data.restaurants || []);
        }

        if (costRes.ok) {
          const data = await costRes.json();
          setCosts(data);
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [travelId]);

  const handleGeneratePDF = async () => {
    try {
      const res = await fetch(`/api/restauration/${travelId}/summary-pdf`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        window.open(data.downloadUrl, '_blank');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold mb-6">Gestion de la restauration</h1>
          <div className="grid gap-6 md:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-6xl">
        <Link href={`/pro/voyages/${travelId}`} className="text-sm text-blue-600 hover:underline mb-4 inline-block">
          ← Retour au voyage
        </Link>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Gestion de la restauration</h1>
          <Button
            onClick={handleGeneratePDF}
            variant="outline"
          >
            <FileText className="h-4 w-4 mr-2" />
            Générer résumé PDF
          </Button>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {/* Plan de repas */}
          {mealPlan && (
            <Card>
              <CardHeader>
                <CardTitle>Plan de repas</CardTitle>
              </CardHeader>
              <CardContent>
                <MealPlanEditor
                  travelId={travelId}
                  initialPlan={mealPlan as unknown as any}
                />
              </CardContent>
            </Card>
          )}

          {/* Coûts */}
          {costs && (
            <Card>
              <CardHeader>
                <CardTitle>Coûts estimés</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Nombre de participants</p>
                  <p className="text-2xl font-bold">{(costs?.totalParticipants as number) || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Petit-déjeuner/personne</p>
                  <p className="text-lg">
                    {formatPrice((costs?.breakfastPerPersonCents as number) || 0)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Déjeuner/personne</p>
                  <p className="text-lg">
                    {formatPrice(((costs.costs?.lunchPerPersonCents as number) || 0))}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Dîner/personne</p>
                  <p className="text-lg">
                    {formatPrice(((costs.costs?.dinnerPerPersonCents as number) || 0))}
                  </p>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600">Total estimé</p>
                  <p className="text-3xl font-bold">
                    {formatPrice((costs.totalCents as number) || 0)}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Préférences alimentaires */}
          {dietary && (
            <Card>
              <CardHeader>
                <CardTitle>Préférences alimentaires</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Total des participants</p>
                  <p className="text-2xl font-bold">{(dietary?.stats?.total as number) || 0}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-600">Omnivore</p>
                    <p className="font-semibold">{(dietary?.stats?.omnivore as number) || 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Végétarien</p>
                    <p className="font-semibold">{(dietary?.stats?.vegetarian as number) || 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Végan</p>
                    <p className="font-semibold">{(dietary?.stats?.vegan as number) || 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Halal/Casher</p>
                    <p className="font-semibold">{((dietary?.stats?.halal as number) || 0) + ((dietary?.stats?.kosher as number) || 0)}</p>
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-xs text-gray-600">Allergies déclarées</p>
                  <div className="text-sm mt-1 space-y-1">
                    <p>Cacahuètes: {(dietary?.stats?.allergies?.peanut as number) || 0}</p>
                    <p>Fruits de mer: {(dietary?.stats?.allergies?.shellfish as number) || 0}</p>
                    <p>Produits laitiers: {(dietary?.stats?.allergies?.dairy as number) || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Restaurants partenaires */}
          <Card>
            <CardHeader>
              <CardTitle>Restaurants partenaires</CardTitle>
            </CardHeader>
            <CardContent>
              {restaurants.length === 0 ? (
                <p className="text-gray-600 text-center py-4">
                  Aucun restaurant partenaire ajouté
                </p>
              ) : (
                <div className="space-y-3">
                  {restaurants.map((rest) => (
                    <RestaurantCard key={rest.id} restaurant={rest} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
