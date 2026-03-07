'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertCircle, RefreshCw, CreditCard, CheckCircle } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';

/**
 * Page Versements & PayRun
 * Gestion des versements aux professionnels
 * Pattern: 4 UI states (Loading, Empty, Error, Data)
 */

interface Payout {
  id: string;
  professionalId: string;
  professionalName: string;
  amountCents: number;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  scheduledAt: string;
  completedAt?: string;
}

export default function PayoutsPage() {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPayouts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/admin/finance/payouts', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des versements');
      }

      const data = await response.json();
      setPayouts(data.items || data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayouts();
  }, []);

  const getStatusBadgeColor = (status: Payout['status']): string => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-700';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-700';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700';
      case 'FAILED':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: Payout['status']): string => {
    switch (status) {
      case 'COMPLETED':
        return 'Complété';
      case 'PROCESSING':
        return 'En cours';
      case 'PENDING':
        return 'En attente';
      case 'FAILED':
        return 'Échoué';
      default:
        return 'Inconnu';
    }
  };

  // État chargement
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/finance">
            <Button variant="ghost" size="sm" className="h-10 w-10">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Versements & PayRun</h1>
            <p className="text-gray-600 mt-2">
              Gestion des versements aux professionnels
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6 h-24 bg-gray-100 animate-pulse rounded" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // État erreur
  if (error && payouts.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/finance">
            <Button variant="ghost" size="sm" className="h-10 w-10">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Versements & PayRun</h1>
            <p className="text-gray-600 mt-2">
              Gestion des versements aux professionnels
            </p>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-700 font-medium mb-2">{error}</p>
          <p className="text-red-600 text-sm mb-4">Vérifiez votre connexion et réessayez.</p>
          <Button onClick={fetchPayouts} variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  // État vide
  if (payouts.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/finance">
            <Button variant="ghost" size="sm" className="h-10 w-10">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Versements & PayRun</h1>
            <p className="text-gray-600 mt-2">
              Gestion des versements aux professionnels
            </p>
          </div>
        </div>

        <Card>
          <CardContent className="p-12 text-center">
            <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun versement pour le moment</h3>
            <p className="text-gray-600 mb-6">
              Les versements aux professionnels s'afficheront ici une fois programmés.
            </p>
            <Link href="/admin/finance">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Retour à Finance
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // État données
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/finance">
          <Button variant="ghost" size="sm" className="h-10 w-10">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Versements & PayRun</h1>
          <p className="text-gray-600 mt-2">
            Gestion des versements aux professionnels
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {payouts.map((payout) => (
          <Card key={payout.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {payout.professionalName}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusBadgeColor(payout.status)}`}>
                      {getStatusLabel(payout.status)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    Professionnel ID: {payout.professionalId}
                  </p>
                  <p className="text-sm text-gray-600">
                    Prévu: {formatDate(payout.scheduledAt)}
                    {payout.completedAt && ` • Complété: ${formatDate(payout.completedAt)}`}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-2xl font-bold text-gray-900">
                    {formatPrice(payout.amountCents)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Montant à verser</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Link href="/admin/finance">
        <Button variant="outline" className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Retour à Finance
        </Button>
      </Link>
    </div>
  );
}
