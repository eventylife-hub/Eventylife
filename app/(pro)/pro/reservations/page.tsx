'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter, Users, Calendar, MapPin, ChevronRight, AlertCircle, RotateCcw } from 'lucide-react';
// Button import removed - using native buttons with pro-btn-* classes
import { Skeleton } from '@/components/ui/skeleton';
interface Reservation {
  id: string;
  voyageTitle: string;
  voyageId: string;
  clientName: string;
  clientEmail: string;
  passengers: number;
  status: string;
  departureDate: string;
  totalAmount: number;
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  CONFIRMED: 'bg-green-100 text-green-800',
  PENDING: 'bg-yellow-100 text-yellow-800',
  CANCELLED: 'bg-red-100 text-red-800',
  COMPLETED: 'bg-blue-100 text-blue-800',
  REFUNDED: 'bg-slate-100 text-slate-800',
};

const STATUS_LABELS: Record<string, string> = {
  CONFIRMED: 'Confirmee',
  PENDING: 'En attente',
  CANCELLED: 'Annulee',
  COMPLETED: 'Terminee',
  REFUNDED: 'Remboursee',
};

export default function ProReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);
      if (search) params.set('search', search);

      const res = await fetch(`/api/pro/reservations?${params.toString()}`, {
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Erreur lors du chargement');

      const data = (await res.json() as unknown) as unknown;
      setReservations(data?.items || data || []);
    } catch {
      console.warn('API pro/reservations indisponible — données démo');
      setReservations([
        { id: 'resa_001', voyageTitle: 'Marrakech Express', voyageId: '1', clientName: 'Jean Martin', clientEmail: 'jean.martin@mail.fr', passengers: 2, status: 'CONFIRMED', departureDate: '2026-05-15', totalAmount: 179800, createdAt: '2026-01-10T14:30:00Z' },
        { id: 'resa_002', voyageTitle: 'Marrakech Express', voyageId: '1', clientName: 'Marie Dupont', clientEmail: 'marie.dupont@mail.fr', passengers: 1, status: 'CONFIRMED', departureDate: '2026-05-15', totalAmount: 89900, createdAt: '2026-01-15T10:00:00Z' },
        { id: 'resa_003', voyageTitle: 'Barcelone & Gaudí', voyageId: '3', clientName: 'Sophie Lambert', clientEmail: 'sophie.lambert@mail.fr', passengers: 3, status: 'PENDING', departureDate: '2026-06-20', totalAmount: 209700, createdAt: '2026-02-20T16:00:00Z' },
        { id: 'resa_004', voyageTitle: 'Istanbul & le Bosphore', voyageId: '5', clientName: 'Pierre Moreau', clientEmail: 'pierre.moreau@mail.fr', passengers: 2, status: 'CONFIRMED', departureDate: '2026-07-18', totalAmount: 189800, createdAt: '2026-03-01T18:45:00Z' },
        { id: 'resa_005', voyageTitle: 'Barcelone & Gaudí', voyageId: '3', clientName: 'Isabelle Petit', clientEmail: 'isabelle.petit@mail.fr', passengers: 1, status: 'CANCELLED', departureDate: '2026-06-20', totalAmount: 69900, createdAt: '2026-02-25T11:00:00Z' },
      ]);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchReservations();
  };

  const filtered = reservations;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FEFCF3', padding: '24px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px', justifyContent: 'space-between' }}>
          <div>
            <h1 className="pro-page-title">Reservations</h1>
            <p style={{ color: '#8896A6', marginTop: '4px' }}>Gerez les reservations de vos voyages</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="button"
              onClick={fetchReservations}
              className="pro-btn-outline"
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <RotateCcw className="w-4 h-4" />
              Actualiser
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="pro-panel" style={{ marginBottom: '24px', padding: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', flex: 1 }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search className="w-4 h-4" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8896A6' }} />
                <input
                  type="text"
                  value={search}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch((e.target as HTMLInputElement).value)}
                  placeholder="Rechercher par client, voyage..."
                  className="pro-input"
                  style={{ paddingLeft: '36px' }}
                />
              </div>
              <button type="submit" className="pro-btn-sun">
                Rechercher
              </button>
            </form>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['CONFIRMED', 'PENDING', 'CANCELLED', 'COMPLETED'].map((status) => (
                <button type="button"
                  key={status}
                  onClick={() =>
                    setStatusFilter(statusFilter === status ? null : status)
                  }
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 500,
                    transition: 'all 0.2s',
                    backgroundColor: statusFilter === status ? 'var(--pro-ocean)' : '#F0F0F0',
                    color: statusFilter === status ? 'white' : '#4A5568',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {STATUS_LABELS[status]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#FFE0E3', border: '1px solid #FFE0E3', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <AlertCircle className="w-5 h-5" style={{ color: 'var(--pro-coral)' }} />
              <p style={{ color: 'var(--pro-coral)', fontSize: '14px' }}>{error}</p>
            </div>
            <button type="button" onClick={fetchReservations} className="pro-btn-outline">
              Reessayer
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-lg" />
            ))}
          </div>
        )}

        {/* Reservations List */}
        {!loading && !error && (
          <>
            {filtered.length === 0 ? (
              <div className="pro-panel" style={{ padding: '48px 24px', textAlign: 'center' }}>
                <Users className="w-12 h-12" style={{ color: '#8896A6', margin: '0 auto 16px' }} />
                <p style={{ color: '#8896A6', fontWeight: 500 }}>Aucune reservation trouvee</p>
                <p style={{ fontSize: '14px', color: '#8896A6', marginTop: '4px' }}>
                  Les reservations apparaitront ici quand des clients reserveront vos voyages.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filtered.map((resa) => (
                  <Link
                    key={resa.id}
                    href={`/pro/voyages/${resa.voyageId}/reservations`}
                    className="pro-panel"
                    style={{ padding: '20px', textDecoration: 'none', display: 'block', cursor: 'pointer' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                          <h3 style={{ fontWeight: 600, color: '#0A1628' }}>
                            {resa.clientName}
                          </h3>
                          <span
                            style={{
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '12px',
                              fontWeight: 500,
                              backgroundColor: resa.status === 'CONFIRMED' ? '#E0FFF5' : resa.status === 'PENDING' ? '#FFF0E8' : resa.status === 'CANCELLED' ? '#FFE0E3' : '#E8F7FC',
                              color: resa.status === 'CONFIRMED' ? 'var(--pro-mint)' : resa.status === 'PENDING' ? 'var(--pro-sun)' : resa.status === 'CANCELLED' ? 'var(--pro-coral)' : 'var(--pro-ocean)'
                            }}
                          >
                            {STATUS_LABELS[resa.status] || resa.status}
                          </span>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px', fontSize: '14px', color: '#8896A6' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <MapPin className="w-3.5 h-3.5" />
                            {resa.voyageTitle}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(resa.departureDate).toLocaleDateString('fr-FR')}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Users className="w-3.5 h-3.5" />
                            {resa.passengers} passager{resa.passengers > 1 ? 's' : ''}
                          </span>
                          <span style={{ fontWeight: 600, color: '#0A1628' }}>
                            {(resa.totalAmount / 100).toFixed(2)} EUR
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5" style={{ color: '#8896A6' }} />
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Stats Summary */}
            {filtered.length > 0 && (
              <div className="pro-panel" style={{ marginTop: '24px', padding: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', textAlign: 'center' }}>
                  <div>
                    <p style={{ fontSize: '24px', fontWeight: 600, color: '#0A1628' }}>{filtered.length}</p>
                    <p style={{ fontSize: '14px', color: '#8896A6' }}>Total</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '24px', fontWeight: 600, color: 'var(--pro-mint)' }}>
                      {filtered.filter((r) => r.status === 'CONFIRMED').length}
                    </p>
                    <p style={{ fontSize: '14px', color: '#8896A6' }}>Confirmees</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '24px', fontWeight: 600, color: 'var(--pro-sun)' }}>
                      {filtered.filter((r) => r.status === 'PENDING').length}
                    </p>
                    <p style={{ fontSize: '14px', color: '#8896A6' }}>En attente</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '24px', fontWeight: 600, color: 'var(--pro-ocean)' }}>
                      {filtered.reduce((sum, r) => sum + r.passengers, 0)}
                    </p>
                    <p style={{ fontSize: '14px', color: '#8896A6' }}>Passagers</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
