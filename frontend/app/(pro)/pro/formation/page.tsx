'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useProStore } from '@/lib/stores/pro-store';
import { CheckCircle2, Clock, BookOpen, Award, AlertCircle, RotateCcw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

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
      } catch (_error) {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Formation Pro</h1>
          <p className="text-slate-600 mt-2">
            Apprenez à maîtriser la plateforme Eventy Life avec nos modules interactifs
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6">
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="ml-3 text-red-800">
                {error}
              </AlertDescription>
            </Alert>
            <div className="mt-4">
              <Button
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
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Réessayer
              </Button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && !error && (
          <>
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8 border-l-4 border-indigo-600">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <Skeleton className="h-6 w-40 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
              <Skeleton className="h-3 w-full rounded-full mb-4" />
              <Skeleton className="h-4 w-24" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, idx) => (
                <div key={idx} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                  <Skeleton className="h-24" />
                  <div className="p-6 space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Progress Card */}
        {!loading && !error && (
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8 border-l-4 border-indigo-600">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Votre progression</h2>
              <p className="text-slate-600 text-sm">
                {completedCount} sur {moduleCount} modules complétés
              </p>
            </div>
            {completionPercentage === 100 && (
              <div className="bg-green-100 px-4 py-2 rounded-lg flex items-center gap-2">
                <Award className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-700">Complété!</span>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="relative h-3 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="absolute h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-slate-600">Progression globale</span>
            <span className="font-bold text-indigo-600">{Math.round(completionPercentage)}%</span>
          </div>
        </div>
        )}

        {/* Modules Grid */}
        {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => {
            const isCompleted = completedModules.includes(module.id);

            return (
              <div
                key={module.id}
                className="bg-white rounded-lg shadow-sm border border-slate-200 hover:shadow-lg transition-shadow overflow-hidden"
              >
                {/* Module Header with Icon */}
                <div className="h-24 bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center relative">
                  <span className="text-5xl">{getIcon(module.icon)}</span>
                  {isCompleted && (
                    <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>

                {/* Module Content */}
                <div className="p-6">
                  <h3 className="font-bold text-slate-900 text-lg mb-2">{module.title}</h3>
                  <p className="text-sm text-slate-600 mb-4">{module.description}</p>

                  {/* Duration Badge */}
                  <div className="flex items-center gap-2 text-xs text-slate-600 mb-4">
                    <Clock className="w-4 h-4" />
                    {module.duration} minutes
                  </div>

                  {/* Status Badge */}
                  <div className="mb-4">
                    {isCompleted ? (
                      <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                        ✓ Terminé
                      </span>
                    ) : (
                      <span className="inline-block px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full">
                        À faire
                      </span>
                    )}
                  </div>

                  {/* View Button */}
                  <Link
                    href={`/pro/formation/${module.id}`}
                    className="w-full py-2 bg-indigo-50 text-indigo-600 rounded hover:bg-indigo-100 font-medium text-sm transition-colors"
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
          <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-8 text-center">
            <Award className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Félicitations!</h2>
            <p className="text-slate-600 mb-6">
              Vous avez complété tous les modules de formation. Vous êtes maintenant prêt(e) à créer vos
              voyages!
            </p>
            <Link
              href="/pro/voyages/nouveau"
              className="inline-block px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
            >
              Créer mon premier voyage →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
