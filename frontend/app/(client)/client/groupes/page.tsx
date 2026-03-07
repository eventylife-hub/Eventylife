'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

interface TravelGroup {
  id: string;
  name: string;
  status: string;
  travelTitle: string;
  travelSlug: string;
  departureDate: string;
  destinationCity: string;
  memberCount: number;
  createdAt: string;
}

export default function GroupesPage() {
  const [groups, setGroups] = useState<TravelGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/client/groups', {
          credentials: 'include',
        });

        if (!res.ok) throw new Error('Impossible de charger les groupes');

        const data = await res.json();
        setGroups(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur');
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  // formatDate locale supprimée — utilise formatDate de @/lib/utils

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Mes groupes</h1>
          <p className="text-slate-600">Gérez vos groupes de voyage</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-slate-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* En-tête */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Mes groupes</h1>
          <p className="text-slate-600">Gérez vos groupes de voyage</p>
        </div>
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
          Créer un groupe
        </button>
      </div>

      {/* Messages d'erreur */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* État vide */}
      {groups.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-lg">
          <div className="text-6xl mb-4">👥</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Aucun groupe</h2>
          <p className="text-slate-600 mb-6">Créez un groupe pour organiser vos voyages en commun</p>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
            Créer mon premier groupe
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {groups.map((group) => (
            <Link key={group.id} href={`/client/groupes/${group.id}`}>
              <div className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer h-full">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{group.name}</h3>
                    <p className="text-sm text-slate-600">{group.travelTitle}</p>
                  </div>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                    {group.status}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-slate-600 mb-4">
                  <p>📍 {group.destinationCity}</p>
                  <p>📅 {formatDate(group.departureDate)}</p>
                  <p>👥 {group.memberCount} membre{group.memberCount > 1 ? 's' : ''}</p>
                </div>

                <button className="w-full px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-semibold">
                  Voir le groupe
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
