'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth-store';
import { PortalErrorBoundary } from '@/components/error-boundary';
import BackToTop from '@/components/ui/back-to-top';

interface ClientLayoutProps {
  children: React.ReactNode;
}

const SIDEBAR_ITEMS = [
  { label: 'Tableau de bord', href: '/client', icon: '📊' },
  { label: 'Mes réservations', href: '/client/reservations', icon: '✈️' },
  { label: 'Mes groupes', href: '/client/groupes', icon: '👥' },
  { label: 'Mes paiements', href: '/client/paiements', icon: '💳' },
  { label: 'Mes avis', href: '/client/avis', icon: '⭐' },
  { label: 'Mes assurances', href: '/client/assurance', icon: '🛡️' },
  { label: 'Mon portefeuille', href: '/client/wallet', icon: '💰' },
  { label: 'Mon profil', href: '/client/profil', icon: '👤' },
  { label: 'Mes documents', href: '/client/documents', icon: '📄' },
  { label: 'Notifications', href: '/client/notifications', icon: '🔔' },
  { label: 'Support', href: '/client/support', icon: '💬' },
];

/**
 * Layout espace client — Design Eventy v2
 * Sidebar navy, contenu cream
 */
export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/connexion');
  };

  const isActive = (href: string) =>
    href === '/client'
      ? pathname === '/client'
      : pathname === href || pathname.startsWith(href + '/');

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-6" style={{ borderBottom: `1px solid rgba(250,247,242,0.08)` }}>
        <Link href="/" className="flex items-center gap-0">
          <span className="font-display text-lg font-bold" style={{ color: '#FAF7F2' }}>Eventy</span>
          <span className="font-display text-lg font-bold" style={{ color: 'var(--gold, #D4A853)' }}>.</span>
          <span className="font-display text-lg font-bold" style={{ color: '#FAF7F2' }}>Life</span>
        </Link>
        <p className="text-xs mt-2" style={{ color: 'rgba(250,247,242,0.4)' }}>Espace Client</p>
      </div>

      {/* Nav */}
      <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
        {SIDEBAR_ITEMS.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200"
              style={{
                background: active ? 'rgba(199,91,57,0.15)' : 'transparent',
                color: active ? '#FAF7F2' : 'rgba(250,247,242,0.6)',
                fontWeight: active ? 600 : 400,
              }}
              onMouseEnter={(e) => {
                if (!active) e.currentTarget.style.background = 'rgba(250,247,242,0.06)';
              }}
              onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.background = 'transparent';
              }}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
              {active && (
                <span
                  className="ml-auto w-1.5 h-1.5 rounded-full"
                  style={{ background: 'var(--terra, #C75B39)' }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Déconnexion */}
      <div className="p-3" style={{ borderTop: '1px solid rgba(250,247,242,0.08)' }}>
        <button type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200"
          style={{ color: 'rgba(250,247,242,0.5)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(230,57,70,0.1)';
            e.currentTarget.style.color = '#E63946';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'rgba(250,247,242,0.5)';
          }}
        >
          <span>🚪</span>
          <span>Déconnexion</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--cream, #FAF7F2)' }}>
      {/* Skip to content — Accessibilité */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:rounded-lg focus:text-white focus:text-sm focus:font-medium"
        style={{ backgroundColor: 'var(--terra, #C75B39)' }}
      >
        Aller au contenu principal
      </a>

      {/* Sidebar desktop */}
      <aside
        className="hidden md:flex w-64 flex-col sticky top-0 h-screen"
        style={{ background: 'var(--navy, #1A1A2E)' }}
        role="navigation"
        aria-label="Navigation espace client"
      >
        <SidebarContent />
      </aside>

      {/* Mobile header */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-14"
        style={{ background: 'var(--navy, #1A1A2E)' }}
      >
        <Link href="/" className="flex items-center gap-0">
          <span className="font-display text-lg font-bold" style={{ color: '#FAF7F2' }}>Eventy</span>
          <span className="font-display text-lg font-bold" style={{ color: 'var(--gold, #D4A853)' }}>.</span>
          <span className="font-display text-lg font-bold" style={{ color: '#FAF7F2' }}>Life</span>
        </Link>
        <button type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg"
          style={{ color: '#FAF7F2' }}
          aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={mobileOpen}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 z-40 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <aside
            className="md:hidden fixed top-0 left-0 w-72 h-full z-50 flex flex-col animate-slide-in-right"
            style={{ background: 'var(--navy, #1A1A2E)' }}
          >
            <SidebarContent />
          </aside>
        </>
      )}

      {/* Main content */}
      <main className="flex-1 overflow-y-auto md:pt-0 pt-14" id="main-content" role="main" aria-label="Contenu espace client">
        <div className="p-6 sm:p-8">
          <PortalErrorBoundary portal="client">
            {children}
          </PortalErrorBoundary>
        </div>
        <BackToTop />
      </main>
    </div>
  );
}
