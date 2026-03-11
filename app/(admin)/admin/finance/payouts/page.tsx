'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
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

      const data = (await response.json() as unknown) as unknown;
      setPayouts(data?.items || data || []);
    } catch (err: unknown) {
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
        return 'admin-badge admin-badge-success';
      case 'PROCESSING':
        return 'admin-badge admin-badge-info';
      case 'PENDING':
        return 'admin-badge admin-badge-warning';
      case 'FAILED':
        return 'admin-badge admin-badge-danger';
      default:
        return 'admin-badge admin-badge-neutral';
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
        <div className="admin-page-header">
          <div>
            <div className="admin-breadcrumb">Finance › Versements</div>
            <h1 className="admin-page-title">Versements & PayRun</h1>
          </div>
          <Link href="/admin/finance" className="admin-btn-secondary">
            ← Retour
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {[...Array(3)].map((_: unknown, i: number) => (
            <div key={i} className="admin-panel">
              <div className="admin-panel-body" style={{ height: '100px', background: 'var(--admin-surface-alt)', borderRadius: '8px', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // État erreur
  if (error && payouts.length === 0) {
    return (
      <div className="space-y-6">
        <div className="admin-page-header">
          <div>
            <div className="admin-breadcrumb">Finance › Versements</div>
            <h1 className="admin-page-title">Versements & PayRun</h1>
          </div>
          <Link href="/admin/finance" className="admin-btn-secondary">
            ← Retour
          </Link>
        </div>

        <div className="admin-alert-bar danger">
          <span>{error}</span>
          <button className="ml-4 text-sm font-medium hover:underline" onClick={fetchPayouts}>
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  // État vide
  if (payouts.length === 0) {
    return (
      <div className="space-y-6">
        <div className="admin-page-header">
          <div>
            <div className="admin-breadcrumb">Finance › Versements</div>
            <h1 className="admin-page-title">Versements & PayRun</h1>
          </div>
          <Link href="/admin/finance" className="admin-btn-secondary">
            ← Retour
          </Link>
        </div>

        <div className="admin-panel">
          <div className="admin-panel-body" style={{ textAlign: 'center', padding: '48px 24px' }}>
            <CreditCard className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--admin-text-muted)' }} />
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--admin-text-primary)', marginBottom: '8px' }}>Aucun versement pour le moment</h3>
            <p style={{ color: 'var(--admin-text-secondary)', marginBottom: '24px' }}>
              Les versements aux professionnels s'afficheront ici une fois programmés.
            </p>
            <Link href="/admin/finance" className="admin-btn-secondary">
              ← Retour à Finance
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // État données
  return (
    <div className="space-y-6">
      <div className="admin-page-header">
        <div>
          <div className="admin-breadcrumb">Finance › Versements</div>
          <h1 className="admin-page-title">Versements & PayRun</h1>
        </div>
        <Link href="/admin/finance" className="admin-btn-secondary">
          ← Retour
        </Link>
      </div>

      <div className="space-y-4">
        {payouts.map((payout: unknown) => (
          <div key={payout.id} className="admin-panel">
            <div className="admin-panel-body">
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--admin-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {payout.professionalName}
                    </h3>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '500',
                      whiteSpace: 'nowrap',
                      background: payout.status === 'COMPLETED' ? 'var(--admin-mint-soft)' : payout.status === 'PROCESSING' ? 'var(--admin-ocean-light)' : payout.status === 'PENDING' ? 'var(--admin-coral-soft)' : 'var(--admin-surface-alt)',
                      color: payout.status === 'COMPLETED' ? 'var(--admin-success)' : payout.status === 'PROCESSING' ? 'var(--admin-ocean)' : payout.status === 'PENDING' ? 'var(--admin-coral)' : 'var(--admin-text-secondary)',
                    }}>
                      {getStatusLabel(payout.status)}
                    </span>
                  </div>
                  <p style={{ fontSize: '14px', color: 'var(--admin-text-secondary)', marginBottom: '4px' }}>
                    Professionnel ID: {payout.professionalId}
                  </p>
                  <p style={{ fontSize: '14px', color: 'var(--admin-text-secondary)' }}>
                    Prévu: {formatDate(payout.scheduledAt)}
                    {payout.completedAt && ` • Complété: ${formatDate(payout.completedAt)}`}
                  </p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ fontSize: '20px', fontWeight: '700', color: 'var(--admin-text-primary)' }}>
                    {formatPrice(payout.amountCents)}
                  </p>
                  <p style={{ fontSize: '12px', color: 'var(--admin-text-secondary)', marginTop: '4px' }}>Montant à verser</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Link href="/admin/finance" className="admin-btn-secondary">
        ← Retour à Finance
      </Link>
    </div>
  );
}
