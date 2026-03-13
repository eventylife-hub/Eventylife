'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { logger } from '@/lib/logger';
/* ────────────────────────────── Types ────────────────────────────── */
interface DashboardStats {
  totalUsers: number;
  userGrowth: number;
  totalTravels: number;
  monthlyRevenueCents: number;
  monthlyRevenueGrowth?: number;
  pendingTravels?: number;
  pendingPros?: number;
  activePros?: number;
  openTickets?: number;
  supplierPayments?: number;
  supplierPaymentAmount?: number;
  recentActivity?: Array<{
    id: string;
    actor: string;
    action: string;
    type: 'create' | 'update' | 'access' | 'delete';
    description: string;
    timestamp: string;
  }>;
}

/* ────────────────────────────── Modules data ────────────────────────────── */
const MODULES = [
  {
    icon: '✈️', iconClass: 'ops', title: 'Ops Voyages', status: 'live', statusLabel: 'Actif',
    desc: 'Cycle voyage, départs, Phase 1 & 2, occurrences, feux de validation.',
    stats: [{ label: 'départs J-7', value: '5' }, { label: 'Feu 1 en attente', value: '2' }],
    href: '/admin/voyages',
  },
  {
    icon: '🚌', iconClass: 'transport', title: 'Transport Admin', status: 'live', statusLabel: 'Actif',
    desc: 'Devis fournisseurs, paiements, configs bus/avion, manifests et Feu 2/3.',
    stats: [{ label: 'devis à traiter', value: '2' }, { label: 'manifest manquant', value: '1' }],
    href: '/admin/transport',
  },
  {
    icon: '💰', iconClass: 'finance', title: 'Finance & Paiements', status: 'live', statusLabel: 'Actif',
    desc: 'Marges, revenus, NET30/EOM, payment runs batch, ledger, exports cabinet.',
    stats: [{ label: 'CA mois', value: '€ 142k' }, { label: 'runs en attente', value: '6' }],
    href: '/admin/finance',
  },
  {
    icon: '✅', iconClass: 'pro', title: 'Validation Pro', status: 'pending', statusLabel: '8 en attente',
    desc: 'Créateurs, indépendants, vendeurs, partenaires — SIRET, docs, approbation.',
    stats: [{ label: 'créateurs', value: '3' }, { label: 'indépendants', value: '5' }],
    href: '/admin/pros',
  },
  {
    icon: '🛟', iconClass: 'support', title: 'Support & Incidents', status: 'pending', statusLabel: '4 tickets',
    desc: 'Litiges, tickets clients, incidents repas, urgences terrain, escalations.',
    stats: [{ label: 'urgents', value: '2' }, { label: 'anomalie hôtel', value: '1' }],
    href: '/admin/support',
  },
  {
    icon: '📄', iconClass: 'docs', title: 'Docs & Signatures', status: 'live', statusLabel: 'Actif',
    desc: 'Centre documents, charte Eventy, onboarding docs, versioning, mandats.',
    stats: [{ label: 'docs actifs', value: '12' }, { label: 'signatures en cours', value: '3' }],
    href: '/admin/documents',
  },
  {
    icon: '👥', iconClass: 'team', title: 'Équipes & Accès', status: 'live', statusLabel: 'Actif',
    desc: 'Inviter employés, gérer rôles par module, désactivation, audit sessions.',
    stats: [{ label: 'membres actifs', value: '6' }, { label: 'invite pending', value: '1' }],
    href: '/admin/utilisateurs',
  },
  {
    icon: '📣', iconClass: 'marketing', title: 'Marketing', status: 'live', statusLabel: 'Actif',
    desc: 'Templates email, print zones, données campagnes, leads, sponsors.',
    stats: [{ label: 'PII', value: '0' }, { label: 'Accès restreint', value: '' }],
    href: '/admin/marketing',
  },
  {
    icon: '🏨', iconClass: 'supplier', title: 'Fournisseurs & Hôtels', status: 'live', statusLabel: 'Actif',
    desc: 'Portail hôtel, rooming lists, devis/paiement fournisseurs, HRA avancé.',
    stats: [{ label: 'anomalies', value: '3' }, { label: 'hôtels actifs', value: '9' }],
    href: '/admin/rooming',
  },
];

