'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/stores/auth-store';
import { formatPrice, formatDate } from '@/lib/utils';

interface ProfileStats {
  totalBookings: number;
  confirmedBookings: number;
  pendingBookings: number;
  cancelledBookings: number;
  totalAmountSpentCents: number;
}

interface NextTravel {
  id: string;
  title: string;
  slug: string;
  departureDate: string;
  coverImageUrl?: string;
  destinationCity: string;
}

interface DashboardData {
  firstName: string;
  lastName: string;
  stats: ProfileStats;
  nextTravel?: NextTravel;
}

export default function ClientDashboardPage() {
  const { user } = useAuthStore();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Récupérer le profil et les stats
        const profileRes = await fetch('/api/client/profile', {
          credentials: 'include',
        });

        if (!profileRes.ok) throw new Error('Impossible de charger le profil');

        const profileData = await profileRes.json();

        // Récupérer les réservations
        const bookingsRes = await fetch('/api/client/bookings?limit=1', {
          credentials: 'include',
        });

        const bookingsData = bookingsRes.ok ? await bookingsRes.json() : { items: [] };

        const nextTravel = bookingsData.items?.[0];

        setData({
          firstName: profileData.firstName || 'Client',
          lastName: profileData.lastName || '',
          stats: profileData.stats,
          nextTravel,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur de chargement');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const daysUntilDeparture = (date: string) => {
    const departure = new Date(date);
    const today = new Date();
    const diffTime = departure.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-4">
            <p className="text-red-700 font-semibold">Erreur : {error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (loading || !data) {
    return (
      <div className="space-y-8">
        <div className="h-32 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const days = data?.nextTravel ? daysUntilDeparture(data.nextTravel.departureDate) : null;

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-blue-600 to-green-500 text-white rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-2">
          Bienvenue, {data.firstName}!
        </h1>
        <p>Gérez vos réservations et votre profil depuis votre espace personnel</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-6 border border-slate-200 hover:shadow-md transition-shadow">
          <p className="text-sm text-slate-600 font-medium">Voyages réservés</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">
            {data.stats.totalBookings || 0}
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 border border-slate-200 hover:shadow-md transition-shadow">
          <p className="text-sm text-slate-600 font-medium">Confirmées</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {data.stats.confirmedBookings || 0}
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 border border-slate-200 hover:shadow-md transition-shadow">
          <p className="text-sm text-slate-600 font-medium">En attente</p>
          <p className="text-3xl font-bold text-yellow-600 mt-2">
            {data.stats.pendingBookings || 0}
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 border border-slate-200 hover:shadow-md transition-shadow">
          <p className="text-sm text-slate-600 font-medium">Montant dépensé</p>
          <p className="text-2xl font-bold text-slate-900 mt-2">
            {formatPrice(data.stats.totalAmountSpentCents || 0)}
          </p>
        </div>
      </div>

      {/* Prochain voyage */}
      {data.nextTravel && (
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <div className="flex flex-col md:flex-row">
            {data.nextTravel.coverImageUrl && (
              <div className="md:w-1/3 h-48 md:h-auto bg-slate-100 flex-shrink-0">
                <img
                  src={data.nextTravel.coverImageUrl}
                  alt={data.nextTravel.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  {data.nextTravel.title}
                </h3>
                <p className="text-slate-600 mb-4">
                  Destination: <span className="font-semibold">{data.nextTravel.destinationCity}</span>
                </p>
                <p className="text-sm text-slate-500 mb-4">
                  Départ: {formatDate(data.nextTravel.departureDate)}
                </p>
                {days && (
                  <div className="inline-block bg-blue-50 px-4 py-2 rounded-lg">
                    <p className="text-sm font-semibold text-blue-700">
                      ⏱ {days > 0 ? `${days} jours avant le départ` : 'Voyage en cours'}
                    </p>
                  </div>
                )}
              </div>
              <Link
                href={`/client/reservations/${data.nextTravel.id}`}
                className="inline-block mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors w-fit"
              >
                Voir les détails
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/client/reservations" className="group">
          <div className="bg-white rounded-lg p-6 border border-slate-200 hover:shadow-md transition-all hover:border-blue-300 cursor-pointer h-full">
            <div className="text-3xl mb-3">📋</div>
            <h3 className="font-semibold text-slate-900 mb-1">Mes réservations</h3>
            <p className="text-sm text-slate-600">Voir toutes vos réservations</p>
            <p className="text-xs text-blue-600 mt-3 group-hover:translate-x-1 transition-transform">
              Accéder →
            </p>
          </div>
        </Link>

        <Link href="/client/groupes" className="group">
          <div className="bg-white rounded-lg p-6 border border-slate-200 hover:shadow-md transition-all hover:border-green-300 cursor-pointer h-full">
            <div className="text-3xl mb-3">👥</div>
            <h3 className="font-semibold text-slate-900 mb-1">Mes groupes</h3>
            <p className="text-sm text-slate-600">Gérez vos groupes de voyage</p>
            <p className="text-xs text-green-600 mt-3 group-hover:translate-x-1 transition-transform">
              Accéder →
            </p>
          </div>
        </Link>

        <Link href="/client/profil" className="group">
          <div className="bg-white rounded-lg p-6 border border-slate-200 hover:shadow-md transition-all hover:border-purple-300 cursor-pointer h-full">
            <div className="text-3xl mb-3">⚙️</div>
            <h3 className="font-semibold text-slate-900 mb-1">Mon profil</h3>
            <p className="text-sm text-slate-600">Modifiez vos informations</p>
            <p className="text-xs text-purple-600 mt-3 group-hover:translate-x-1 transition-transform">
              Accéder →
            </p>
          </div>
        </Link>
      </div>

      {/* CTA découverte */}
      {(!data.stats.totalBookings || data.stats.totalBookings === 0) && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-3">Aucune réservation pour le moment</h2>
          <p className="mb-6 opacity-90">Découvrez nos plus beaux voyages et réservez votre prochaine aventure!</p>
          <Link
            href="/voyages"
            className="inline-block px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-slate-50 transition-colors"
          >
            Découvrir les voyages
          </Link>
        </div>
      )}
    </div>
  );
}
