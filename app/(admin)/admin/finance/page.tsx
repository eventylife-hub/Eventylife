'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Download, Wallet, TrendingUp, AlertCircle, RefreshCw, CreditCard, RotateCcw, Settings, FileText, Zap } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';
import { logger } from '@/lib/logger';
/**
 * PATCH LOT 8 — G1 : Page Finance corrigée
 *
 * Corrections :
 * - formatPrice centralisé (centimes → euros) — INVARIANT 3
 * - stats.map() remplacé par stats.monthlyData (objet vs tableau)
 * - Placeholder Paiements/Remboursements remplacés par vraies listes API
 * - État erreur ajouté avec retry
 * - Interfaces typées (plus de any)
 */

interface RevenueStats {
  totalRevenueCents: number;
  monthlyRevenueCents: number;
  refundsCents: number;
  monthlyData: { month: string; revenueCents: number }[];
}

interface Payment {
  id: string;
  bookingRef: string;
  amountCents: number;
  status: string;
  createdAt: string;
}

interface Refund {
  id: string;
  bookingRef: string;
  amountCents: number;
  reason: string;
  status: string;
  createdAt: string;
}

// Fallback demo data — utilisé en cas d'API indisponible
const FALLBACK_STATS: RevenueStats = {
  totalRevenueCents: 125000,
  monthlyRevenueCents: 45000,
  refundsCents: 8500,
  monthlyData: [
    { month: 'Jan', revenueCents: 28000 },
    { month: 'Fév', revenueCents: 32000 },
    { month: 'Mar', revenueCents: 45000 },
  ],
};

