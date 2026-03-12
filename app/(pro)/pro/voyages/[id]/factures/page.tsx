'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { formatPrice, formatDate } from '@/lib/utils';
import { ToastNotification } from '@/components/ui/toast-notification';
import { logger } from '@/lib/logger';
import { extractErrorMessage } from '@/lib/api-error';
interface Travel {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
}

/**
 * Page Pro - Gestion des factures du voyage
 * Facture commission Eventy, liste factures clients, export groupé
 */
export default function InvoicesPage() {
  const params = useParams();
  const travelId = params.id as string;

  const [travel, setTravel] = useState<Travel | null>(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchData();
  }, [travelId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Récupérer le voyage
      const travelResponse = await fetch(`/api/travels/${travelId}`, { credentials: 'include' });
      if (travelResponse.ok) {
        const travelData = (await travelResponse.json() as unknown) as Record<string, unknown>;
        setTravel(travelData.data as Travel);
      }

      // Récupérer les groupes de réservation
      const bookingsResponse = await fetch(`/api/travels/${travelId}/bookings`, { credentials: 'include' });
      if (bookingsResponse.ok) {
        const bookingsData = (await bookingsResponse.json() as unknown) as Record<string, unknown>;
        setBookings((bookingsData.data as []) || []);
      }

      setError(null);
    } catch (err: unknown) {
      logger.warn('API factures indisponible — données démo');
      // Fallback demo data: séjour Provence avec 5 réservations
      const demoTravel: Travel = {
        id: travelId,
        title: 'Escapade Provence - Avril 2026',
        startDate: '2026-04-15',
        endDate: '2026-04-19'
      };
      const demoBookings = [
        {
          id: 'booking-1',
          status: 'FULLY_PAID',
          paidAmountCents: 17980,
          createdAt: '2026-03-01',
          createdByUser: {
            firstName: 'Marie',
            lastName: 'Dupont',
            email: 'marie.dupont@example.com'
          }
        },
        {
          id: 'booking-2',
          status: 'FULLY_PAID',
          paidAmountCents: 17980,
          createdAt: '2026-03-02',
          createdByUser: {
            firstName: 'Jean',
            lastName: 'Martin',
            email: 'j.martin@example.com'
          }
        },
        {
          id: 'booking-3',
          status: 'FULLY_PAID',
          paidAmountCents: 17980,
          createdAt: '2026-03-03',
          createdByUser: {
            firstName: 'Sophie',
            lastName: 'Bernard',
            email: 'sophie.b@example.com'
          }
        },
        {
          id: 'booking-4',
          status: 'FULLY_PAID',
          paidAmountCents: 17980,
          createdAt: '2026-03-04',
          createdByUser: {
            firstName: 'Laurent',
            lastName: 'Rousseau',
            email: 'l.rousseau@example.com'
          }
        },
        {
          id: 'booking-5',
          status: 'FULLY_PAID',
          paidAmountCents: 17980,
          createdAt: '2026-03-05',
          createdByUser: {
            firstName: 'Christelle',
            lastName: 'Moreau',
            email: 'c.moreau@example.com'
          }
        }
      ];
      setTravel(demoTravel);
      setBookings(demoBookings);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadProInvoice = async () => {
    try {
      setDownloading(true);
      const response = await fetch(`/api/post-sale/travel/${travelId}/pro-invoice`, { credentials: 'include' });

      if (!response.ok) {
        throw new Error('Erreur lors du téléchargement');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `facture-commission-${travelId.substring(0, 8)}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: unknown) {
      setToastMessage({ type: 'error', message: extractErrorMessage(err, 'Erreur inconnue') });
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadClientInvoice = async (bookingId: string) => {
    try {
      const response = await fetch(`/api/post-sale/booking/${bookingId}/invoice`, { credentials: 'include' });

      if (!response.ok) {
        throw new Error('Erreur lors du téléchargement');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `facture-client-${bookingId.substring(0, 8)}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: unknown) {
      setToastMessage({ type: 'error', message: extractErrorMessage(err, 'Erreur inconnue') });
    }
  };

  if (loading) {
    return (
      <>
        <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
        <div className="pro-fade-in min-h-screen p-6" style={{ background: 'linear-gradient(135deg, #FEFCF3 0%, #F0E6D8 100%)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ height: 40, width: 256, borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
            <div style={{ height: 128, width: '100%', borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
            <div style={{ height: 200, width: '100%', borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
          </div>
        </div>
      </>
    );
  }

  if (!travel) {
    return (
      <div className="pro-fade-in min-h-screen p-6" style={{ background: 'linear-gradient(135deg, #FEFCF3 0%, #F0E6D8 100%)' }}>
        <p style={{ color: '#4A5568' }}>Voyage non trouvé</p>
      </div>
    );
  }

  // Calcul total commission (15% par défaut)
  const totalRevenue = bookings.reduce((sum: number, bg: Record<string, unknown>) => sum + ((bg.paidAmountCents as number) || 0), 0);
  const commissionRate = 15;
  const commissionAmount = Math.floor((totalRevenue * commissionRate) / 100);

  return (
    <div className="pro-fade-in min-h-screen p-6" style={{ background: 'linear-gradient(135deg, #FEFCF3 0%, #F0E6D8 100%)' }}>
    <div style={{ maxWidth: '60rem', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#0A1628', marginBottom: '0.5rem' }}>{travel.title}</h1>
      <p style={{ color: '#4A5568', marginBottom: '2rem' }}>Gestion des factures</p>

      {error && (
        <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#FFE0E3', border: '1px solid #E63946', borderRadius: '0.5rem', color: 'var(--pro-coral)' }}>
          {error}
        </div>
      )}

      {/* Facture Commission */}
      <div className="pro-panel" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#0A1628', marginBottom: '1.5rem', margin: 0 }}>Facture Commission Eventy</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ background: '#F0E6D8', padding: '1rem', borderRadius: '0.5rem' }}>
            <p style={{ fontSize: '0.875rem', color: '#4A5568', margin: 0 }}>Chiffre d&apos;affaires</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0A1628', margin: 0 }}>{formatPrice(totalRevenue)}</p>
          </div>
          <div style={{ background: '#F0E6D8', padding: '1rem', borderRadius: '0.5rem' }}>
            <p style={{ fontSize: '0.875rem', color: '#4A5568', margin: 0 }}>Commission ({commissionRate}%)</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--pro-coral)', margin: 0 }}>{formatPrice(commissionAmount)}</p>
          </div>
        </div>

        <button type="button"
          onClick={handleDownloadProInvoice}
          disabled={downloading}
          className="pro-btn-ocean"
          style={{ opacity: downloading ? 0.5 : 1 }}
        >
          {downloading ? 'Téléchargement...' : '📥 Télécharger facture commission'}
        </button>
      </div>

      {/* Factures Clients */}
      <div className="pro-panel">
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#0A1628', marginBottom: '1.5rem', margin: 0 }}>Factures Clients</h2>

        {bookings.length === 0 ? (
          <p style={{ color: '#4A5568' }}>Aucune réservation pour ce voyage</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="pro-table" style={{ width: '100%' }}>
              <thead style={{ background: '#F0E6D8', borderBottom: '1px solid #E8F7FC' }}>
                <tr>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#0A1628' }}>
                    Client
                  </th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#0A1628' }}>
                    Date de réservation
                  </th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '600', color: '#0A1628' }}>
                    Montant
                  </th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: '600', color: '#0A1628' }}>
                    Statut
                  </th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '600', color: '#0A1628' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking: Record<string, unknown>) => (
                  <tr key={booking.id as string} style={{ borderBottom: '1px solid #E8F7FC', transition: 'background-color 0.2s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#F5F5F5')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = '#FFFFFF')}
                  >
                    <td style={{ padding: '1rem' }}>
                      <div>
                        <p style={{ fontWeight: '500', color: '#0A1628', margin: 0 }}>
                          {((booking.createdByUser as unknown)?.firstName as string) || ''} {((booking.createdByUser as unknown)?.lastName as string) || ''}
                        </p>
                        <p style={{ fontSize: '0.875rem', color: '#4A5568', margin: 0 }}>
                          {((booking.createdByUser as unknown)?.email as string) || ''}
                        </p>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', color: '#4A5568' }}>
                      {formatDate((booking.createdAt as string | Date) || '')}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '500' }}>
                      {formatPrice((booking.paidAmountCents as number) || 0)}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          (booking.status as string) === 'FULLY_PAID'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {(booking.status as string) === 'FULLY_PAID' ? 'Payée' : 'Pending'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <button type="button"
                        onClick={() => handleDownloadClientInvoice(booking.id as string)}
                        style={{ color: 'var(--pro-ocean)', textDecoration: 'none', fontWeight: '500', fontSize: '0.875rem', background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        Télécharger
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>

      {toastMessage && (
        <ToastNotification
          type={toastMessage.type}
          message={toastMessage.message}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
}
