'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useProStore } from '@/lib/stores/pro-store';
import { CheckCircle2, Clock, BookOpen, Award, AlertCircle, RotateCcw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
export default function FormationPage() {
  const { formationModules, formationProgress, fetchFormationModules, fetchFormationProgress } =
    useProStore();
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleFetch = async () => {
      try {
        setLoading(true);
        setError(null);
        await Promise.all([fetchFormationModules(), fetchFormationProgress()]);
      } catch (_error: unknown) {
        setError('Une erreur est survenue lors du chargement de la formation');
      } finally {
        setLoading(false);
      }
    };
    handleFetch();
  }, []);

  const modules = formationModules || [
    {
      id: 'module-1',
      title: 'Créer votre premier voyage',
      description: 'Apprenez à créer et configurer votre première offre de voyage',
      duration: 15,
      icon: 'map',
    },
    {
      id: 'module-2',
      title: 'Configurer les arrêts de bus',
      description: 'Comment créer et gérer vos points de départ et arrivée',
      duration: 10,
      icon: 'bus',
    },
    {
      id: 'module-3',
      title: 'Comprendre le checkout',
      description: 'Le processus de réservation et paiement côté client',
      duration: 12,
      icon: 'credit-card',
    },
    {
      id: 'module-4',
      title: 'Gérer les participants',
      description: 'Gestion des réservations et des groupes',
      duration: 14,
      icon: 'users',
    },
    {
      id: 'module-5',
      title: 'Documents et signatures',
      description: 'Conformité légale et contrats numériques',
      duration: 20,
      icon: 'file-text',
    },
    {
      id: 'module-6',
      title: 'Marketing et promotion',
      description: 'Outils pour promouvoir vos voyages',
      duration: 18,
      icon: 'megaphone',
    },
    {
      id: 'module-7',
      title: 'Finance et paiements',
      description: 'Gestion des revenus et payouts',
      duration: 16,
      icon: 'wallet',
    },
  ];

  const completionPercentage = formationProgress?.percentage || 0;
  const moduleCount = modules.length;
  const completedCount = completedModules.length;

  const getIcon = (iconName: string) => {
    const icons: Record<string, string> = {
      map: '🗺️',
      bus: '🚌',
      'credit-card': '💳',
      users: '👥',
      'file-text': '📄',
      megaphone: '📢',
      wallet: '💰',
    };
    return icons[iconName] || '📚';
  };

  return (
    <>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    <div style={{ minHeight: '100vh', backgroundColor: '#FEFCF3', padding: '24px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 className="pro-page-title">Formation Pro</h1>
          <p style={{ color: '#64748B', marginTop: '8px' }}>
            Apprenez à maîtriser la plateforme Eventy Life avec nos modules interactifs
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{ padding: '16px', backgroundColor: '#FFE0E3', border: '1px solid #FFE0E3', borderRadius: '8px', display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
              <AlertCircle className="h-4 w-4" style={{ color: 'var(--pro-coral)', marginTop: '2px', flexShrink: 0 }} />
              <p style={{ color: 'var(--pro-coral)', fontSize: '14px' }}>{error}</p>
            </div>
            <button type="button"
              onClick={() => {
                setError(null);
                setLoading(true);
                Promise.all([fetchFormationModules(), fetchFormationProgress()])
                  .catch(() => {
                    setError('Une erreur est survenue lors du chargement de la formation');
                  })
                  .finally(() => {
                    setLoading(false);
                  });
              }}
              className="pro-btn-outline"
            >
              <RotateCcw className="w-4 h-4 mr-2" style={{ display: 'inline', marginRight: '8px' }} />
              Réessayer
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && !error && (
          <>
            <div className="pro-panel" style={{ marginBottom: '32px', borderLeft: '4px solid #0077B6' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div>
                  <div style={{ height: 24, width: 160, marginBottom: 8, borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
                  <div style={{ height: 16, width: 128, borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
                </div>
              </div>
              <div style={{ height: 12, width: '100%', borderRadius: '50%', marginBottom: 16, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
              <div style={{ height: 16, width: 96, borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
              {[...Array(6)].map((_, idx) => (
                <div key={idx} className="pro-panel" style={{ overflow: 'hidden' }}>
                  <div style={{ height: 96, borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
                  <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ height: 24, width: '75%', borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
                    <div style={{ height: 16, width: '100%', borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
                    <div style={{ height: 16, width: '50%', borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
                    <div style={{ height: 32, width: '100%', borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Progress Card */}
        {!loading && !error && (
        <div className="pro-panel" style={{ marginBottom: '32px', borderLeft: '4px solid #0077B6' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div>
              <h2 className="pro-panel-title" style={{ marginBottom: '4px' }}>Votre progression</h2>
              <p style={{ color: '#64748B', fontSize: '14px' }}>
                {completedCount} sur {moduleCount} modules complétés
              </p>
            </div>
            {completionPercentage === 100 && (
              <div style={{ backgroundColor: '#E0FFF5', padding: '8px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award className="w-5 h-5" style={{ color: 'var(--pro-mint)' }} />
                <span style={{ fontWeight: 600, color: 'var(--pro-mint)' }}>Complété!</span>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div style={{ position: 'relative', height: '12px', backgroundColor: '#E0E0E0', borderRadius: '999px', overflow: 'hidden', marginBottom: '16px' }}>
            <div
              style={{ height: '100%', backgroundColor: 'var(--pro-ocean)', borderRadius: '999px', transition: 'width 0.5s ease', width: `${completionPercentage}%` }}
            ></div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '14px' }}>
            <span style={{ color: '#64748B' }}>Progression globale</span>
            <span style={{ fontWeight: 600, color: 'var(--pro-ocean)' }}>{Math.round(completionPercentage)}%</span>
          </div>
        </div>
        )}

        {/* Modules Grid */}
        {!loading && !error && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {modules.map((module) => {
            const isCompleted = completedModules.includes(module.id);

            return (
              <div
                key={module.id}
                className="pro-panel"
                style={{ overflow: 'hidden' }}
              >
                {/* Module Header with Icon */}
                <div style={{ height: '96px', background: 'linear-gradient(135deg, #E8F7FC, #B3E5FC)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <span style={{ fontSize: '48px' }}>{getIcon(module.icon)}</span>
                  {isCompleted && (
                    <div style={{ position: 'absolute', top: '8px', right: '8px', backgroundColor: 'var(--pro-mint)', borderRadius: '999px', padding: '6px' }}>
                      <CheckCircle2 className="w-5 h-5" style={{ color: 'white' }} />
                    </div>
                  )}
                </div>

                {/* Module Content */}
                <div style={{ padding: '24px' }}>
                  <h3 style={{ fontWeight: 600, color: '#0A1628', fontSize: '16px', marginBottom: '8px' }}>{module.title}</h3>
                  <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '16px' }}>{module.description}</p>

                  {/* Duration Badge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#64748B', marginBottom: '16px' }}>
                    <Clock className="w-4 h-4" />
                    {module.duration} minutes
                  </div>

                  {/* Status Badge */}
                  <div style={{ marginBottom: '16px' }}>
                    {isCompleted ? (
                      <span style={{ display: 'inline-block', padding: '6px 12px', backgroundColor: '#E0FFF5', color: 'var(--pro-mint)', fontSize: '12px', fontWeight: 600, borderRadius: '999px' }}>
                        ✓ Terminé
                      </span>
                    ) : (
                      <span style={{ display: 'inline-block', padding: '6px 12px', backgroundColor: '#F0F0F0', color: '#4A5568', fontSize: '12px', fontWeight: 600, borderRadius: '999px' }}>
                        À faire
                      </span>
                    )}
                  </div>

                  {/* View Button */}
                  <Link
                    href={`/pro/formation/${module.id}`}
                    style={{ display: 'block', width: '100%', padding: '12px 16px', backgroundColor: '#FFF0E8', color: 'var(--pro-sun)', borderRadius: '8px', textDecoration: 'none', fontWeight: 500, fontSize: '14px', textAlign: 'center', transition: 'background-color 0.2s' }}
                  >
                    {isCompleted ? 'Revoir le module' : 'Voir le module'} →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
        )}

        {/* Certification Card */}
        {!loading && !error && completionPercentage === 100 && (
          <div style={{ marginTop: '32px', background: 'linear-gradient(to right, #E0FFF5, #E0FFF5)', border: '2px solid #06D6A0', borderRadius: '8px', padding: '32px', textAlign: 'center' }}>
            <Award className="w-12 h-12" style={{ color: 'var(--pro-mint)', margin: '0 auto 16px' }} />
            <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#0A1628', marginBottom: '8px' }}>Félicitations!</h2>
            <p style={{ color: '#64748B', marginBottom: '24px' }}>
              Vous avez complété tous les modules de formation. Vous êtes maintenant prêt(e) à créer vos
              voyages!
            </p>
            <Link
              href="/pro/voyages/nouveau"
              style={{ display: 'inline-block', padding: '12px 32px', backgroundColor: 'var(--pro-mint)', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: 500 }}
            >
              Créer mon premier voyage →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
