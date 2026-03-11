'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/stores/auth-store';
import { formatPrice, formatDate } from '@/lib/utils';
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

        const profileRes = await fetch('/api/client/profile', {
          credentials: 'include',
        });

        if (!profileRes.ok) throw new Error('Impossible de charger le profil');

        const profileData = (await profileRes.json() as unknown) as unknown;

        const bookingsRes = await fetch('/api/client/bookings?limit=1', {
          credentials: 'include',
        });

        const bookingsData = bookingsRes.ok ? await bookingsRes.json() as unknown : { items: unknown[] };

        const nextTravel = bookingsData.items?.[0];

        setData({
          firstName: profileData.firstName || 'Client',
          lastName: profileData.lastName || '',
          stats: profileData.stats,
          nextTravel,
        });
      } catch (err: unknown) {
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
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // ── État : Erreur ──
  if (error) {
    return (
      <div className="text-center py-16">
        <div
          className="inline-block p-8 rounded-2xl"
          style={{ background: '#fff', border: `1.5px solid ${C.border}` }}
        >
          <p className="text-base mb-4" style={{ color: 'var(--terra, #DC2626)' }}>⚠️ {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 rounded-xl font-semibold text-sm transition-all"
            style={{ background: C.terra, color: '#fff' }}
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  // ── État : Chargement ──
  if (loading || !data) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="h-28 rounded-2xl skeleton" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 rounded-2xl skeleton" />
          ))}
        </div>
      </div>
    );
  }

  const days = data?.nextTravel ? daysUntilDeparture(data.nextTravel.departureDate) : null;

  return (
    <div className="space-y-8 animate-fade-up">
      {/* ── En-tête bienvenue ── */}
      <div
        className="rounded-2xl p-8"
        style={{
          background: `linear-gradient(135deg, ${C.navy}, ${C.navy}dd)`,
          color: '#FAF7F2',
        }}
      >
        <h1 className="font-display text-2xl sm:text-3xl font-bold mb-2">
          Bienvenue, {data.firstName} !
        </h1>
        <p style={{ color: 'rgba(250,247,242,0.7)' }}>
          Gérez vos réservations et votre profil depuis votre espace personnel
        </p>
      </div>

      {/* ── Statistiques ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Voyages réservés', value: data.stats.totalBookings || 0, color: C.navy },
          { label: 'Confirmées', value: data.stats.confirmedBookings || 0, color: C.forest },
          { label: 'En attente', value: data.stats.pendingBookings || 0, color: '#92400e' },
          { label: 'Montant dépensé', value: formatPrice(data.stats.totalAmountSpentCents || 0), color: C.terra },
        ].map((stat, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl transition-all duration-300"
            style={{
              background: '#fff',
              border: `1.5px solid ${C.border}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(26,26,46,0.06)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <p className="text-xs font-medium mb-1" style={{ color: C.muted }}>{stat.label}</p>
            <p className="text-2xl font-bold" style={{ color: stat.color }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* ── Prochain voyage ── */}
      {data.nextTravel && (
        <div
          className="rounded-2xl overflow-hidden transition-all duration-300"
          style={{
            background: '#fff',
            border: `1.5px solid ${C.border}`,
          }}
        >
          <div className="flex flex-col md:flex-row">
            {data.nextTravel.coverImageUrl && (
              <div className="md:w-1/3 h-48 md:h-auto flex-shrink-0" style={{ background: C.cream }}>
                <img
                  src={data.nextTravel.coverImageUrl}
                  alt={data.nextTravel.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: C.gold }}>
                  Prochain voyage
                </span>
                <h3 className="font-display text-xl font-bold mt-1 mb-2" style={{ color: C.navy }}>
                  {data.nextTravel.title}
                </h3>
                <p className="text-sm mb-1" style={{ color: C.muted }}>
                  📍 {data.nextTravel.destinationCity}
                </p>
                <p className="text-xs mb-4" style={{ color: '#9CA3AF' }}>
                  Départ : {formatDate(data.nextTravel.departureDate)}
                </p>
                {days !== null && (
                  <div
                    className="inline-block px-4 py-2 rounded-xl text-sm font-semibold"
                    style={{
                      background: days > 0 ? C.goldSoft : C.forestBg,
                      color: days > 0 ? '#92400e' : C.forest,
                    }}
                  >
                    {days > 0 ? `⏱ ${days} jours avant le départ` : '🎉 Voyage en cours'}
                  </div>
                )}
              </div>
              <Link
                href={`/client/reservations/${data.nextTravel.id}`}
                className="inline-block mt-4 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 w-fit"
                style={{ background: C.terra, color: '#fff' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = C.terraLight;
                  e.currentTarget.style.boxShadow = `0 6px 24px ${C.terra}30`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = C.terra;
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Voir les détails →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── Actions rapides ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { href: '/client/reservations', icon: '📋', title: 'Mes réservations', desc: 'Voir toutes vos réservations', accent: C.terra },
          { href: '/client/groupes', icon: '👥', title: 'Mes groupes', desc: 'Gérez vos groupes de voyage', accent: C.forest },
          { href: '/client/profil', icon: '⚙️', title: 'Mon profil', desc: 'Modifiez vos informations', accent: C.gold },
        ].map((action, i) => (
          <Link key={i} href={action.href} className="group">
            <div
              className="p-6 rounded-2xl h-full transition-all duration-300"
              style={{
                background: '#fff',
                border: `1.5px solid ${C.border}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 28px rgba(26,26,46,0.08)';
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.borderColor = action.accent;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = C.border;
              }}
            >
              <div className="text-3xl mb-3">{action.icon}</div>
              <h3 className="font-bold text-sm mb-1" style={{ color: C.navy }}>{action.title}</h3>
              <p className="text-xs" style={{ color: C.muted }}>{action.desc}</p>
              <p
                className="text-xs font-semibold mt-3 group-hover:translate-x-1 transition-transform"
                style={{ color: action.accent }}
              >
                Accéder →
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* ── CTA découverte ── */}
      {(!data.stats.totalBookings || data.stats.totalBookings === 0) && (
        <div
          className="rounded-2xl p-8 text-center"
          style={{ background: C.navy, color: '#FAF7F2' }}
        >
          <h2 className="font-display text-xl font-bold mb-3">Aucune réservation pour le moment</h2>
          <p className="mb-6 text-sm" style={{ color: 'rgba(250,247,242,0.6)' }}>
            Découvrez nos plus beaux voyages et réservez votre prochaine aventure !
          </p>
          <Link
            href="/voyages"
            className="inline-block px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-200"
            style={{ background: C.terra, color: '#fff' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = C.terraLight;
              e.currentTarget.style.boxShadow = `0 6px 24px ${C.terra}30`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = C.terra;
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Découvrir les voyages →
          </Link>
        </div>
      )}
    </div>
  );
}