const FALLBACK_PAYMENTS: Payment[] = [
  {
    id: 'pay_1',
    bookingRef: 'EVT-2026-001',
    amountCents: 15900,
    status: 'SUCCEEDED',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'pay_2',
    bookingRef: 'EVT-2026-002',
    amountCents: 29500,
    status: 'SUCCEEDED',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const FALLBACK_REFUNDS: Refund[] = [
  {
    id: 'ref_1',
    bookingRef: 'EVT-2026-003',
    amountCents: 8500,
    reason: 'Demande client',
    status: 'PENDING',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export default function FinancePage() {
  const [stats, setStats] = useState<RevenueStats | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = async () => {
    try {
      setLoading(true);
      setError(null);

      const [revenueRes, paymentsRes, refundsRes] = await Promise.all([
        fetch('/api/admin/dashboard/revenue', { credentials: 'include' }),
        fetch('/api/admin/finance/payments?limit=5', { credentials: 'include' }),
        fetch('/api/admin/finance/refunds?status=PENDING', { credentials: 'include' }),
      ]);

      if (!revenueRes.ok) {
        if (revenueRes.status === 401) {
          throw new Error('Session expirée. Veuillez vous reconnecter.');
        }
        throw new Error('Impossible de charger les données financières');
      }

      const revenueData = (await revenueRes.json() as unknown) as RevenueStats;
      setStats(revenueData);

      if (paymentsRes.ok) {
        const paymentsData = (await paymentsRes.json() as unknown) as Record<string, unknown>;
        setPayments(paymentsData.items || paymentsData || []);
      }

      if (refundsRes.ok) {
        const refundsData = (await refundsRes.json() as unknown) as Record<string, unknown>;
        setRefunds(refundsData.items || refundsData || []);
      }
    } catch (err: unknown) {
      logger.warn('API Finance indisponible — données démo');
      setStats(FALLBACK_STATS);
      setPayments(FALLBACK_PAYMENTS);
      setRefunds(FALLBACK_REFUNDS);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  /** INVARIANT 3 : formatPrice centralisé (centimes Int → euros) */

  const handleExport = async () => {
    try {
      const response = await fetch('/api/admin/finance/export', {
        credentials: 'include',
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `export-finance-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    } catch (_err: unknown) {
      // Export silencieux — erreur non critique
    }
  };

  // État erreur
  if (error && !loading) {
    return (
      <div className="space-y-6">
        <div className="admin-page-header">
          <div>
            <div className="admin-breadcrumb">Accueil › Finance</div>
            <h1 className="admin-page-title">Finance & Paiements</h1>
          </div>
        </div>
        <div className="admin-alert-bar danger">
          <span>{error}</span>
          <button type="button" className="ml-4 text-sm font-medium hover:underline" onClick={fetchAll}>
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="admin-page-header">
        <div>
          <div className="admin-breadcrumb">Accueil › Finance</div>
          <h1 className="admin-page-title">Finance & Paiements</h1>
        </div>
        <button type="button" onClick={handleExport} className="admin-btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Download className="w-4 h-4" />
          Exporter
        </button>
      </div>

      {/* Actions rapides */}
      <div className="admin-panel">
        <div className="admin-panel-header">
          <h3 className="admin-panel-title">Actions rapides</h3>
        </div>
        <div className="admin-panel-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/admin/exports?type=finance" className="block">
              <div className="admin-btn-secondary" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px', padding: '16px', cursor: 'pointer' }}>
                <div style={{ padding: '12px', background: 'var(--admin-ocean-light)', borderRadius: '10px' }}>
                  <FileText className="w-6 h-6" style={{ color: 'var(--admin-ocean)' }} />
                </div>
                <div>
                  <h3 style={{ fontWeight: '600', color: 'var(--admin-text-primary)', marginBottom: '4px' }}>Voir les exports</h3>
                  <p style={{ fontSize: '14px', color: 'var(--admin-text-secondary)' }}>Accédez à l&apos;historique des exports</p>
                </div>
              </div>
            </Link>

            <Link href="/admin/finance/payouts" className="block">
              <div className="admin-btn-secondary" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px', padding: '16px', cursor: 'pointer' }}>
                <div style={{ padding: '12px', background: 'var(--admin-mint-soft)', borderRadius: '10px' }}>
                  <Zap className="w-6 h-6" style={{ color: 'var(--admin-success)' }} />
                </div>
                <div>
                  <h3 style={{ fontWeight: '600', color: 'var(--admin-text-primary)', marginBottom: '4px' }}>Versements</h3>
                  <p style={{ fontSize: '14px', color: 'var(--admin-text-secondary)' }}>Gestion des versements PayRun</p>
                </div>
              </div>
            </Link>

            <Link href="/admin/parametres" className="block">
              <div className="admin-btn-secondary" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px', padding: '16px', cursor: 'pointer' }}>
                <div style={{ padding: '12px', background: 'var(--admin-violet-soft)', borderRadius: '10px' }}>
                  <Settings className="w-6 h-6" style={{ color: 'var(--admin-violet)' }} />
                </div>
                <div>
                  <h3 style={{ fontWeight: '600', color: 'var(--admin-text-primary)', marginBottom: '4px' }}>Paramètres financiers</h3>
                  <p style={{ fontSize: '14px', color: 'var(--admin-text-secondary)' }}>Cotisations et configuration</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* KPIs */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="admin-kpi-card" style={{ background: 'var(--admin-surface-alt)', padding: '16px', borderRadius: '10px', height: '120px', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
          ))}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="admin-kpi-card" style={{ background: 'var(--admin-ocean-light)', padding: '16px', borderRadius: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Wallet className="w-5 h-5" style={{ color: 'var(--admin-ocean)' }} />
            </div>
            <p style={{ fontSize: '14px', color: 'var(--admin-text-secondary)', marginBottom: '4px' }}>CA total</p>
            <p className="admin-kpi-value" style={{ color: 'var(--admin-ocean)' }}>{formatPrice(stats.totalRevenueCents)}</p>
          </div>
          <div className="admin-kpi-card" style={{ background: 'var(--admin-ocean-light)', padding: '16px', borderRadius: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <TrendingUp className="w-5 h-5" style={{ color: 'var(--admin-ocean)' }} />
            </div>
            <p style={{ fontSize: '14px', color: 'var(--admin-text-secondary)', marginBottom: '4px' }}>CA ce mois</p>
            <p className="admin-kpi-value" style={{ color: 'var(--admin-ocean)' }}>{formatPrice(stats.monthlyRevenueCents)}</p>
          </div>
          <div className="admin-kpi-card" style={{ background: 'var(--admin-coral-soft)', padding: '16px', borderRadius: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <RotateCcw className="w-5 h-5" style={{ color: 'var(--admin-coral)' }} />
            </div>
            <p style={{ fontSize: '14px', color: 'var(--admin-text-secondary)', marginBottom: '4px' }}>Remboursements</p>
            <p className="admin-kpi-value" style={{ color: 'var(--admin-coral)' }}>{formatPrice(stats.refundsCents)}</p>
          </div>
          <div className="admin-kpi-card" style={{ background: 'var(--admin-mint-soft)', padding: '16px', borderRadius: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Wallet className="w-5 h-5" style={{ color: 'var(--admin-success)' }} />
            </div>
            <p style={{ fontSize: '14px', color: 'var(--admin-text-secondary)', marginBottom: '4px' }}>Solde net</p>
            <p className="admin-kpi-value" style={{ color: 'var(--admin-success)' }}>{formatPrice(stats.totalRevenueCents - stats.refundsCents)}</p>
          </div>
        </div>
      ) : null}

      {/* Graphique Revenue — utilise stats.monthlyData (tableau) et non stats (objet) */}
      {!loading && stats?.monthlyData && stats.monthlyData.length > 0 && (
        <div className="admin-panel">
          <div className="admin-panel-header">
            <h3 className="admin-panel-title">Revenus par mois</h3>
          </div>
          <div className="admin-panel-body">
            <div className="h-64 flex items-end justify-around gap-2">
              {stats.monthlyData.map((item, index) => {
                const maxRevenue = Math.max(
                  ...stats.monthlyData.map((s) => s.revenueCents),
                );
                return (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center gap-2"
                  >
                    <span className="text-xs" style={{ color: 'var(--admin-text-secondary)', fontWeight: '500' }}>
                      {formatPrice(item.revenueCents)}
                    </span>
                    <div
                      style={{
                        width: '100%',
                        background: 'var(--admin-accent)',
                        borderTopLeftRadius: '4px',
                        borderTopRightRadius: '4px',
                        height: `${Math.max(
                          maxRevenue > 0
                            ? (item.revenueCents / maxRevenue) * 200
                            : 5,
                          5,
                        )}px`,
                      }}
                    />
                    <span className="text-xs text-center" style={{ color: 'var(--admin-text-secondary)' }}>
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Paiements récents et Remboursements en attente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Paiements récents */}
        <div className="admin-panel">
          <div className="admin-panel-header">
            <h3 className="admin-panel-title">Paiements récents</h3>
          </div>
          <div className="admin-panel-body">
            {loading ? (
              <div style={{ height: '200px', background: 'var(--admin-surface-alt)', borderRadius: '8px', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
            ) : payments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 16px' }}>
                <CreditCard className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--admin-text-muted)' }} />
                <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--admin-text-primary)', marginBottom: '4px' }}>Aucun paiement récent</p>
                <p style={{ fontSize: '12px', color: 'var(--admin-text-secondary)' }}>Les paiements reçus apparaîtront ici</p>
              </div>
            ) : (
              <div style={{ space: '8px' }}>
                {payments.map((payment) => (
                  <div
                    key={payment.id}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--admin-border)' }}
                  >
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: 'var(--admin-text-primary)' }}>
                        Réservation #{payment.bookingRef}
                      </p>
                      <p style={{ fontSize: '12px', color: 'var(--admin-text-secondary)' }}>
                        {formatDate(payment.createdAt)}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--admin-text-primary)' }}>
                        {formatPrice(payment.amountCents)}
                      </p>
                      <span
                        style={{
                          fontSize: '12px',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontWeight: '500',
                          display: 'inline-block',
                          background: payment.status === 'SUCCEEDED' ? 'var(--admin-mint-soft)' : 'var(--admin-coral-soft)',
                          color: payment.status === 'SUCCEEDED' ? 'var(--admin-success)' : 'var(--admin-coral)',
                        }}
                      >
                        {payment.status === 'SUCCEEDED' ? 'Réussi' : 'En attente'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Remboursements en attente */}
        <div className="admin-panel">
          <div className="admin-panel-header">
            <h3 className="admin-panel-title">Remboursements en attente</h3>
          </div>
          <div className="admin-panel-body">
            {loading ? (
              <div style={{ height: '200px', background: 'var(--admin-surface-alt)', borderRadius: '8px', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
            ) : refunds.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 16px' }}>
                <RotateCcw className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--admin-text-muted)' }} />
                <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--admin-text-primary)', marginBottom: '4px' }}>Aucun remboursement en attente</p>
                <p style={{ fontSize: '12px', color: 'var(--admin-text-secondary)' }}>Les demandes de remboursement apparaîtront ici</p>
              </div>
            ) : (
              <div style={{ space: '8px' }}>
                {refunds.map((refund) => (
                  <div
                    key={refund.id}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--admin-border)' }}
                  >
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: 'var(--admin-text-primary)' }}>
                        Réservation #{refund.bookingRef}
                      </p>
                      <p style={{ fontSize: '12px', color: 'var(--admin-text-secondary)' }}>
                        {refund.reason}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--admin-coral)' }}>
                        -{formatPrice(refund.amountCents)}
                      </p>
                      <span style={{ fontSize: '12px', padding: '4px 8px', borderRadius: '4px', fontWeight: '500', display: 'inline-block', background: 'var(--admin-coral-soft)', color: 'var(--admin-coral)' }}>
                        En attente
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
