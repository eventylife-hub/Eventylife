'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { RestaurantCard } from '@/components/restauration/restaurant-card';
import { AlertCircle, Loader2, FileText } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { logger } from '@/lib/logger';
import { extractErrorMessage } from '@/lib/api-error';

const MealPlanEditor = dynamic(
  () => import('@/components/restauration/meal-plan-editor').then((m) => m.MealPlanEditor),
  { loading: () => <div className="animate-pulse rounded-xl h-64" style={{ background: 'rgba(0,0,0,0.06)' }} /> }
);
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
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        setLoading(true);

        const [
          mealRes,
          dietRes,
          restRes,
          costRes,
        ] = await Promise.all([
          fetch(`/api/restauration/${travelId}/meal-plan`, { credentials: 'include', signal: controller.signal }),
          fetch(`/api/restauration/${travelId}/dietary`, { credentials: 'include', signal: controller.signal }),
          fetch(`/api/restauration/${travelId}/restaurants`, { credentials: 'include', signal: controller.signal }),
          fetch(`/api/restauration/${travelId}/costs`, { credentials: 'include', signal: controller.signal }),
        ]);

        if (mealRes.ok) {
          const data: MealPlan = await mealRes.json();
          setMealPlan(data);
        } else {
          logger.warn('API /restauration/meal-plan indisponible — données démo');
          setMealPlan({
            'Jour 1': { breakfast: 'Buffet français', lunch: 'Cuisine lyonnaise', dinner: 'Menu régional' },
            'Jour 2': { breakfast: 'Petit-déjeuner continental', lunch: 'Spécialités bourguignonnes', dinner: 'Repas libre' }
          });
        }

        if (dietRes.ok) {
          const data: Dietary = await dietRes.json();
          setDietary(data);
        } else {
          logger.warn('API /restauration/dietary indisponible — données démo');
          setDietary({
            restrictions: ['vegetarian', 'vegan', 'halal'],
            stats: {
              total: 42,
              omnivore: 28,
              vegetarian: 8,
              vegan: 4,
              halal: 2,
              kosher: 0,
              allergies: {
                peanut: 2,
                shellfish: 1,
                dairy: 3
              }
            }
          });
        }

        if (restRes.ok) {
          const data: { restaurants: Restaurant[] } = await restRes.json();
          setRestaurants(data.restaurants || []);
        } else {
          logger.warn('API /restauration/restaurants indisponible — données démo');
          setRestaurants([
            {
              id: 'demo-rest-1',
              name: 'Les Trois Chemins',
              contact: 'Michel Dupont',
              phone: '+33 4 72 12 34 56',
              cuisineType: 'Français traditionnel',
              capacity: 60,
              address: '15 Rue Saint-Jean, 69005 Lyon',
              notes: 'Spécialités lyonnaises'
            },
            {
              id: 'demo-rest-2',
              name: 'La Bourgogne Gourmande',
              contact: 'Sophie Martin',
              phone: '+33 3 80 45 67 89',
              cuisineType: 'Bourguignon',
              capacity: 50,
              address: 'Place Royale, 21200 Beaune',
              notes: 'Menus régionaux adaptés'
            }
          ]);
        }

        if (costRes.ok) {
          const data: Costs = await costRes.json();
          setCosts(data);
        } else {
          logger.warn('API /restauration/costs indisponible — données démo');
          setCosts({
            totalParticipants: 42,
            breakfastPerPersonCents: 1200,
            lunchPerPersonCents: 2500,
            dinnerPerPersonCents: 3000,
            totalCents: 275400,
            costs: {
              lunchPerPersonCents: 2500,
              dinnerPerPersonCents: 3000
            }
          });
        }

        setError(null);
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        logger.warn('API /restauration indisponible — données démo');

        // Fallback demo data for all endpoints
        setMealPlan({
          'Jour 1': { breakfast: 'Buffet français', lunch: 'Cuisine lyonnaise', dinner: 'Menu régional' },
          'Jour 2': { breakfast: 'Petit-déjeuner continental', lunch: 'Spécialités bourguignonnes', dinner: 'Repas libre' }
        });

        setDietary({
          restrictions: ['vegetarian', 'vegan', 'halal'],
          stats: {
            total: 42,
            omnivore: 28,
            vegetarian: 8,
            vegan: 4,
            halal: 2,
            kosher: 0,
            allergies: {
              peanut: 2,
              shellfish: 1,
              dairy: 3
            }
          }
        });

        setRestaurants([
          {
            id: 'demo-rest-1',
            name: 'Les Trois Chemins',
            contact: 'Michel Dupont',
            phone: '+33 4 72 12 34 56',
            cuisineType: 'Français traditionnel',
            capacity: 60,
            address: '15 Rue Saint-Jean, 69005 Lyon',
            notes: 'Spécialités lyonnaises'
          },
          {
            id: 'demo-rest-2',
            name: 'La Bourgogne Gourmande',
            contact: 'Sophie Martin',
            phone: '+33 3 80 45 67 89',
            cuisineType: 'Bourguignon',
            capacity: 50,
            address: 'Place Royale, 21200 Beaune',
            notes: 'Menus régionaux adaptés'
          }
        ]);

        setCosts({
          totalParticipants: 42,
          breakfastPerPersonCents: 1200,
          lunchPerPersonCents: 2500,
          dinnerPerPersonCents: 3000,
          totalCents: 275400,
          costs: {
            lunchPerPersonCents: 2500,
            dinnerPerPersonCents: 3000
          }
        });

        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, [travelId]);

  const handleGeneratePDF = async () => {
    try {
      const res = await fetch(`/api/restauration/${travelId}/summary-pdf`, { credentials: 'include' });
      if (res.ok) {
        const data = (await res.json()) as Record<string, unknown>;
        window.open(data.downloadUrl, '_blank');
      }
    } catch (err: unknown) {
      setError(extractErrorMessage(err, 'Erreur inconnue'));
    }
  };

  if (loading) {
    return (
    <>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
      <div className="pro-fade-in min-h-screen p-6" style={{ background: 'linear-gradient(135deg, #FEFCF3 0%, #F0E6D8 100%)' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#0A1628' }}>Gestion de la restauration</h1>
          <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ height: 192, borderRadius: 8, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
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
          <button type="button"
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
                  initialPlan={mealPlan}
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
                <div style={{ textAlign: 'center', paddingTop: '2rem', paddingBottom: '2rem' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🍽️</div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#0A1628', marginBottom: '0.25rem' }}>Aucun restaurant partenaire</h4>
                  <p style={{ color: '#64748B', margin: 0, fontSize: '0.875rem' }}>Ajoutez des restaurants pour la restauration du voyage</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {restaurants.map((rest) => (
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