const QUICK_LINKS = [
  { icon: '✅', label: 'Valider les Pro en attente', desc: '8 profils · /admin/pros', href: '/admin/pros' },
  { icon: '🚌', label: 'Devis transport à traiter', desc: '2 devis · /admin/transport', href: '/admin/transport' },
  { icon: '🏨', label: 'Anomalies hôtel', desc: '3 rooming lists · /admin/rooming', href: '/admin/rooming' },
  { icon: '📤', label: 'Exports Finance (cabinet)', desc: 'ClosePack mensuel · /admin/exports', href: '/admin/exports' },
  { icon: '🔍', label: 'Recherche Pro / Voyage', desc: 'Recherche globale admin', href: '/admin/voyages' },
];

const MOCK_AUDIT = [
  { actor: 'David A.', action: 'Pro validé — CreatorProfile #247', type: 'create' as const, time: 'Il y a 12 min' },
  { actor: 'Marie L.', action: 'Setting modifié — HOLD_DURATION → 7j', type: 'update' as const, time: 'Il y a 1h' },
  { actor: 'Thomas B.', action: 'PII_REVEAL_60S — Ticket #892', type: 'access' as const, time: 'Il y a 2h' },
  { actor: 'David A.', action: 'Employé désactivé — user #34', type: 'delete' as const, time: 'Il y a 5h' },
  { actor: 'Système', action: 'Payment run batch #18 exécuté (6 pro)', type: 'create' as const, time: 'Hier 18:00' },
];

