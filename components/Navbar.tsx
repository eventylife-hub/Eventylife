/**
 * Barre de navigation globale
 */

import Link from 'next/link';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors">
          Eventy Life
        </Link>

        {/* Menu links */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/voyages" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
            Nos voyages
          </Link>
          <Link href="/cgv" className="text-gray-700 hover:text-primary-600 text-sm transition-colors">
            CGV
          </Link>
          <Link href="/confidentialite" className="text-gray-700 hover:text-primary-600 text-sm transition-colors">
            Confidentialité
          </Link>
        </div>

        {/* Auth buttons */}
        <div className="flex gap-4 items-center">
          <Link href="/login" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
            Connexion
          </Link>
          <Link
            href="/register"
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            S'inscrire
          </Link>
        </div>
      </nav>
    </header>
  );
}
