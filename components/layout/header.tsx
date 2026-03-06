'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { UserProfile } from '@/types/api';
import { useAuthStore } from '@/lib/stores/auth-store';
import { ROUTES } from '@/lib/constants';

interface HeaderProps {
  user?: UserProfile;
}

/**
 * Header global de l'application
 * - Logo et branding
 * - Navigation principale
 * - Espace utilisateur (connecté/non connecté)
 * - Menu mobile
 */
export function Header({ user }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const logout = useAuthStore((state) => state.logout);

  // Fermer le dropdown en cliquant ailleurs
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push(ROUTES.AUTH.CONNEXION);
  };

  const getDashboardUrl = () => {
    switch (user?.role) {
      case 'ADMIN':
        return ROUTES.ADMIN.DASHBOARD;
      case 'PRO':
        return ROUTES.PRO.DASHBOARD;
      case 'CLIENT':
      default:
        return ROUTES.CLIENT.DASHBOARD;
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
            <span className="font-bold text-lg text-gray-900">Eventy Life</span>
          </Link>

          {/* Navigation desktop */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href={ROUTES.VOYAGES} className="text-gray-700 hover:text-blue-600 transition">
              Voyages
            </Link>
            <Link href="/#how-it-works" className="text-gray-700 hover:text-blue-600 transition">
              Comment ça marche
            </Link>
          </nav>

          {/* Right section */}
          <div className="flex items-center gap-4">
            {user ? (
              // Utilisateur connecté
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-900 hidden sm:inline">
                    {user.firstName}
                  </span>
                </button>

                {/* Dropdown menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200">
                    <div className="p-4 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">{user.email}</p>
                    </div>
                    <div className="p-2">
                      <Link
                        href={getDashboardUrl()}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition"
                      >
                        Mon espace
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition"
                      >
                        Déconnexion
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Utilisateur non connecté
              <div className="hidden md:flex items-center gap-3">
                <Link
                  href={ROUTES.AUTH.CONNEXION}
                  className="px-4 py-2 text-gray-700 hover:text-blue-600 transition font-medium"
                >
                  Connexion
                </Link>
                <Link
                  href={ROUTES.AUTH.INSCRIPTION}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  S'inscrire
                </Link>
              </div>
            )}

            {/* Menu mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link href={ROUTES.VOYAGES} className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
              Voyages
            </Link>
            <Link href="/#how-it-works" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
              Comment ça marche
            </Link>
            {!user && (
              <>
                <Link href={ROUTES.AUTH.CONNEXION} className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
                  Connexion
                </Link>
                <Link href={ROUTES.AUTH.INSCRIPTION} className="block px-4 py-2 bg-blue-600 text-white rounded">
                  S'inscrire
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
