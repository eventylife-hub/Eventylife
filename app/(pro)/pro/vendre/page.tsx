'use client';

import { useState, useEffect } from 'react';
import { formatPrice, formatDate } from '@/lib/utils';
import { AlertCircle, Copy, QrCode, TrendingUp } from 'lucide-react';
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'Vendre | Eventy Pro',
  description: 'Vendez des voyages Eventy',
};

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
        const data = (await res.json() as unknown) as unknown;
        setTrips(data.trips || []);
        if (data.trips && data.trips.length > 0) {
          setSelectedTrip(data.trips[0].id);
        }
      } catch (err: unknown) {
        setError((err as Error).message);
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
          const data = (await res.json() as unknown) as unknown;
          setSellerLink(data.link);
          setStats(data.stats);
          setSales(data.sales || []);
          setSellerCode(data.link?.code || '');
        }
      } catch (err: unknown) {
        // Erreur silencieuse — les données se chargent au prochain retry
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
      const data = (await res.json() as unknown) as unknown;
      setSellerLink(data.link);
      setStats(data.stats);
      setSales(data.sales || []);
    } catch (err: unknown) {
      setError((err as Error).message);
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
      <div className="pro-fade-in p-6 space-y-6">
        <div style={{ height: '2.5rem', background: '#FEFCF3', borderRadius: '0.5rem', width: '16rem', animation: 'pulse 2s infinite' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ height: '10rem', background: '#FEFCF3', borderRadius: '0.5rem', animation: 'pulse 2s infinite' }} />
          <div style={{ height: '10rem', background: '#FEFCF3', borderRadius: '0.5rem', animation: 'pulse 2s infinite' }} />
        </div>
        <div style={{ height: '24rem', background: '#FEFCF3', borderRadius: '0.5rem', animation: 'pulse 2s infinite' }} />
      </div>
    );
  }

  return (
    <div className="pro-fade-in p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#0A1628', fontFamily: 'var(--font-fraunces, Fraunces, serif)' }}>
          Vendre rapidement
        </h1>
        <p style={{ color: '#666', marginTop: '0.5rem', fontSize: '0.875rem' }}>
          Créez un lien parrain pour vendre une place à un voyage
        </p>
      </div>

      {error && (
        <div
          style={{
            padding: '1rem',
            background: '#fee2e2',
            border: '1px solid #fecaca',
            borderRadius: '0.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertCircle className="h-4 w-4" style={{ color: '#dc2626' }} />
            <span style={{ color: '#b91c1c', fontSize: '0.875rem' }}>{error}</span>
          </div>
          <button
            onClick={() => setError(null)}
            style={{
              padding: '0.25rem 0.75rem',
              background: 'white',
              border: '1px solid #991b1b',
              borderRadius: '0.25rem',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: '500',
              color: '#991b1b',
            }}
          >
            Fermer
          </button>
        </div>
      )}

      {trips.length === 0 ? (
        <div className="pro-panel" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <TrendingUp className="h-12 w-12 mx-auto" style={{ color: '#999', marginBottom: '1rem' }} />
          <h3 style={{ fontWeight: '600', fontSize: '1.125rem', marginBottom: '0.5rem', color: '#0A1628' }}>
            Aucun voyage actif
          </h3>
          <p style={{ color: '#666', marginBottom: '1rem', fontSize: '0.875rem' }}>
            Vous devez créer un voyage avant de pouvoir générer un lien de vente
          </p>
          <button
            onClick={() => (window.location.href = '/pro/voyages/nouveau')}
            className="pro-btn-sun"
          >
            Créer un voyage
          </button>
        </div>
      ) : (
        <>
          {/* Trip Selection and Code Input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Voyage</CardTitle>
              </CardHeader>
              <CardContent>
                <select
                  value={selectedTrip}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSelectedTrip((e.target as HTMLInputElement).value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {trips.map((trip: unknown) => (
                    <option key={trip.id} value={trip.id}>
                      {trip.name} ({formatDate(trip.startDate)})
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-2">
                  Sélectionnez le voyage pour lequel vous souhaitez créer un lien de vente
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Code vendeur</CardTitle>
              </CardHeader>
              <CardContent>
                <input
                  type="text"
                  value={sellerCode}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSellerCode((e.target as HTMLInputElement).value)}
                  placeholder="p.ex. VENDEUR123"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Code unique pour identifier vos ventes
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerateLink}
            disabled={generating || !selectedTrip || !sellerCode}
            size="lg"
            className="w-full"
          >
            {generating ? 'Génération en cours...' : 'Générer le lien de vente'}
          </Button>

          {/* Seller Link Display */}
          {sellerLink && (
            <Card>
              <CardHeader>
                <CardTitle>Votre lien de vente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Link Display */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Lien de réservation</p>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={sellerLink.url}
                        readOnly
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50"
                      />
                      <Button onClick={handleCopyLink} size="sm" variant="outline">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    {copyFeedback && (
                      <p className="text-xs text-green-600 font-medium">{copyFeedback}</p>
                    )}
                  </div>

                  {/* QR Code */}
                  {sellerLink.qrCodeUrl && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">QR Code</p>
                      <div className="border border-gray-200 rounded-lg p-2 bg-white">
                        <img
                          src={sellerLink.qrCodeUrl}
                          alt="QR Code"
                          className="w-full h-auto"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm text-gray-600">Clics</div>
                  <div className="text-3xl font-bold mt-2">{stats.clicks}</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm text-gray-600">Conversions</div>
                  <div className="text-3xl font-bold mt-2 text-green-600">{stats.conversions}</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm text-gray-600">Taux de conversion</div>
                  <div className="text-3xl font-bold mt-2">
                    {(stats.conversionRate * 100).toFixed(1)}%
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm text-gray-600">Revenus attribués</div>
                  <div className="text-3xl font-bold mt-2 text-blue-600">
                    {formatPrice(stats.revenue)}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Recent Sales */}
          {sales.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Ventes récentes</CardTitle>
                <CardDescription>
                  {sales.length} vente{sales.length > 1 ? 's' : ''} via ce lien
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {sales.map((sale: unknown) => (
                    <div
                      key={sale.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div>
                        <p className="font-medium">{sale.clientName}</p>
                        <p className="text-sm text-gray-600">
                          {formatDate(sale.date)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Réf: {sale.bookingReference}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatPrice(sale.amount)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {sales.length === 0 && stats && (
            <Card>
              <CardContent className="pt-12 pb-12">
                <div className="text-center">
                  <p className="text-gray-500">
                    Aucune vente pour le moment. Partagez votre lien pour commencer!
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
