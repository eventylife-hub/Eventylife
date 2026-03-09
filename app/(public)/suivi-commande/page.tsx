'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SuiviCommandePage() {
  const [orderRef, setOrderRef] = useState('');
  const [email, setEmail] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero */}
      <div className="bg-gradient-to-r from-[#0A1628] to-[#1B3A5C] text-white py-16 px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold mb-4">
            Suivi de <span className="text-[#FF6B35]">commande</span>
          </h1>
          <p className="text-gray-300">
            Retrouvez le statut de votre reservation en quelques clics.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-xl px-4 py-12">
        {/* Formulaire de recherche */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <form onSubmit={handleSearch} className="space-y-5">
            <div>
              <label
                htmlFor="orderRef"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Reference de reservation
              </label>
              <input
                id="orderRef"
                type="text"
                value={orderRef}
                onChange={(e) => setOrderRef(e.target.value)}
                placeholder="Ex: EVT-2026-XXXXX"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#FF6B35] transition-colors"
                required
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Email utilise lors de la reservation
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#FF6B35] transition-colors"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#FF6B35] text-white py-3 rounded-xl font-bold hover:bg-[#FF8F5E] transition-all"
            >
              Rechercher ma reservation
            </button>
          </form>

          {searched && (
            <div className="mt-8 p-6 bg-orange-50 rounded-xl border border-orange-100">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">\u{1F50D}</span>
                <h3 className="font-bold text-gray-900">Aucune reservation trouvee</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Verifiez votre reference et votre email, ou connectez-vous a votre
                espace client pour voir toutes vos reservations.
              </p>
              <Link
                href="/connexion"
                className="inline-block text-sm text-[#FF6B35] font-semibold hover:underline"
              >
                Se connecter &rarr;
              </Link>
            </div>
          )}
        </div>

        {/* Info box */}
        <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4">Besoin d&apos;aide ?</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start gap-3">
              <span className="text-lg">\u{1F4E7}</span>
              <div>
                <p className="font-semibold text-gray-900">Par email</p>
                <p>contact@eventylife.fr - Reponse sous 24h</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-lg">\u{1F4F1}</span>
              <div>
                <p className="font-semibold text-gray-900">Par telephone</p>
                <p>+33 (0)1 23 45 67 89 - Lun-Ven 9h-18h</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-lg">\u{1F464}</span>
              <div>
                <p className="font-semibold text-gray-900">Espace client</p>
                <Link href="/connexion" className="text-[#FF6B35] hover:underline">
                  Connectez-vous pour voir toutes vos reservations
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
