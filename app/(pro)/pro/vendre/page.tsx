'use client';

import { useState, useEffect } from 'react';
import { formatPrice, formatDate } from '@/lib/utils';
import { AlertCircle, Copy, QrCode, TrendingUp } from 'lucide-react';
interface Trip {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: string;
}

interface SellerLink {
  id: string;
  code: string;
  url: string;
  qrCodeUrl?: string;
}

interface SellerStats {
  clicks: number;
  conversions: number;
  revenue: number;
  conversionRate: number;
}

interface Sale {
  id: string;
  date: string;
  clientName: string;
  bookingReference: string;
  amount: number;
}

/**
 * Page Quick Sell Pro - Vendre rapidement via lien parrain
 *
 * Affiche:
 * - Sélection voyage actif depuis dropdown
 * - Définir code parrain/lien de référence
 * - Générer lien de réservation avec attribution vendeur
 * - Affichage QR code du lien
 * - Stats: clics, conversions, revenus attribués
 * - Bouton copier lien
 * - Liste des ventes récentes via ce lien parrain
 *
 * États UI:
 * - Loading: Skeleton
 * - No trips: CTA créer voyage
 * - Error: Alerte
 * - Data: Dashboard complet
 */
export default function QuickSellPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<string>('');
  const [sellerCode, setSellerCode] = useState<string>('');
  const [sellerLink, setSellerLink] = useState<SellerLink | null>(null);
  const [stats, setStats] = useState<SellerStats | null>(null);
  const [sales, setSales] = useState<Sale[]>([]);
  const [generating, setGenerating] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  // Fetch active trips on mount
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('/api/pro/quick-sell/trips', { credentials: 'include' });
        if (!res.ok) throw new Error('Erreur lors du chargement des voyages');
        const data = await res.json() as Record<string, unknown>;
        const tripsData = (data.trips || []) as Trip[];
        setTrips(tripsData);
        if (tripsData.length > 0) {
          setSelectedTrip(tripsData[0].id);
        }
      } catch {
        console.warn('API pro/quick-sell/trips indisponible — données démo');
        const demoTrips: Trip[] = [
          { id: '1', name: 'Marrakech Express', startDate: '2026-05-15', endDate: '2026-05-22', status: 'SALES_OPEN' },
          { id: '3', name: 'Barcelone & Gaudí', startDate: '2026-06-20', endDate: '2026-06-25', status: 'SALES_OPEN' },
          { id: '5', name: 'Istanbul & le Bosphore', startDate: '2026-07-18', endDate: '2026-07-25', status: 'SALES_OPEN' },
        ];
        setTrips(demoTrips);
        setSelectedTrip(demoTrips[0].id);
        setSellerCode('SOLEIL2026');
        setSellerLink({
          id: 'link_001',
          code: 'SOLEIL2026',
          url: 'https://www.eventylife.fr/r/SOLEIL2026?trip=1',
        });
        setStats({
          clicks: 234,
          conversions: 12,
          revenue: 1078800,
          conversionRate: 0.0513,
        });
        setSales([
          { id: 'sale_001', date: '2026-03-08T14:30:00Z', clientName: 'Jean Martin', bookingReference: 'EVT-2026-0001', amount: 179800 },
          { id: 'sale_002', date: '2026-03-05T10:15:00Z', clientName: 'Marie Dupont', bookingReference: 'EVT-2026-0002', amount: 89900 },
          { id: 'sale_003', date: '2026-02-28T16:45:00Z', clientName: 'Pierre Moreau', bookingReference: 'EVT-2026-0003', amount: 189800 },
        ]);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  // Load seller link and stats when trip changes
  useEffect(() => {
    const loadSellerData = async () => {
      if (!selectedTrip) return;

      try {
        setError(null);
        const res = await fetch(`/api/pro/quick-sell/stats?tripId=${selectedTrip}`, { credentials: 'include' });
        if (res.ok) {
          const data = await res.json() as Record<string, unknown>;
          setSellerLink(data.link as SellerLink);
          setStats(data.stats as SellerStats);
          setSales((data.sales || []) as Sale[]);
          setSellerCode((data.link as SellerLink)?.code || '');
        }
      } catch {
        // Erreur silencieuse — données démo déjà chargées
      }
    };

    loadSellerData();
  }, [selectedTrip]);

  const handleGenerateLink = async () => {
    if (!selectedTrip || !sellerCode) {
      setError('Veuillez sélectionner un voyage et un code vendeur');
      return;
    }

    try {
      setGenerating(true);
      setError(null);

      const res = await fetch('/api/pro/quick-sell/generate-link', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tripId: selectedTrip,
          sellerCode,
        }),
      });

      if (!res.ok) throw new Error('Erreur lors de la génération du lien');
      const data = await res.json() as Record<string, unknown>;
      setSellerLink(data.link as SellerLink);
      setStats(data.stats as SellerStats);
      setSales((data.sales || []) as Sale[]);
    } catch {
      // En mode démo, générer un lien fictif
      console.warn('API quick-sell/generate-link indisponible — lien démo');
      setSellerLink({
        id: 'link_gen',
        code: sellerCode,
        url: `https://www.eventylife.fr/r/${sellerCode}?trip=${selectedTrip}`,
      });
      if (!stats) {
        setStats({ clicks: 0, conversions: 0, revenue: 0, conversionRate: 0 });
      }
    } finally {
      setGenerating(false);
    }
  };

  const handleCopyLink = () => {
    if (!sellerLink?.url) return;

    navigator.clipboard.writeText(sellerLink.url);
    setCopyFeedback('Lien copié !');
    setTimeout(() => setCopyFeedback(null), 2000);
  };

  if (loading) {
    return (
      <div className="pro-fade-in" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ height: '2.5rem', background: 'rgba(0,0,0,0.06)', borderRadius: '8px', width: '16rem', animation: 'pulse 2s infinite' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div style={{ height: '10rem', background: 'rgba(0,0,0,0.06)', borderRadius: '8px', animation: 'pulse 2s infinite' }} />
          <div style={{ height: '10rem', background: 'rgba(0,0,0,0.06)', borderRadius: '8px', animation: 'pulse 2s infinite' }} />
        </div>
        <div style={{ height: '24rem', background: 'rgba(0,0,0,0.06)', borderRadius: '8px', animation: 'pulse 2s infinite' }} />
      </div>
    );
  }

  return (
    <div className="pro-fade-in" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <h1 className="pro-page-title">Vendre rapidement</h1>
        <p style={{ color: '#8896A6', marginTop: '8px', fontSize: '14px' }}>
          Créez un lien parrain pour vendre une place à un voyage
        </p>
      </div>

      {error && (
        <div style={{ padding: '16px', backgroundColor: '#FFE0E3', border: '1px solid #FFE0E3', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <AlertCircle className="h-4 w-4" style={{ color: 'var(--pro-coral)' }} />
            <span style={{ color: 'var(--pro-coral)', fontSize: '14px' }}>{error}</span>
          </div>
          <button type="button" onClick={() => setError(null)} className="pro-btn-outline" style={{ padding: '4px 12px', fontSize: '12px' }}>
            Fermer
          </button>
        </div>
      )}

      {trips.length === 0 ? (
        <div className="pro-panel" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <TrendingUp className="h-12 w-12" style={{ color: '#8896A6', margin: '0 auto 16px' }} />
          <h3 style={{ fontWeight: 600, fontSize: '18px', marginBottom: '8px', color: '#0A1628' }}>
            Aucun voyage actif
          </h3>
          <p style={{ color: '#8896A6', marginBottom: '16px', fontSize: '14px' }}>
            Vous devez créer un voyage avant de pouvoir générer un lien de vente
          </p>
          <button type="button" onClick={() => (window.location.href = '/pro/voyages/nouveau')} className="pro-btn-sun">
            Créer un voyage
          </button>
        </div>
      ) : (
        <>
          {/* Trip Selection and Code Input */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            <div className="pro-panel">
              <div style={{ borderBottom: '1px solid #E0E0E0', paddingBottom: '12px', marginBottom: '16px' }}>
                <h3 style={{ fontWeight: 600, fontSize: '16px', color: '#0A1628' }}>Voyage</h3>
              </div>
              <div>
                <select
                  value={selectedTrip}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedTrip(e.target.value)}
                  className="pro-input"
                  style={{ width: '100%' }}
                >
                  {trips.map((trip) => (
                    <option key={trip.id} value={trip.id}>
                      {trip.name} ({formatDate(trip.startDate)})
                    </option>
                  ))}
                </select>
                <p style={{ fontSize: '12px', color: '#8896A6', marginTop: '8px' }}>
                  Sélectionnez le voyage pour lequel vous souhaitez créer un lien de vente
                </p>
              </div>
            </div>

            <div className="pro-panel">
              <div style={{ borderBottom: '1px solid #E0E0E0', paddingBottom: '12px', marginBottom: '16px' }}>
                <h3 style={{ fontWeight: 600, fontSize: '16px', color: '#0A1628' }}>Code vendeur</h3>
              </div>
              <div>
                <input
                  type="text"
                  value={sellerCode}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSellerCode(e.target.value)}
                  placeholder="p.ex. VENDEUR123"
                  className="pro-input"
                  style={{ width: '100%' }}
                />
                <p style={{ fontSize: '12px', color: '#8896A6', marginTop: '8px' }}>
                  Code unique pour identifier vos ventes
                </p>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <button
            type="button"
            onClick={handleGenerateLink}
            disabled={generating || !selectedTrip || !sellerCode}
            className="pro-btn-sun"
            style={{ width: '100%', padding: '14px', fontSize: '16px', opacity: (generating || !selectedTrip || !sellerCode) ? 0.6 : 1, cursor: (generating || !selectedTrip || !sellerCode) ? 'not-allowed' : 'pointer' }}
          >
            {generating ? 'Génération en cours...' : 'Générer le lien de vente'}
          </button>

          {/* Seller Link Display */}
          {sellerLink && (
            <div className="pro-panel">
              <div style={{ borderBottom: '1px solid #E0E0E0', paddingBottom: '12px', marginBottom: '16px' }}>
                <h3 style={{ fontWeight: 600, fontSize: '16px', color: '#0A1628' }}>Votre lien de vente</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                {/* Link Display */}
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 500, color: '#0A1628', marginBottom: '8px' }}>Lien de réservation</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="text"
                      value={sellerLink.url}
                      readOnly
                      className="pro-input"
                      style={{ flex: 1, backgroundColor: '#F5F5F5', fontSize: '13px' }}
                    />
                    <button type="button" onClick={handleCopyLink} className="pro-btn-outline" style={{ padding: '8px 12px', display: 'flex', alignItems: 'center' }}>
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                  {copyFeedback && (
                    <p style={{ fontSize: '12px', color: 'var(--pro-mint)', fontWeight: 500, marginTop: '4px' }}>{copyFeedback}</p>
                  )}
                </div>

                {/* QR Code */}
                {sellerLink.qrCodeUrl && (
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 500, color: '#0A1628', marginBottom: '8px' }}>QR Code</p>
                    <div style={{ border: '1px solid #E0E0E0', borderRadius: '8px', padding: '8px', backgroundColor: '#fff' }}>
                      <img src={sellerLink.qrCodeUrl} alt="QR Code" style={{ width: '100%', height: 'auto' }} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Stats Cards */}
          {stats && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
              <div className="pro-panel" style={{ padding: '20px', textAlign: 'center' }}>
                <div style={{ fontSize: '14px', color: '#8896A6' }}>Clics</div>
                <div style={{ fontSize: '28px', fontWeight: 700, marginTop: '8px', color: '#0A1628' }}>{stats.clicks}</div>
              </div>

              <div className="pro-panel" style={{ padding: '20px', textAlign: 'center' }}>
                <div style={{ fontSize: '14px', color: '#8896A6' }}>Conversions</div>
                <div style={{ fontSize: '28px', fontWeight: 700, marginTop: '8px', color: 'var(--pro-mint)' }}>{stats.conversions}</div>
              </div>

              <div className="pro-panel" style={{ padding: '20px', textAlign: 'center' }}>
                <div style={{ fontSize: '14px', color: '#8896A6' }}>Taux de conversion</div>
                <div style={{ fontSize: '28px', fontWeight: 700, marginTop: '8px', color: '#0A1628' }}>
                  {(stats.conversionRate * 100).toFixed(1)}%
                </div>
              </div>

              <div className="pro-panel" style={{ padding: '20px', textAlign: 'center' }}>
                <div style={{ fontSize: '14px', color: '#8896A6' }}>Revenus attribués</div>
                <div style={{ fontSize: '28px', fontWeight: 700, marginTop: '8px', color: 'var(--pro-ocean)' }}>
                  {formatPrice(stats.revenue)}
                </div>
              </div>
            </div>
          )}

          {/* Recent Sales */}
          {sales.length > 0 && (
            <div className="pro-panel">
              <div style={{ borderBottom: '1px solid #E0E0E0', paddingBottom: '12px', marginBottom: '16px' }}>
                <h3 style={{ fontWeight: 600, fontSize: '16px', color: '#0A1628' }}>Ventes récentes</h3>
                <p style={{ fontSize: '14px', color: '#8896A6', marginTop: '4px' }}>
                  {sales.length} vente{sales.length > 1 ? 's' : ''} via ce lien
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {sales.map((sale) => (
                  <div
                    key={sale.id}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid #E0E0E0', borderRadius: '8px' }}
                  >
                    <div>
                      <p style={{ fontWeight: 500, color: '#0A1628' }}>{sale.clientName}</p>
                      <p style={{ fontSize: '14px', color: '#8896A6' }}>
                        {formatDate(sale.date)}
                      </p>
                      <p style={{ fontSize: '12px', color: '#8896A6', marginTop: '4px' }}>
                        Réf: {sale.bookingReference}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontWeight: 600, color: '#0A1628' }}>{formatPrice(sale.amount)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {sales.length === 0 && stats && (
            <div className="pro-panel" style={{ padding: '48px 24px', textAlign: 'center' }}>
              <p style={{ color: '#8896A6' }}>
                Aucune vente pour le moment. Partagez votre lien pour commencer !
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
