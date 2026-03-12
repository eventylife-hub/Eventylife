'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fraunces } from 'next/font/google';
import { useAuthStore } from '@/lib/stores/auth-store';
import { PortalErrorBoundary } from '@/components/error-boundary';
import BackToTop from '@/components/ui/back-to-top';
import { FocusTrap } from '@/components/a11y/focus-trap';
import './pro.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

interface ProLayoutProps {
  children: React.ReactNode;
}

/** Sidebar groupée par sections — Design V4 Sun/Ocean */
const SIDEBAR_SECTIONS = [
  {
    title: 'Principal',
    items: [
      { label: 'Dashboard', href: '/pro', icon: '📊' },
      { label: 'Mes voyages', href: '/pro/voyages', icon: '✈️' },
      { label: 'Réservations', href: '/pro/reservations', icon: '📋' },
    ],
  },
  {
    title: 'Gestion',
    items: [
      { label: 'Finance & Revenus', href: '/pro/revenus', icon: '💰' },
      { label: 'Marketing', href: '/pro/marketing', icon: '📣' },
      { label: 'Arrêts commerciaux', href: '/pro/arrets', icon: '🗺️' },
      { label: 'Documents', href: '/pro/documents', icon: '📄' },
    ],
  },
  {
    title: 'Développement',
    items: [
      { label: 'Formation', href: '/pro/formation', icon: '📚' },
      { label: 'Vendre Eventy', href: '/pro/vendre', icon: '🤝' },
    ],
  },
];

/**
 * Layout Pro — Design V4 Sun/Ocean
 * Dark sidebar + sand content zone
 */
export default function ProLayout({ children }: ProLayoutProps) {
  const pathname = usePathname();
  const logout = useAuthStore((state) => state.logout);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  const isActive = (href: string) =>
    href === '/pro'
      ? pathname === '/pro'
      : pathname === href || pathname.startsWith(href + '/');

  // Pages sans sidebar (login, forgot-password)
  const noSidebarPages = ['/pro/login', '/pro/forgot-password'];
  if (noSidebarPages.some(p => pathname === p || pathname.startsWith(p + '/'))) {
    return <div className={fraunces.variable}>{children}</div>;
  }

  /** Contenu sidebar réutilisé desktop + mobile */
  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="pro-sidebar-logo">
        <div className="logo-dot">E</div>
        <span>Eventy</span>
        <span className="pro-badge">Pro</span>
      </div>

      {/* Navigation sections */}
      <nav aria-label="Menu espace professionnel" style={{ flex: 1, overflowY: 'auto', paddingBottom: '8px' }}>
        {SIDEBAR_SECTIONS.map((section) => (
          <div key={section.title} className="pro-sidebar-section">
            <div className="pro-sidebar-section-title">{section.title}</div>
            {section.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`pro-nav-item ${isActive(item.href) ? 'active' : ''}`}
                aria-current={isActive(item.href) ? 'page' : undefined}
              >
                <span className="nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        ))}
      </nav>

      {/* User footer */}
      <div className="pro-sidebar-footer">
        <div className="pro-sidebar-user">
          <div className="user-avatar">DA</div>
          <div>
            <div className="user-name">David A.</div>
            <div className="user-role">Créateur Pro</div>
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
    </>
  );

  return (
    <div className={`${fraunces.variable} flex min-h-screen`} style={{ background: 'var(--pro-bg)' }}>
      {/* Skip to content — Accessibilité */}
      <a
        href="#pro-main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:rounded-lg focus:text-white focus:text-sm focus:font-medium"
        style={{ backgroundColor: 'var(--pro-sun, #FF6B35)' }}
      >
        Aller au contenu principal
      </a>

      {/* ═══ SIDEBAR DESKTOP ═══ */}
      <aside className="pro-sidebar" role="navigation" aria-label="Navigation espace professionnel">
        <SidebarContent />
      </aside>

      {/* ═══ MOBILE HEADER ═══ */}
      <div className="pro-mobile-header">
        <Link href="/pro" className="flex items-center gap-2">
          <div
            className="flex items-center justify-center font-bold text-white text-xs"
            style={{ width: 28, height: 28, borderRadius: 6, background: 'linear-gradient(135deg, #FF6B35, #FF8F5E)' }}
          >
            E
          </div>
          <span className="font-display text-base font-semibold text-white">Eventy</span>
          <span
            className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded text-white"
            style={{ background: 'linear-gradient(135deg, #0077B6, #48CAE4)' }}
          >
            Pro
          </span>
        </Link>
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg"
          style={{ color: '#FFFFFF' }}
          aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={mobileMenuOpen}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* ═══ MOBILE SIDEBAR OVERLAY ═══ */}
      {mobileMenuOpen && (
        <FocusTrap
          onEscape={() => setMobileMenuOpen(false)}
          className="pro-mobile-overlay-wrapper"
        >
          <div
            className="fixed inset-0 z-40 bg-black/40"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <aside
            className="fixed top-0 left-0 w-72 h-full z-50 flex flex-col"
            style={{ background: 'linear-gradient(180deg, #0A1628 0%, #142438 100%)' }}
            role="navigation"
            aria-label="Menu mobile espace professionnel"
          >
            <SidebarContent />
          </aside>
        </FocusTrap>
      )}

      {/* ═══ MAIN ═══ */}
      <main className="pro-main" id="pro-main-content" role="main" aria-label="Contenu espace professionnel">
        <div className="pro-content">
          <PortalErrorBoundary portal="pro">
            {children}
          </PortalErrorBoundary>
        </div>
        <BackToTop />
      </main>
    </div>
  );
}