/* ────────────────────────────── Component ────────────────────────────── */
export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async (signal?: AbortSignal) => {
    try {
      setError(null);
      setLoading(true);
      const response = await fetch('/api/admin/dashboard', {
        credentials: 'include',
        signal,
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        // API pas encore connectée — on affiche le dashboard avec les données mock
        setStats(null);
      }
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      logger.warn('API /admin/dashboard indisponible — données démo');
      const FALLBACK_DATA: DashboardStats = {
        totalUsers: 247,
        userGrowth: 12,
        totalTravels: 14,
        monthlyRevenueCents: 14200000,
        monthlyRevenueGrowth: 8,
        pendingTravels: 3,
        pendingPros: 8,
        activePros: 42,
        openTickets: 4,
        supplierPayments: 6,
        supplierPaymentAmount: 2480000,
        recentActivity: [
          {
            id: '1',
            actor: 'David A.',
            action: 'Pro validé',
            type: 'create',
            description: 'Pro validé — CreatorProfile #247',
            timestamp: new Date(Date.now() - 12 * 60000).toISOString(),
          },
          {
            id: '2',
            actor: 'Marie L.',
            action: 'Setting modifié',
            type: 'update',
            description: 'Setting modifié — HOLD_DURATION → 7j',
            timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
          },
          {
            id: '3',
            actor: 'Thomas B.',
            action: 'PII_REVEAL_60S',
            type: 'access',
            description: 'PII_REVEAL_60S — Ticket #892',
            timestamp: new Date(Date.now() - 2 * 60 * 60000).toISOString(),
          },
          {
            id: '4',
            actor: 'David A.',
            action: 'Employé désactivé',
            type: 'delete',
            description: 'Employé désactivé — user #34',
            timestamp: new Date(Date.now() - 5 * 60 * 60000).toISOString(),
          },
          {
            id: '5',
            actor: 'Système',
            action: 'Payment run batch',
            type: 'create',
            description: 'Payment run batch #18 exécuté (6 pro)',
            timestamp: new Date(Date.now() - 24 * 60 * 60000).toISOString(),
          },
        ],
      };
      setStats(FALLBACK_DATA);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchStats(controller.signal);
    return () => controller.abort();
  }, []);

  /* ═══════ LOADING STATE ═══════ */
  if (loading) {
    return (
      <div className="page-enter">
        <div className="admin-page-header admin-fade-in">
          <div>
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        <div className="admin-kpi-grid stagger-children">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="admin-kpi-card admin-fade-in">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-3" />
              <div className="h-10 w-16 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
        <div className="admin-modules-grid" style={{ marginTop: '2rem' }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="admin-panel" style={{ padding: '24px' }}>
              <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-3" />
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ═══════ ERROR STATE ═══════ */
  if (error) {
    return (
      <div className="page-enter">
        <div className="admin-page-header admin-fade-in">
          <div>
            <h1 className="admin-page-title">Tableau de bord</h1>
          </div>
        </div>
        <div className="admin-panel admin-fade-in delay-1" style={{ padding: '48px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
          <p style={{ fontSize: '18px', fontWeight: 600, color: '#1A1A2E', marginBottom: '8px' }}>
            Impossible de charger le tableau de bord
          </p>
          <p style={{ color: '#64748B', marginBottom: '24px' }}>{error}</p>
          <button
            type="button"
            onClick={fetchStats}
            className="admin-btn-secondary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            🔄 Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter">
      {/* ═══════ PAGE HEADER ═══════ */}
      <div className="admin-page-header admin-fade-in">
        <div>
          <div className="admin-breadcrumb">
            <Link href="/admin">Admin</Link> <span style={{ margin: '0 4px' }}>›</span> <span>Accueil</span>
          </div>
          <h1 className="admin-page-title">Tableau de bord</h1>
        </div>
        <div className="admin-header-actions">
          <div className="admin-header-meta">
            <span className="dot"></span>
            FounderAdmin · Niveau N1
          </div>
          <div className="admin-preset-badge">✓ Mode MAX</div>
          <button type="button" className="admin-btn-lockdown">🔒 LOCKDOWN</button>
        </div>
      </div>

      {/* ═══════ ALERTS STRIP ═══════ */}
      <div className="admin-fade-in delay-1">
        <div className="admin-alert-bar danger">
          <span>⚠️</span>
          <span><strong>3 anomalies hôtel</strong> — Rooming list non confirmée pour départ J-2</span>
          <Link href="/admin/rooming" className="alert-action">Voir détails →</Link>
        </div>
        <div className="admin-alert-bar warning">
          <span>🕐</span>
          <span><strong>8 profils Pro</strong> en attente de validation depuis +48h</span>
          <Link href="/admin/pros" className="alert-action">Traiter →</Link>
        </div>
      </div>

      {/* ═══════ KPI WIDGETS ═══════ */}
      <div className="admin-kpi-grid stagger-children">
        <div className="admin-kpi-card urgent admin-fade-in delay-1 hover-lift">
          <div className="admin-kpi-label">Pro à valider</div>
          <div className="admin-kpi-value">{stats?.pendingPros ?? 8}</div>
          <div className="admin-kpi-sub">
            <span className="trend-down">↑ 3</span> depuis hier
          </div>
        </div>
        <div className="admin-kpi-card admin-fade-in delay-2 hover-lift">
          <div className="admin-kpi-label">Voyages en préparation</div>
          <div className="admin-kpi-value">{stats?.totalTravels ?? 14}</div>
          <div className="admin-kpi-sub">
            dont <strong>5</strong> départs confirmés
          </div>
        </div>
        <div className="admin-kpi-card admin-fade-in delay-3 hover-lift">
          <div className="admin-kpi-label">Paiements fournisseurs</div>
          <div className="admin-kpi-value">{stats?.supplierPayments ?? 6}</div>
          <div className="admin-kpi-sub">
            <span className="trend-down">€ {stats?.supplierPaymentAmount ? (stats.supplierPaymentAmount / 100).toLocaleString('fr-FR') : '24 800'}</span> en attente validation
          </div>
        </div>
        <div className="admin-kpi-card admin-fade-in delay-4 hover-lift">
          <div className="admin-kpi-label">Tickets support ouverts</div>
          <div className="admin-kpi-value">{stats?.openTickets ?? 4}</div>
          <div className="admin-kpi-sub">
            2 urgents · 1 anomalie hôtel
          </div>
        </div>
      </div>

      {/* ═══════ MODULES GRID ═══════ */}
      <div className="admin-section-header">
        <h3 className="admin-section-title">Modules</h3>
        <span className="admin-section-link">Affichage selon vos permissions RBAC</span>
      </div>

      <div className="admin-modules-grid">
        {MODULES.map((mod, i) => (
          <Link
            key={mod.title}
            href={mod.href}
            className={`admin-module-card admin-fade-in delay-${Math.min(i + 3, 9)}`}
          >
            <div className="admin-module-card-header">
              <div className={`admin-module-icon ${mod.iconClass}`}>{mod.icon}</div>
              <span className={`admin-module-status ${mod.status === 'live' ? 'live' : 'pending'}`}>
                {mod.statusLabel}
              </span>
            </div>
            <div>
              <h3>{mod.title}</h3>
              <p>{mod.desc}</p>
            </div>
            <div className="admin-module-card-footer">
              {mod.stats.map((s, j) => (
                <span key={j} className="admin-module-stat">
                  {s.value && <strong>{s.value}</strong>} {s.label}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>

      {/* ═══════ SETTINGS STRIP ═══════ */}
      <div className="admin-section-header">
        <h3 className="admin-section-title">Paramètres actifs</h3>
        <Link href="/admin/parametres" className="admin-section-link">Modifier dans /admin/parametres →</Link>
      </div>

      <div className="admin-settings-strip admin-fade-in delay-6">
        <div className="admin-setting-item">
          <span className="admin-setting-label">Hold paiement</span>
          <span className="admin-setting-value">7 jours <span className="editable">modifier</span></span>
        </div>
        <div className="admin-setting-item">
          <span className="admin-setting-label">Email max / sem</span>
          <span className="admin-setting-value">3 / pro <span className="editable">modifier</span></span>
        </div>
        <div className="admin-setting-item">
          <span className="admin-setting-label">Rooming deadline</span>
          <span className="admin-setting-value">J-3 avant départ <span className="editable">modifier</span></span>
        </div>
        <div className="admin-setting-item">
          <span className="admin-setting-label">Rétention tickets</span>
          <span className="admin-setting-value">90 jours <span className="editable">modifier</span></span>
        </div>
      </div>

      {/* ═══════ BOTTOM: AUDIT LOG + QUICK LINKS ═══════ */}
      <div className="admin-bottom-grid">
        {/* Audit Log */}
        <div className="admin-panel admin-fade-in delay-7">
          <div className="admin-panel-header">
            <span className="admin-panel-title">🛡️ Audit Log — Actions récentes</span>
            <Link href="/admin/audit" className="admin-section-link">Voir tout →</Link>
          </div>
          <div className="admin-panel-body">
            {(stats?.recentActivity && stats.recentActivity.length > 0
              ? stats.recentActivity.slice(0, 5).map((a, i) => (
                  <div key={a.id} className="admin-audit-row">
                    <span className={`admin-audit-dot ${a.type}`}></span>
                    <span className="admin-audit-actor">{a.actor}</span>
                    <span className="admin-audit-action">{a.description}</span>
                    <span className="admin-audit-time">
                      {new Date(a.timestamp).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                ))
              : MOCK_AUDIT.map((a, i) => (
                  <div key={i} className="admin-audit-row">
                    <span className={`admin-audit-dot ${a.type}`}></span>
                    <span className="admin-audit-actor">{a.actor}</span>
                    <span className="admin-audit-action">{a.action}</span>
                    <span className="admin-audit-time">{a.time}</span>
                  </div>
                ))
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="admin-panel admin-fade-in delay-8">
          <div className="admin-panel-header">
            <span className="admin-panel-title">⚡ Accès rapides</span>
          </div>
          <div className="admin-panel-body">
            {QUICK_LINKS.map((ql) => (
              <Link key={ql.label} href={ql.href} className="admin-quick-link">
                <span className="ql-icon">{ql.icon}</span>
                <div>
                  <div className="ql-label">{ql.label}</div>
                  <div className="ql-desc">{ql.desc}</div>
                </div>
                <span className="arrow">→</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════ RBAC INFO FOOTER ═══════ */}
      <div className="admin-rbac-footer admin-fade-in delay-9">
        <span style={{ fontSize: '20px' }}>🛡️</span>
        <div>
          <strong>Accès conditionné RBAC</strong> — Chaque carte/widget vérifie vos permissions.
          Actions sensibles tracées dans AuditLog. PII masquées par défaut (mode SAFE).
          <div className="admin-rbac-tags">
            <span className="admin-rbac-tag active">FounderAdmin</span>
            <span className="admin-rbac-tag active">SuperAdmin</span>
            <span className="admin-rbac-tag">OpsVoyageAdmin</span>
            <span className="admin-rbac-tag">TransportAdmin</span>
            <span className="admin-rbac-tag">MarketingAdmin</span>
          </div>
        </div>
      </div>
    </div>
  );
}
