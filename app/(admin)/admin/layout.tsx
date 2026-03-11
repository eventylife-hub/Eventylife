'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fraunces } from 'next/font/google';
import { useAuthStore } from '@/lib/stores/auth-store';
import { PortalErrorBoundary } from '@/components/error-boundary';
import BackToTop from '@/components/ui/back-to-top';
import './admin.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

interface AdminLayoutProps {
  children: React.ReactNode;
}

/** Sidebar groupée par sections — Design V38 */
const SIDEBAR_SECTIONS = [
  {
    title: 'Principal',
    items: [
      { label: 'Accueil Admin', href: '/admin', icon: '🏠' },
      { label: 'Snapshot Finance', href: '/admin/finance', icon: '📊' },
    ],
  },
  {
    title: 'Opérations',
    items: [
      { label: 'Ops Voyages', href: '/admin/voyages', icon: '✈️' },
      { label: 'Transport', href: '/admin/transport', icon: '🚌' },
      { label: 'Fournisseurs / Hôtels', href: '/admin/rooming', icon: '🏨' },
      { label: 'Finance & Paiements', href: '/admin/finance/payouts', icon: '💰' },
    ],
  },
  {
    title: 'Gestion',
    items: [
      { label: 'Validation Pro', href: '/admin/pros', icon: '✅', badge: '8' },
      { label: 'Docs & Signatures', href: '/admin/documents', icon: '📄' },
      { label: 'Support & Tickets', href: '/admin/support', icon: '🛟' },
      { label: 'Marketing', href: '/admin/marketing', icon: '📣' },
      { label: 'Réservations', href: '/admin/bookings', icon: '📋' },
      { label: 'Annulations', href: '/admin/annulations', icon: '❌' },
    ],
  },
  {
    title: 'Système',
    items: [
      { label: 'Utilisateurs', href: '/admin/utilisateurs', icon: '👥' },
      { label: 'Équipes & Accès', href: '/admin/alertes', icon: '🔐' },
      { label: 'Audit Log', href: '/admin/audit', icon: '🛡️' },
      { label: 'Paramètres', href: '/admin/parametres', icon: '⚙️' },
      { label: 'Monitoring', href: '/admin/notifications', icon: '📡' },
      { label: 'Exports', href: '/admin/exports', icon: '📥' },
    ],
  },
];

/**
 * Layout Admin — Design V38
 * Dark sidebar sectionnée + main content zone chaleureuse
 */
export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const logout = useAuthStore((state) => state.logout);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  const isActive = (href: string) =>
    href === '/admin'
      ? pathname === '/admin'
      : pathname === href || pathname.startsWith(href + '/');

  return (
    <div className={`${fraunces.variable} flex min-h-screen`} style={{ background: 'var(--admin-bg)' }}>
      {/* Skip to content — Accessibilité */}
      <a
        href="#admin-main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:rounded-lg focus:text-white focus:text-sm focus:font-medium"
        style={{ backgroundColor: 'var(--admin-ocean, #0077B6)' }}
      >
        Aller au contenu principal
      </a>

      {/* ═══ SIDEBAR ═══ */}
      <aside className="admin-sidebar" role="navigation" aria-label="Navigation administration">
        {/* Logo */}
        <div className="admin-sidebar-logo">
          <div className="logo-dot">E</div>
          <span>Eventy</span>
          <span className="admin-badge">Admin</span>
        </div>

        {/* Navigation sections */}
        <nav style={{ flex: 1, overflowY: 'auto', paddingBottom: '8px' }}>
          {SIDEBAR_SECTIONS.map((section) => (
            <div key={section.title} className="admin-sidebar-section">
              <div className="admin-sidebar-section-title">{section.title}</div>
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`admin-nav-item ${isActive(item.href) ? 'active' : ''}`}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span>{item.label}</span>
                  {'badge' in item && item.badge && (
                    <span className="nav-badge">{item.badge}</span>
                  )}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        {/* User footer */}
        <div className="admin-sidebar-footer">
          <div className="admin-sidebar-user">
            <div className="user-avatar">DA</div>
            <div className="user-info">
              <div className="user-name">David A.</div>
              <div className="user-role">FounderAdmin</div>
            </div>
          </div>
          <button type="button"
            onClick={handleLogout}
            style={{
              width: '100%',
              marginTop: '8px',
              padding: '7px 12px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'transparent',
              color: 'rgba(255,255,255,0.5)',
              fontSize: '12px',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
              e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
            }}
          >
            Déconnexion
          </button>
        </div>
      </aside>

      {/* ═══ MAIN ═══ */}
      <main className="admin-main" id="main-content" role="main" aria-label="Contenu administration">
        <div className="admin-content">
          <PortalErrorBoundary portal="admin">
            {children}
          </PortalErrorBoundary>
        </div>
        <BackToTop />
      </main>
    </div>
  );
}
