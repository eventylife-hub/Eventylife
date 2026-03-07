'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth-store';
import { PortalErrorBoundary } from '@/components/error-boundary';

interface ProLayoutProps {
  children: React.ReactNode;
}

/** Liens sidebar espace Pro */
const SIDEBAR_ITEMS = [
  { label: 'Dashboard', href: '/pro', icon: '📊' },
  { label: 'Mes voyages', href: '/pro/voyages', icon: '✈️' },
  { label: 'Finance', href: '/pro/revenus', icon: '💰' },
  { label: 'Formation', href: '/pro/formation', icon: '📚' },
  { label: 'Marketing', href: '/pro/marketing', icon: '📢' },
  { label: 'Documents', href: '/pro/documents', icon: '📄' },
  { label: 'Arrêts commerciaux', href: '/pro/arrets', icon: '🗺️' },
];

/**
 * Layout pour l'espace Pro (Agence de voyage)
 * Sidebar + contenu principal avec ErrorBoundary
 */
export default function ProLayout({ children }: ProLayoutProps) {
  const pathname = usePathname();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    await logout();
  };

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 shadow-sm">
        <div className="sticky top-0 h-screen overflow-y-auto">
          {/* Header sidebar */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-xl font-bold text-orange-600">Eventy Pro</h1>
            <p className="text-sm text-gray-600 mt-2">Espace Professionnel</p>
          </div>

          {/* Menu items */}
          <nav className="p-4 space-y-2">
            {SIDEBAR_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'bg-orange-100 text-orange-700 font-medium'
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
          <PortalErrorBoundary portal="pro">
            {children}
          </PortalErrorBoundary>
        </div>
      </main>
    </div>
  );
}
