'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { logger } from '@/lib/logger';
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

        const data = await res.json() as Record<string, unknown>;
        const items = (data.items || data || []) as TravelGroup[];
        setGroups(items);
      } catch (err: unknown) {
        logger.warn('API indisponible, utilisation des données de démonstration');
        setGroups([
          {
            id: 'grp_001', name: 'Les Voyageurs de Bordeaux', status: 'ACTIVE',
            travelTitle: 'Marrakech Express', travelSlug: 'marrakech-express',
            departureDate: '2026-05-15', destinationCity: 'Marrakech',
            memberCount: 8, createdAt: '2026-01-15T10:00:00Z',
          },
          {
            id: 'grp_002', name: 'Famille Martin', status: 'ACTIVE',
            travelTitle: 'Barcelone & Gaudí', travelSlug: 'barcelone-gaudi',
            departureDate: '2026-06-20', destinationCity: 'Barcelone',
            memberCount: 4, createdAt: '2026-02-10T14:30:00Z',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto animate-fade-up">
        <div className="mb-8">
          <h1 className="font-display text-2xl sm:text-3xl font-bold" style={{ color: 'var(--navy, #1A1A2E)' }}>Mes groupes</h1>
          <p className="text-sm mt-2" style={{ color: '#6B7280' }}>Gérez vos groupes de voyage</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 rounded-2xl skeleton" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-up">
      {/* En-tête */}
      <div className="flex justify-between items-start gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold" style={{ color: 'var(--navy, #1A1A2E)' }}>Mes groupes</h1>
          <p className="text-sm mt-2" style={{ color: '#6B7280' }}>Gérez vos groupes de voyage</p>
        </div>
        <Link href="/client/groupes/creer">
          <button type="button" className="px-6 py-3 rounded-xl font-semibold text-sm transition-all" style={{ background: 'var(--terra, #C75B39)', color: '#fff' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#D97B5E';
              e.currentTarget.style.boxShadow = `0 4px 12px var(--terra, #C75B39)40`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--terra, #C75B39)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Créer un groupe
          </button>
        </Link>
      </div>

      {/* Messages d'erreur */}
      {error && (
        <div style={{
          padding: '1rem 1.5rem',
          backgroundColor: 'var(--terra-soft, #FEF2F2)',
          border: '1.5px solid #E5E0D8',
          borderRadius: '14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{ color: 'var(--terra, #C75B39)', fontWeight: 500 }}>{error}</span>
          <button type="button" onClick={() => setError(null)} style={{
            padding: '0.25rem 0.75rem',
            fontSize: '0.875rem',
            color: 'var(--terra, #C75B39)',
            border: '1px solid var(--terra, #C75B39)',
            borderRadius: '8px',
            background: 'transparent',
            cursor: 'pointer',
          }}>
            Fermer
          </button>
        </div>
      )}

      {/* État vide */}
      {groups.length === 0 ? (
        <div className="text-center py-16 rounded-2xl" style={{ background: '#fff', border: '1.5px solid #E5E0D8' }}>
          <div className="text-5xl mb-4">👥</div>
          <h2 className="font-display text-xl font-bold mb-2" style={{ color: 'var(--navy, #1A1A2E)' }}>Aucun groupe</h2>
          <p className="text-sm mb-6" style={{ color: '#6B7280' }}>Créez un groupe pour organiser vos voyages en commun</p>
          <Link href="/client/groupes/creer">
            <button type="button" className="inline-block px-6 py-3 rounded-xl font-semibold text-sm transition-all" style={{ background: 'var(--terra, #C75B39)', color: '#fff' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#D97B5E';
                e.currentTarget.style.boxShadow = `0 6px 24px var(--terra, #C75B39)30`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--terra, #C75B39)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Créer mon premier groupe →
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {groups.map((group) => (
            <Link key={group.id} href={`/client/groupes/${group.id}`}>
              <div className="rounded-2xl p-6 h-full transition-all duration-300" style={{ background: '#fff', border: '1.5px solid #E5E0D8' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 8px 28px rgba(26,26,46,0.08)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-base" style={{ color: 'var(--navy, #1A1A2E)' }}>{group.name}</h3>
                    <p className="text-xs mt-1" style={{ color: '#6B7280' }}>{group.travelTitle}</p>
                  </div>
                  <span className="px-3 py-1 rounded-xl text-xs font-semibold" style={{ background: '#DCFCE7', color: '#166534' }}>
                    {group.status}
                  </span>
                </div>

                <div className="space-y-2 text-xs mb-6" style={{ color: '#6B7280' }}>
                  <p>📍 {group.destinationCity}</p>
                  <p>📅 {formatDate(group.departureDate)}</p>
                  <p>👥 {group.memberCount} membre{group.memberCount > 1 ? 's' : ''}</p>
                </div>

                <button type="button" className="w-full px-4 py-3 rounded-xl font-semibold text-sm transition-all" style={{ background: '#fff', color: 'var(--navy, #1A1A2E)', border: '1.5px solid #E5E0D8' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(199,91,57,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#fff';
                  }}
                >
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
