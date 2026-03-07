/**
 * Page 404 — Espace Admin
 */
import Link from 'next/link';

export default function AdminNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="text-6xl mb-6">🔍</div>
      <h1 className="text-3xl font-bold text-gray-900 mb-3">Page introuvable</h1>
      <p className="text-gray-600 mb-8 max-w-md">
        La page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <Link
        href="/admin/dashboard"
        className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
      >
        Retour au dashboard
      </Link>
    </div>
  );
}
