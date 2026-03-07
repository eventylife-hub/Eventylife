'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { GroupCard } from '@/components/groups/group-card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Plus } from 'lucide-react';

interface Group {
  id: string;
  code: string;
  name: string;
  memberCount: number;
  maxRooms?: number | null;
  status: string;
  createdAt: string;
  leaderUser?: {
    firstName?: string;
    lastName?: string;
  };
}

/**
 * Page des groupes publics d'un voyage
 * Affiche les groupes ouverts et permet de les rejoindre
 */
export default function GroupesPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [groupes, setGroupes] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroupes = async () => {
      try {
        setLoading(true);
        setError(null);

        // Récupérer le voyage pour obtenir son ID
        const travelRes = await fetch(`/api/travels/by-slug/${slug}`, { credentials: 'include' });
        if (!travelRes.ok) throw new Error('Voyage non trouvé');
        const travel = await travelRes.json();

        // Récupérer les groupes publics
        const groupesRes = await fetch(
          `/api/groups/travel/${travel.id}`
        , { credentials: 'include' });
        if (!groupesRes.ok) throw new Error('Erreur lors du chargement des groupes');

        const data = await groupesRes.json();
        setGroupes(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
      } finally {
        setLoading(false);
      }
    };

    fetchGroupes();
  }, [slug]);

  // État Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-2xl font-bold mb-6">Groupes de voyage</h1>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // État Error
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-2xl font-bold mb-6">Groupes de voyage</h1>
          <div className="rounded-lg border border-red-200 bg-red-50 p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h2 className="font-semibold text-red-900">Erreur</h2>
                <p className="text-sm text-red-700 mt-1">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-3 text-sm font-medium text-red-600 hover:text-red-700 underline"
                >
                  Réessayer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // État Empty
  if (groupes.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-2xl font-bold mb-6">Groupes de voyage</h1>
          <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-100 p-12 text-center">
            <p className="text-gray-600 mb-4">
              Aucun groupe ouvert pour ce voyage
            </p>
            <Link href="/client/groupes/creer">
              <Button variant="default">
                <Plus className="h-4 w-4 mr-2" />
                Créer un groupe
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // État Data
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Groupes de voyage</h1>
          <Link href="/client/groupes/creer">
            <Button variant="default">
              <Plus className="h-4 w-4 mr-2" />
              Créer un groupe
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {groupes.map((groupe) => (
            <GroupCard key={groupe.id} groupe={groupe} />
          ))}
        </div>

        {groupes.length > 0 && (
          <div className="mt-8 text-sm text-gray-600 text-center">
            Vous voyez {groupes.length} groupe{groupes.length > 1 ? 's' : ''} ouvert{groupes.length > 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
}
