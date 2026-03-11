'use client';

import { useState, useEffect } from 'react';
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

/**
 * Page Mes Assurances - Vue client
 *
 * Affiche:
 * - Liste souscriptions avec statut, couverture, prix
 * - Télécharger certificat PDF
 * - Bouton souscrire pour réservations sans assurance
 *
 * États UI:
 * - Loading: Skeleton
 * - Empty: CTA souscrire
 * - Error: Toast
 * - Data: Cartes assurances
 */
export default function AssurancePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [insurances, setInsurances] = useState<Record<string, unknown>[]>([]);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchInsurances = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/insurance/mine', {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Erreur chargement assurances');

        const data = (await res.json() as unknown) as unknown;
        setInsurances(data.insurances);
        setError(null);
      } catch (err: unknown) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchInsurances();
  }, []);

  const handleDownloadCertificate = async (subscriptionId: string) => {
    try {
      setDownloadingId(subscriptionId);
      const res = await fetch(`/api/insurance/${subscriptionId}/certificate`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Erreur téléchargement');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificate-${subscriptionId}.pdf`;
      a.click();
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-up">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold" style={{ color: C.navy }}>
            Mes assurances
          </h1>
          <p className="text-sm mt-2" style={{ color: C.muted }}>
            Gestion de vos assurances voyages
          </p>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 rounded-2xl skeleton" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-up">
      {/* En-tête */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold" style={{ color: C.navy }}>
          Mes assurances
        </h1>
        <p className="text-sm mt-2" style={{ color: C.muted }}>
          Gestion de vos assurances voyages
        </p>
      </div>

      {/* Erreur */}
      {error && (
        <div className="p-6 rounded-2xl" style={{ background: 'var(--terra-soft, #FEF2F2)', border: '1.5px solid #FCA5A5' }}>
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium" style={{ color: 'var(--terra, #DC2626)' }}>
              ⚠️ {error}
            </p>
            <button
              onClick={() => setError(null)}
              className="px-4 py-2 rounded-xl font-semibold text-sm transition-all"
              style={{
                background: '#fff',
                color: 'var(--terra, #DC2626)',
                border: '1.5px solid #FCA5A5',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#FCA5A5';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#fff';
                e.currentTarget.style.color = 'var(--terra, #DC2626)';
              }}
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* État vide */}
      {insurances.length === 0 ? (
        <div className="text-center py-16 rounded-2xl" style={{ background: '#fff', border: `1.5px solid ${C.border}` }}>
          <div className="text-5xl mb-4">🛡️</div>
          <h2 className="font-display text-xl font-bold mb-2" style={{ color: C.navy }}>
            Aucune assurance souscrite
          </h2>
          <p className="text-sm mb-6" style={{ color: C.muted }}>
            Protégez vos voyages avec une assurance annulation
          </p>
          <button
            onClick={() => (window.location.href = '/client/reservations')}
            className="inline-block px-6 py-3 rounded-xl font-semibold text-sm transition-all"
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
            Souscrire une assurance →
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {insurances.map((insurance) => {
            const statusBadgeStyle = {
              background: insurance?.status === 'CONFIRMED' ? C.forestBg : C.goldSoft,
              color: insurance?.status === 'CONFIRMED' ? C.forest : '#92400e',
            };

            return (
              <div
                key={insurance?.subscriptionId as string}
                className="rounded-2xl p-6 transition-all duration-300"
                style={{
                  background: '#fff',
                  border: `1.5px solid ${C.border}`,
                }}
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
                    <h3 className="font-bold text-base" style={{ color: C.navy }}>
                      Assurance #{(insurance?.subscriptionId as string)?.slice(-8)}
                    </h3>
                    <p className="text-sm mt-1" style={{ color: C.muted }}>
                      Souscrite le {formatDate(insurance?.subscribedAt as string | Date)}
                    </p>
                  </div>
                  <span
                    className="px-3 py-1 rounded-xl text-xs font-semibold"
                    style={statusBadgeStyle}
                  >
                    {insurance?.status === 'CONFIRMED' ? 'Confirmée' : 'En attente'}
                  </span>
                </div>

                <div className="space-y-4 border-t" style={{ borderColor: C.border, paddingTop: '16px' }}>
                  <div className="flex justify-between items-center">
                    <span style={{ color: C.muted }}>Montant</span>
                    <span className="font-semibold" style={{ color: C.navy }}>
                      {formatPrice(insurance?.insuranceAmountTTC as number)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDownloadCertificate(insurance?.subscriptionId as string)}
                    disabled={downloadingId === (insurance?.subscriptionId as string)}
                    className="w-full px-6 py-3 rounded-xl font-semibold text-sm transition-all"
                    style={{
                      background: '#fff',
                      color: C.terra,
                      border: `1.5px solid ${C.border}`,
                      opacity: downloadingId === (insurance?.subscriptionId as string) ? 0.6 : 1,
                      cursor: downloadingId === (insurance?.subscriptionId as string) ? 'not-allowed' : 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      if (downloadingId !== (insurance?.subscriptionId as string)) {
                        e.currentTarget.style.background = C.terraSoft;
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#fff';
                    }}
                  >
                    ⬇️ {downloadingId === insurance.subscriptionId ? 'Téléchargement...' : 'Télécharger certificat'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
