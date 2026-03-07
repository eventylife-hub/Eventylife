'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CampaignCard } from '@/components/marketing/campaign-card';
import { AlertCircle, Plus, TrendingUp } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

// Interface pour le dashboard marketing
interface MarketingDashboard {
  stats?: {
    activeCampaigns?: number;
    totalBudget?: number;
    totalBudgetSpent?: number;
  };
  campaigns?: Array<{
    id: string;
    title: string;
    description?: string;
    status: string;
    budget: number;
    createdAt: string;
    startDate?: string;
    endDate?: string;
  }>;
}

/**
 * Dashboard marketing pour les Pros
 * Affiche les stats globales et la liste des campagnes
 */
export default function MarketingPage() {
  const [dashboard, setDashboard] = useState<MarketingDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/marketing/dashboard', { credentials: 'include' });
        if (!res.ok) throw new Error('Erreur lors du chargement');
        const data = await res.json();
        setDashboard(data);
      } catch (err: unknown) {
        // Gestion d'erreur typée
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Une erreur inconnue est survenue');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold mb-6">Marketing</h1>
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-lg" />
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold mb-6">Marketing</h1>
          <div className="rounded-lg border border-red-200 bg-red-50 p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0" />
              <div>
                <h2 className="font-semibold text-red-900">Erreur</h2>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { stats = {}, campaigns = [] } = dashboard || {};

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Marketing</h1>
          <Link href="/pro/marketing/creer">
            <Button variant="default">
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle campagne
            </Button>
          </Link>
        </div>

        {/* Stats globales */}
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-gray-600">Campagnes actives</div>
              <div className="text-3xl font-bold mt-2">{stats.activeCampaigns || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-gray-600">Budget total</div>
              <div className="text-3xl font-bold mt-2">
                {formatPrice(stats.totalBudget || 0)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-gray-600">Budget dépensé</div>
              <div className="text-3xl font-bold mt-2">
                {formatPrice(stats.totalBudgetSpent || 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Liste des campagnes */}
        {campaigns.length === 0 ? (
          <Card>
            <CardContent className="pt-12 pb-12">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="font-semibold text-lg mb-2">Pas de campagne</h3>
                <p className="text-gray-600 mb-4">
                  Créez votre première campagne marketing pour promouvoir vos voyages
                </p>
                <Link href="/pro/marketing/creer">
                  <Button variant="default">
                    <Plus className="h-4 w-4 mr-2" />
                    Créer une campagne
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        )}

        {campaigns.length > 0 && (
          <div className="mt-8 text-sm text-gray-600 text-center">
            {campaigns.length} campagne{campaigns.length > 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
}
