'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth-store';
import { PortalErrorBoundary } from '@/components/error-boundary';

interface ClientLayoutProps {
  children: React.ReactNode;
}

/** Liens sidebar espace client — chemins FR correspondant à l'arborescence réelle */
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
 * Layout pour l'espace client
 * Sidebar + contenu principal avec ErrorBoundary
 */
export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    await logout();
  };

  // Dashboard exact match, autres: prefix match
  const isActive = (href: string) =>
    href === '/client'
      ? pathname === '/client'
      : pathname === href || pathname.startsWith(href + '/');

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 shadow-sm">
        <div className="sticky top-0 h-screen overflow-y-auto">
          {/* Header sidebar */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-xl font-bold text-blue-600">Eventy</h1>
            <p className="text-sm text-gray-600 mt-2">Espace Client</p>
          </div>

          {/* Menu items */}
          <nav className="p-4 space-y-2">
            {SIDEBAR_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Footer sidebar */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <PortalErrorBoundary portal="client">
            {children}
          </PortalErrorBoundary>
        </div>
      </main>
    </div>
  );
}
