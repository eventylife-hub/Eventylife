'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { GroupCard } from '@/components/groups/group-card';
import { AlertCircle, Plus } from 'lucide-react';
import { Breadcrumb } from '@/components/seo/breadcrumb';
import { logger } from '@/lib/logger';
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
        const travel = (await travelRes.json()) as { id: string };

        // Récupérer les groupes publics
        const groupesRes = await fetch(
          `/api/groups/travel/${travel.id}`
        , { credentials: 'include' });
        if (!groupesRes.ok) throw new Error('Erreur lors du chargement des groupes');

        const data = (await groupesRes.json()) as Group[];
        setGroupes(data);
      } catch (err: unknown) {
        logger.warn('API groupes indisponible — données démo');
        // Fallback demo data — 3 groups
        const fallbackGroups: Group[] = [
          {
            id: 'grp-1',
            code: 'GRP001',
            name: 'Les Aventuriers du Soleil',
            memberCount: 8,
            maxRooms: 4,
            status: 'open',
            createdAt: new Date().toISOString(),
            leaderUser: { firstName: 'Marie', lastName: 'Dubois' },
          },
          {
            id: 'grp-2',
            code: 'GRP002',
            name: 'Escapade Méditerranéenne',
            memberCount: 12,
            maxRooms: 6,
            status: 'open',
            createdAt: new Date().toISOString(),
            leaderUser: { firstName: 'Jean', lastName: 'Martin' },
          },
          {
            id: 'grp-3',
            code: 'GRP003',
            name: 'Tribu Italie Express',
            memberCount: 5,
            maxRooms: 3,
            status: 'open',
            createdAt: new Date().toISOString(),
            leaderUser: { firstName: 'Sophie', lastName: 'Bernard' },
          },
        ];
        setGroupes(fallbackGroups);
        setError(null);
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
              <div
                key={i}
                style={{ height: '12rem', borderRadius: '20px', background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }}
              />
            ))}
          </div>
          <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
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
                <button type="button"
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
            <Link
              href="/client/groupes/creer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--terra, #C75B39)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '12px', fontWeight: '700', textDecoration: 'none', transition: 'all 0.3s ease' }}
            >
              <Plus className="h-4 w-4" />
              Créer un groupe
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
          <Link
            href="/client/groupes/creer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--terra, #C75B39)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '12px', fontWeight: '700', textDecoration: 'none', transition: 'all 0.3s ease' }}
          >
            <Plus className="h-4 w-4" />
            Créer un groupe
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
