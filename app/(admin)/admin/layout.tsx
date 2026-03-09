'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth-store';
import { PortalErrorBoundary } from '@/components/error-boundary';

interface AdminLayoutProps {
  children: React.ReactNode;
}

/** Liens sidebar espace Admin — chemins FR correspondant à l&apos;arborescence réelle */
const SIDEBAR_ITEMS = [
  { label: 'Tableau de bord', href: '/admin', icon: '📊' },
  { label: 'Utilisateurs', href: '/admin/utilisateurs', icon: '👥' },
  { label: 'Voyages', href: '/admin/voyages', icon: '✈️' },
  { label: 'Réservations', href: '/admin/bookings', icon: '📋' },
  { label: 'Annulations', href: '/admin/annulations', icon: '❌' },
  { label: 'Finance', href: '/admin/finance', icon: '💰' },
  { label: 'Pros', href: '/admin/pros', icon: '🏢' },
  { label: 'Transport', href: '/admin/transport', icon: '🚌' },
  { label: 'Rooming', href: '/admin/rooming', icon: '🏨' },
  { label: 'Marketing', href: '/admin/marketing', icon: '📣' },
  { label: 'Documents', href: '/admin/documents', icon: '📄' },
  { label: 'Exports', href: '/admin/exports', icon: '📥' },
  { label: 'Notifications', href: '/admin/notifications', icon: '🔔' },
  { label: 'Audit', href: '/admin/audit', icon: '🔍' },
  { label: 'Support', href: '/admin/support', icon: '🆘' },
  { label: 'Alertes', href: '/admin/alertes', icon: '⚠️' },
  { label: 'Paramètres', href: '/admin/parametres', icon: '⚙️' },
];

/**
 * Layout pour l&apos;espace Admin
 * Sidebar + contenu principal avec ErrorBoundary
 */
export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    await logout();
  };

  // Dashboard exact match, autres: prefix match
  const isActive = (href: string) =>
    href === '/admin'
      ? pathname === '/admin'
      : pathname === href || pathname.startsWith(href + '/');

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 shadow-sm">
        <div className="sticky top-0 h-screen overflow-y-auto">
          {/* Header sidebar */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-xl font-bold text-red-600">Eventy Admin</h1>
            <p className="text-sm text-gray-600 mt-2">Panneau d&apos;administration</p>
          </div>

          {/* Menu items */}
          <nav className="p-4 space-y-2">
            {SIDEBAR_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'bg-red-100 text-red-700 font-medium'
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
          <PortalErrorBoundary portal="admin">
            {children}
          </PortalErrorBoundary>
        </div>
      </main>
    </div>
  );
}
