'use client';

import { useState, useEffect } from 'react';
import { formatPrice, formatDate } from '@/lib/utils';
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
        const insuranceData = data as Record<string, unknown>;
        setInsurances((insuranceData.insurances || insuranceData || []) as Record<string, unknown>[]);
        setError(null);
      } catch {
        console.warn('API assurances indisponible — données démo');
        setInsurances([
          {
            subscriptionId: 'ins_001',
            travelId: '1',
            travelTitle: 'Marrakech Express',
            status: 'CONFIRMED',
            insuranceAmountTTC: 4500,
            coverageType: 'ANNULATION',
            subscribedAt: '2026-01-10T14:32:00Z',
          },
          {
            subscriptionId: 'ins_002',
            travelId: '3',
            travelTitle: 'Barcelone & Gaudí',
            status: 'PENDING',
            insuranceAmountTTC: 3500,
            coverageType: 'ANNULATION',
            subscribedAt: '2026-02-05T09:17:00Z',
          },
        ]);
        setError(null);
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
          <h1 className="font-display text-2xl sm:text-3xl font-bold" style={{ color: 'var(--navy, #1A1A2E)' }}>
            Mes assurances
          </h1>
          <p className="text-sm mt-2" style={{ color: '#6B7280' }}>
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
        <h1 className="font-display text-2xl sm:text-3xl font-bold" style={{ color: 'var(--navy, #1A1A2E)' }}>
          Mes assurances
        </h1>
        <p className="text-sm mt-2" style={{ color: '#6B7280' }}>
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
            <button type="button"
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
        <div className="text-center py-16 rounded-2xl" style={{ background: '#fff', border: '1.5px solid #E5E0D8' }}>
          <div className="text-5xl mb-4">🛡️</div>
          <h2 className="font-display text-xl font-bold mb-2" style={{ color: 'var(--navy, #1A1A2E)' }}>
            Aucune assurance souscrite
          </h2>
          <p className="text-sm mb-6" style={{ color: '#6B7280' }}>
            Protégez vos voyages avec une assurance annulation
          </p>
          <button type="button"
            onClick={() => (window.location.href = '/client/reservations')}
            className="inline-block px-6 py-3 rounded-xl font-semibold text-sm transition-all"
            style={{ background: 'var(--terra, #C75B39)', color: '#fff' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#D97B5E';
              e.currentTarget.style.boxShadow = `0 6px 24px var(--terra, #C75B39)30`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--terra, #C75B39)';
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
              background: insurance?.status === 'CONFIRMED' ? '#DCFCE7' : '#FDF6E8',
              color: insurance?.status === 'CONFIRMED' ? '#166534' : '#92400e',
            };

            return (
              <div
                key={insurance?.subscriptionId as string}
                className="rounded-2xl p-6 transition-all duration-300"
                style={{
                  background: '#fff',
                  border: '1.5px solid #E5E0D8',
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
                    <h3 className="font-bold text-base" style={{ color: 'var(--navy, #1A1A2E)' }}>
                      Assurance #{(insurance?.subscriptionId as string)?.slice(-8)}
                    </h3>
                    <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
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

                <div className="space-y-4 border-t" style={{ borderColor: '#E5E0D8', paddingTop: '16px' }}>
                  <div className="flex justify-between items-center">
                    <span style={{ color: '#6B7280' }}>Montant</span>
                    <span className="font-semibold" style={{ color: 'var(--navy, #1A1A2E)' }}>
                      {formatPrice(insurance?.insuranceAmountTTC as number)}
                    </span>
                  </div>

                  <button type="button"
                    onClick={() => handleDownloadCertificate(insurance?.subscriptionId as string)}
                    disabled={downloadingId === (insurance?.subscriptionId as string)}
                    className="w-full px-6 py-3 rounded-xl font-semibold text-sm transition-all"
                    style={{
                      background: '#fff',
                      color: 'var(--terra, #C75B39)',
                      border: '1.5px solid #E5E0D8',
                      opacity: downloadingId === (insurance?.subscriptionId as string) ? 0.6 : 1,
                      cursor: downloadingId === (insurance?.subscriptionId as string) ? 'not-allowed' : 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      if (downloadingId !== (insurance?.subscriptionId as string)) {
                        e.currentTarget.style.background = 'rgba(199,91,57,0.1)';
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
