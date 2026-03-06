/**
 * Page 404 globale — Eventy Life
 */
import Link from 'next/link';

export default function GlobalNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4">
      <div className="text-7xl mb-6">🌍</div>
      <h1 className="text-4xl font-bold text-gray-900 mb-3">Page introuvable</h1>
      <p className="text-gray-600 mb-8 max-w-md text-lg">
        Oups ! Cette page semble avoir pris un autre itinéraire.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-green-500 text-white rounded-lg hover:from-blue-700 hover:to-green-600 transition-all font-medium text-lg"
      >
        Retour à l'accueil
      </Link>
    </div>
  );
}
