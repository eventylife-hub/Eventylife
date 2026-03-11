'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { GroupCard } from '@/components/groups/group-card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Plus } from 'lucide-react';
import { Breadcrumb } from '@/components/seo/breadcrumb';
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
        const travel = (await travelRes.json() as unknown) as unknown;

        // Récupérer les groupes publics
        const groupesRes = await fetch(
          `/api/groups/travel/${travel.id}`
        , { credentials: 'include' });
        if (!groupesRes.ok) throw new Error('Erreur lors du chargement des groupes');

        const data = (await groupesRes.json() as unknown) as unknown;
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
      <div className="min-h-screen p-4 animate-fade-up" style={{ backgroundColor: 'var(--cream, #FAF7F2)' }}>
        <div className="mx-auto max-w-6xl">
          <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--navy, #1A1A2E)' }}>
            Groupes de voyage
          </h1>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton
                key={i}
                className="h-48 rounded-lg"
                style={{ borderRadius: '20px', backgroundColor: '#E5E0D8' }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // État Error
  if (error) {
    return (
      <div className="min-h-screen p-4 animate-fade-up" style={{ backgroundColor: 'var(--cream, #FAF7F2)' }}>
        <div className="mx-auto max-w-6xl">
          <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--navy, #1A1A2E)' }}>
            Groupes de voyage
          </h1>
          <div
            className="rounded-lg p-6"
            style={{
              backgroundColor: '#fee2e2',
              border: '1.5px solid #fca5a5',
              borderRadius: '20px',
            }}
          >
            <div className="flex items-start gap-4">
              <AlertCircle className="h-6 w-6 flex-shrink-0 mt-0.5" style={{ color: '#991b1b' }} />
              <div>
                <h2 className="font-semibold" style={{ color: '#991b1b' }}>
                  Erreur
                </h2>
                <p className="text-sm mt-1" style={{ color: '#7f1d1d' }}>
                  {error}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-3 text-sm font-medium underline hover:opacity-80"
                  style={{ color: '#991b1b' }}
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
      <div className="min-h-screen p-4 animate-fade-up" style={{ backgroundColor: 'var(--cream, #FAF7F2)' }}>
        <div className="mx-auto max-w-6xl">
          <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--navy, #1A1A2E)' }}>
            Groupes de voyage
          </h1>
          <div
            className="rounded-lg p-12 text-center"
            style={{
              backgroundColor: 'white',
              border: `2px dashed #E5E0D8`,
              borderRadius: '20px',
            }}
          >
            <p className="mb-4" style={{ color: '#6B7280' }}>
              Aucun groupe ouvert pour ce voyage
            </p>
            <Link href="/client/groupes/creer">
              <Button
                variant="default"
                style={{
                  backgroundColor: 'var(--terra, #C75B39)',
                  color: 'white',
                }}
              >
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
    <div className="min-h-screen p-4 animate-fade-up" style={{ backgroundColor: 'var(--cream, #FAF7F2)' }}>
      <div className="mx-auto max-w-6xl">
        <Breadcrumb
          items={[
            { name: 'Accueil', href: '/' },
            { name: 'Nos voyages', href: '/voyages' },
            { name: 'Voyage', href: `/voyages/${slug}` },
            { name: 'Groupes', href: `/voyages/${slug}/groupes` },
          ]}
        />
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--navy, #1A1A2E)' }}>
            Groupes de voyage
          </h1>
          <Link href="/client/groupes/creer">
            <Button
              variant="default"
              style={{
                backgroundColor: 'var(--terra, #C75B39)',
                color: 'white',
              }}
            >
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
          <div className="mt-8 text-sm text-center" style={{ color: '#6B7280' }}>
            Vous voyez {groupes.length} groupe{groupes.length > 1 ? 's' : ''} ouvert{groupes.length > 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
}
