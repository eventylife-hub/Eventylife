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
 * Header global — Design Eventy v2
 * Topbar navy, logo Playfair "Eventy.Life", nav cream
 */
export function Header({ user }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const logout = useAuthStore((state) => state.logout);

  // Détection scroll pour shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
    <header
      role="banner"
      className="sticky top-0 z-40 transition-shadow duration-300"
      style={{
        background: 'linear-gradient(to right, #0077B6, #7B2FF7, #FF6B35)',
        boxShadow: scrolled ? '0 4px 20px rgba(26,26,46,0.3)' : 'none',
      }}
    >
      {/* Skip to content — Accessibilité */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-2 focus:left-2 focus:px-4 focus:py-2 focus:rounded-lg focus:text-white focus:text-sm focus:font-medium"
        style={{ backgroundColor: '#C75B39' }}
      >
        Aller au contenu principal
      </a>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Eventy.Life */}
          <Link href="/" className="flex items-center gap-0">
            <span
              className="font-display text-xl font-bold tracking-tight"
              style={{ color: '#FAF7F2' }}
            >
              Eventy
            </span>
            <span
              className="font-display text-xl font-bold"
              style={{ color: '#D4A853' }}
            >
              .
            </span>
            <span
              className="font-display text-xl font-bold tracking-tight"
              style={{ color: '#FAF7F2' }}
            >
              Life
            </span>
          </Link>

          {/* Navigation desktop */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Navigation principale">
            <Link
              href={ROUTES.VOYAGES}
              className="text-sm font-medium transition-colors duration-200"
              style={{
                color: pathname === '/voyages' ? '#D4A853' : 'rgba(250,247,242,0.8)',
              }}
              aria-current={pathname === '/voyages' ? 'page' : undefined}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#D4A853')}
              onMouseLeave={(e) => (e.currentTarget.style.color = pathname === '/voyages' ? '#D4A853' : 'rgba(250,247,242,0.8)')}
            >
              Nos voyages
            </Link>
            <Link
              href="/comment-ca-marche"
              className="text-sm font-medium transition-colors duration-200"
              style={{
                color: pathname === '/comment-ca-marche' ? '#D4A853' : 'rgba(250,247,242,0.8)',
              }}
              aria-current={pathname === '/comment-ca-marche' ? 'page' : undefined}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#D4A853')}
              onMouseLeave={(e) => (e.currentTarget.style.color = pathname === '/comment-ca-marche' ? '#D4A853' : 'rgba(250,247,242,0.8)')}
            >
              Comment ça marche
            </Link>
            <Link
              href="/avis"
              className="text-sm font-medium transition-colors duration-200"
              style={{
                color: pathname === '/avis' ? '#D4A853' : 'rgba(250,247,242,0.8)',
              }}
              aria-current={pathname === '/avis' ? 'page' : undefined}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#D4A853')}
              onMouseLeave={(e) => (e.currentTarget.style.color = pathname === '/avis' ? '#D4A853' : 'rgba(250,247,242,0.8)')}
            >
              Avis
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium transition-colors duration-200"
              style={{
                color: pathname === '/contact' ? '#D4A853' : 'rgba(250,247,242,0.8)',
              }}
              aria-current={pathname === '/contact' ? 'page' : undefined}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#D4A853')}
              onMouseLeave={(e) => (e.currentTarget.style.color = pathname === '/contact' ? '#D4A853' : 'rgba(250,247,242,0.8)')}
            >
              Contact
            </Link>
          </nav>

          {/* Right section */}
          <div className="flex items-center gap-3">
            {user ? (
              // Utilisateur connecté
              <div className="relative" ref={dropdownRef}>
                <button type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200"
                  style={{ color: '#FAF7F2' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(250,247,242,0.1)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  aria-label="Menu utilisateur"
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="true"
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{ background: '#C75B39', color: '#FAF7F2' }}
                  >
                    {user.firstName?.charAt(0) || 'U'}
                  </div>
                  <span className="text-sm font-medium hidden sm:inline">
                    {user.firstName}
                  </span>
                </button>

                {/* Dropdown menu */}
                {isDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-52 rounded-xl overflow-hidden animate-fade-up"
                    style={{
                      background: 'white',
                      border: '1.5px solid #E5E0D8',
                      boxShadow: '0 8px 32px rgba(26,26,46,0.12)',
                    }}
                  >
                    <div className="p-4" style={{ borderBottom: '1px solid #E5E0D8' }}>
                      <p className="text-sm font-semibold" style={{ color: '#1A1A2E' }}>
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs" style={{ color: '#6B7280' }}>{user.email}</p>
                    </div>
                    <div className="p-2">
                      <Link
                        href={getDashboardUrl()}
                        className="block px-3 py-2 text-sm rounded-lg transition-colors"
                        style={{ color: '#1A1A2E' }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#FAF7F2')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        Mon espace
                      </Link>
                      <button type="button"
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 text-sm rounded-lg transition-colors"
                        style={{ color: '#E63946' }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#FEF2F2')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
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
                  className="px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200"
                  style={{ color: '#FAF7F2' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(250,247,242,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  Connexion
                </Link>
                <Link
                  href={ROUTES.AUTH.INSCRIPTION}
                  className="px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-200"
                  style={{
                    background: '#C75B39',
                    color: '#FAF7F2',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#D97B5E';
                    e.currentTarget.style.boxShadow = '0 6px 24px rgba(199,91,57,0.25)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#C75B39';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  S'inscrire
                </Link>
              </div>
            )}

            {/* Menu mobile */}
            <button type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg transition-colors"
              style={{ color: '#FAF7F2' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(250,247,242,0.1)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              aria-label={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={isMobileMenuOpen}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Menu mobile déroulant */}
        {isMobileMenuOpen && (
          <nav
            aria-label="Menu mobile"
            className="md:hidden pb-4 space-y-1 animate-fade-up transition-all duration-300"
            style={{ borderTop: '1px solid rgba(250,247,242,0.1)' }}
          >
            <Link
              href={ROUTES.VOYAGES}
              className="block px-4 py-3 rounded-lg text-sm font-medium transition-colors"
              style={{ color: '#FAF7F2' }}
              aria-current={pathname === '/voyages' ? 'page' : undefined}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(250,247,242,0.08)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              Nos voyages
            </Link>
            <Link
              href="/comment-ca-marche"
              className="block px-4 py-3 rounded-lg text-sm font-medium transition-colors"
              style={{ color: '#FAF7F2' }}
              aria-current={pathname === '/comment-ca-marche' ? 'page' : undefined}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(250,247,242,0.08)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              Comment ça marche
            </Link>
            <Link
              href="/avis"
              className="block px-4 py-3 rounded-lg text-sm font-medium transition-colors"
              style={{ color: '#FAF7F2' }}
              aria-current={pathname === '/avis' ? 'page' : undefined}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(250,247,242,0.08)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              Avis
            </Link>
            <Link
              href="/contact"
              className="block px-4 py-3 rounded-lg text-sm font-medium transition-colors"
              style={{ color: '#FAF7F2' }}
              aria-current={pathname === '/contact' ? 'page' : undefined}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(250,247,242,0.08)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              Contact
            </Link>
            {!user && (
              <div className="pt-2 space-y-2" style={{ borderTop: '1px solid rgba(250,247,242,0.1)' }}>
                <Link
                  href={ROUTES.AUTH.CONNEXION}
                  className="block px-4 py-3 rounded-lg text-sm font-medium transition-colors"
                  style={{ color: '#FAF7F2' }}
                >
                  Connexion
                </Link>
                <Link
                  href={ROUTES.AUTH.INSCRIPTION}
                  className="block px-4 py-3 rounded-lg text-sm font-semibold text-center transition-colors"
                  style={{ background: '#C75B39', color: '#FAF7F2' }}
                >
                  S'inscrire
                </Link>
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
