'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
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
          const data = (await mealRes.json() as unknown) as unknown;
          setMealPlan(data);
        }

        if (dietRes.ok) {
          const data = (await dietRes.json() as unknown) as unknown;
          setDietary(data);
        }

        if (restRes.ok) {
          const data = (await restRes.json() as unknown) as unknown;
          setRestaurants(data.restaurants || []);
        }

        if (costRes.ok) {
          const data = (await costRes.json() as unknown) as unknown;
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
        const data = (await res.json() as unknown) as unknown;
        window.open(data.downloadUrl, '_blank');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    }
  };

  if (loading) {
    return (
      <div className="pro-fade-in min-h-screen p-6" style={{ background: 'linear-gradient(135deg, #FEFCF3 0%, #F0E6D8 100%)' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#0A1628' }}>Gestion de la restauration</h1>
          <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            {[...Array(4)].map((_: unknown, i: number) => (
              <Skeleton key={i} className="h-48 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pro-fade-in min-h-screen p-6" style={{ background: 'linear-gradient(135deg, #FEFCF3 0%, #F0E6D8 100%)' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
        <Link href={`/pro/voyages/${travelId}`} style={{ fontSize: '0.875rem', color: 'var(--pro-ocean)', textDecoration: 'none', marginBottom: '1rem', display: 'inline-block' }}>
          ← Retour au voyage
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#0A1628', margin: 0 }}>Gestion de la restauration</h1>
          <button
            onClick={handleGeneratePDF}
            className="pro-btn-outline"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <FileText style={{ width: '1rem', height: '1rem' }} />
            Générer résumé PDF
          </button>
        </div>

        {error && (
          <div style={{ padding: '1rem', background: '#FFE0E3', border: '1px solid #E63946', borderRadius: '0.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <AlertCircle style={{ width: '1.25rem', height: '1.25rem', color: 'var(--pro-coral)', flexShrink: 0, marginTop: '0.125rem' }} />
            <p style={{ fontSize: '0.875rem', color: 'var(--pro-coral)', margin: 0 }}>{error}</p>
          </div>
        )}

        <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))' }}>
          {/* Plan de repas */}
          {mealPlan && (
            <div className="pro-panel">
              <div className="pro-panel-header">
                <h3 className="pro-panel-title">Plan de repas</h3>
              </div>
              <div className="pro-panel-body">
                <MealPlanEditor
                  travelId={travelId}
                  initialPlan={mealPlan as unknown as unknown}
                />
              </div>
            </div>
          )}

          {/* Coûts */}
          {costs && (
            <div className="pro-panel">
              <div className="pro-panel-header">
                <h3 className="pro-panel-title">Coûts estimés</h3>
              </div>
              <div className="pro-panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#4A5568', margin: 0 }}>Nombre de participants</p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0A1628', margin: 0 }}>{(costs?.totalParticipants as number) || 0}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#4A5568', margin: 0 }}>Petit-déjeuner/personne</p>
                  <p style={{ fontSize: '1.125rem', color: '#0A1628', margin: 0 }}>
                    {formatPrice((costs?.breakfastPerPersonCents as number) || 0)}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#4A5568', margin: 0 }}>Déjeuner/personne</p>
                  <p style={{ fontSize: '1.125rem', color: '#0A1628', margin: 0 }}>
                    {formatPrice(((costs.costs?.lunchPerPersonCents as number) || 0))}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#4A5568', margin: 0 }}>Dîner/personne</p>
                  <p style={{ fontSize: '1.125rem', color: '#0A1628', margin: 0 }}>
                    {formatPrice(((costs.costs?.dinnerPerPersonCents as number) || 0))}
                  </p>
                </div>
                <div style={{ paddingTop: '1rem', borderTop: '1px solid #E2E8F0', marginTop: '1rem' }}>
                  <p style={{ fontSize: '0.875rem', color: '#4A5568', margin: 0 }}>Total estimé</p>
                  <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#0A1628', margin: 0 }}>
                    {formatPrice((costs.totalCents as number) || 0)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Préférences alimentaires */}
          {dietary && (
            <div className="pro-panel">
              <div className="pro-panel-header">
                <h3 className="pro-panel-title">Préférences alimentaires</h3>
              </div>
              <div className="pro-panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#4A5568', margin: 0 }}>Total des participants</p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0A1628', margin: 0 }}>{(dietary?.stats?.total as number) || 0}</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', fontSize: '0.875rem' }}>
                  <div>
                    <p style={{ color: '#4A5568', margin: 0 }}>Omnivore</p>
                    <p style={{ fontWeight: '600', color: '#0A1628', margin: 0 }}>{(dietary?.stats?.omnivore as number) || 0}</p>
                  </div>
                  <div>
                    <p style={{ color: '#4A5568', margin: 0 }}>Végétarien</p>
                    <p style={{ fontWeight: '600', color: '#0A1628', margin: 0 }}>{(dietary?.stats?.vegetarian as number) || 0}</p>
                  </div>
                  <div>
                    <p style={{ color: '#4A5568', margin: 0 }}>Végan</p>
                    <p style={{ fontWeight: '600', color: '#0A1628', margin: 0 }}>{(dietary?.stats?.vegan as number) || 0}</p>
                  </div>
                  <div>
                    <p style={{ color: '#4A5568', margin: 0 }}>Halal/Casher</p>
                    <p style={{ fontWeight: '600', color: '#0A1628', margin: 0 }}>{((dietary?.stats?.halal as number) || 0) + ((dietary?.stats?.kosher as number) || 0)}</p>
                  </div>
                </div>
                <div style={{ paddingTop: '0.5rem', borderTop: '1px solid #E2E8F0', marginTop: '0.5rem' }}>
                  <p style={{ fontSize: '0.75rem', color: '#4A5568', margin: '0 0 0.25rem 0' }}>Allergies déclarées</p>
                  <div style={{ fontSize: '0.875rem', marginTop: '0.25rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <p style={{ color: '#0A1628', margin: 0 }}>Cacahuètes: {(dietary?.stats?.allergies?.peanut as number) || 0}</p>
                    <p style={{ color: '#0A1628', margin: 0 }}>Fruits de mer: {(dietary?.stats?.allergies?.shellfish as number) || 0}</p>
                    <p style={{ color: '#0A1628', margin: 0 }}>Produits laitiers: {(dietary?.stats?.allergies?.dairy as number) || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Restaurants partenaires */}
          <div className="pro-panel">
            <div className="pro-panel-header">
              <h3 className="pro-panel-title">Restaurants partenaires</h3>
            </div>
            <div className="pro-panel-body">
              {restaurants.length === 0 ? (
                <p style={{ color: '#4A5568', textAlign: 'center', paddingTop: '1rem', paddingBottom: '1rem', margin: 0 }}>
                  Aucun restaurant partenaire ajouté
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {restaurants.map((rest: unknown) => (
                    <RestaurantCard key={rest.id} restaurant={rest} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
