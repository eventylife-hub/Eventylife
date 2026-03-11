'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
const C = {
  navy: '#1A1A2E',
  cream: '#FAF7F2',
  terra: '#C75B39',
  terraLight: '#D97B5E',
  terraSoft: 'var(--terra-soft)',
  gold: '#D4A853',
  goldSoft: '#FDF6E8',
  border: '#E5E0D8',
  muted: '#6B7280',
  forest: '#166534',
  forestBg: '#DCFCE7',
};

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

        const data = (await res.json() as unknown) as unknown;
        setGroups(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Erreur');
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
          <h1 className="font-display text-2xl sm:text-3xl font-bold" style={{ color: C.navy }}>Mes groupes</h1>
          <p className="text-sm mt-2" style={{ color: C.muted }}>Gérez vos groupes de voyage</p>
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
          <h1 className="font-display text-2xl sm:text-3xl font-bold" style={{ color: C.navy }}>Mes groupes</h1>
          <p className="text-sm mt-2" style={{ color: C.muted }}>Gérez vos groupes de voyage</p>
        </div>
        <Link href="/client/groupes/creer">
          <button className="px-6 py-3 rounded-xl font-semibold text-sm transition-all" style={{ background: C.terra, color: '#fff' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = C.terraLight;
              e.currentTarget.style.boxShadow = `0 4px 12px ${C.terra}40`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = C.terra;
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Créer un groupe
          </button>
        </Link>
      </div>

      {/* Messages d'erreur */}
      {error && (
        <div className="p-6 rounded-2xl" style={{ background: 'var(--terra-soft, #FEF2F2)', border: `1.5px solid #FCA5A5` }}>
          <p className="text-sm font-medium" style={{ color: 'var(--terra, #DC2626)' }}>⚠️ {error}</p>
        </div>
      )}

      {/* État vide */}
      {groups.length === 0 ? (
        <div className="text-center py-16 rounded-2xl" style={{ background: '#fff', border: `1.5px solid ${C.border}` }}>
          <div className="text-5xl mb-4">👥</div>
          <h2 className="font-display text-xl font-bold mb-2" style={{ color: C.navy }}>Aucun groupe</h2>
          <p className="text-sm mb-6" style={{ color: C.muted }}>Créez un groupe pour organiser vos voyages en commun</p>
          <Link href="/client/groupes/creer">
            <button className="inline-block px-6 py-3 rounded-xl font-semibold text-sm transition-all" style={{ background: C.terra, color: '#fff' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = C.terraLight;
                e.currentTarget.style.boxShadow = `0 6px 24px ${C.terra}30`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = C.terra;
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
              <div className="rounded-2xl p-6 h-full transition-all duration-300" style={{ background: '#fff', border: `1.5px solid ${C.border}` }}
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
                    <h3 className="font-bold text-base" style={{ color: C.navy }}>{group.name}</h3>
                    <p className="text-xs mt-1" style={{ color: C.muted }}>{group.travelTitle}</p>
                  </div>
                  <span className="px-3 py-1 rounded-xl text-xs font-semibold" style={{ background: C.forestBg, color: C.forest }}>
                    {group.status}
                  </span>
                </div>

                <div className="space-y-2 text-xs mb-6" style={{ color: C.muted }}>
                  <p>📍 {group.destinationCity}</p>
                  <p>📅 {formatDate(group.departureDate)}</p>
                  <p>👥 {group.memberCount} membre{group.memberCount > 1 ? 's' : ''}</p>
                </div>

                <button className="w-full px-4 py-3 rounded-xl font-semibold text-sm transition-all" style={{ background: '#fff', color: C.navy, border: `1.5px solid ${C.border}` }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = C.terraSoft;
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
