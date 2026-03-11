'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useProStore } from '@/lib/stores/pro-store';
import { Plus, MapPin, Users, Clock, Grid, List, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
const TABS = ['Brouillons', 'En révision', 'Publiés', 'Terminés', 'Annulés'];
const STATUS_MAP: Record<string, string> = {
  'Brouillons': 'DRAFT',
  'En révision': 'PHASE1_REVIEW,PHASE2_REVIEW',
  'Publiés': 'PUBLISHED,SALES_OPEN',
  'Terminés': 'COMPLETED',
  'Annulés': 'CANCELED',
};

const STATUS_COLORS: Record<string, string> = {
  DRAFT: 'bg-slate-100 text-slate-800',
  PHASE1_REVIEW: 'bg-blue-100 text-blue-800',
  PHASE2_REVIEW: 'bg-blue-100 text-blue-800',
  PUBLISHED: 'bg-green-100 text-green-800',
  SALES_OPEN: 'bg-emerald-100 text-emerald-800',
  COMPLETED: 'bg-slate-200 text-slate-800',
  CANCELED: 'bg-red-100 text-red-800',
};

const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Brouillon',
  PHASE1_REVIEW: 'Phase 1',
  PHASE2_REVIEW: 'Phase 2',
  PUBLISHED: 'Publié',
  SALES_OPEN: 'Ventes ouvertes',
  COMPLETED: 'Terminé',
  CANCELED: 'Annulé',
};

export default function TravelsPage() {
  const { travels, fetchTravels } = useProStore();
  const [activeTab, setActiveTab] = useState('Brouillons');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleFetch = async () => {
      try {
        setLoading(true);
        setError(null);
        await fetchTravels({
          status: (STATUS_MAP[activeTab] || 'DRAFT').split(','),
          search: search || undefined,
        });
      } catch (_error: unknown) {
        setError('Une erreur est survenue lors du chargement des voyages');
      } finally {
        setLoading(false);
      }
    };
    handleFetch();
  }, [activeTab, search]);

  const filteredTravels = travels.filter((t) => {
    if (search) {
      return (
        (t?.title as string)?.toLowerCase().includes(search.toLowerCase()) ||
        (t?.destinationCity as string)?.toLowerCase().includes(search.toLowerCase())
      );
    }
    return true;
  });

  return (
    <div className="pro-fade-in min-h-screen p-6" style={{ background: 'linear-gradient(135deg, #FEFCF3 0%, #F0E6D8 100%)' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#0A1628', fontFamily: 'var(--font-fraunces, Fraunces, serif)' }}>
              Mes voyages
            </h1>
            <p style={{ color: '#666', marginTop: '0.5rem', fontSize: '0.875rem' }}>
              Gérez tous vos voyages au même endroit
            </p>
          </div>
          <Link
            href="/pro/voyages/nouveau"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: 'var(--pro-sun)',
              color: 'white',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              fontWeight: '500',
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#E55A24')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--pro-sun)')}
          >
            <Plus className="w-5 h-5" />
            Créer un voyage
          </Link>
        </div>

        {/* Search */}
        <div style={{ marginBottom: '1.5rem' }}>
          <input
            type="text"
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch((e.target as HTMLInputElement).value)}
            placeholder="Rechercher un voyage..."
            className="pro-input"
            style={{ width: '100%' }}
          />
        </div>

        {/* Tabs and View Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '0.5rem 1rem',
                  fontWeight: '500',
                  whiteSpace: 'nowrap',
                  borderRadius: '0.5rem',
                  background: activeTab === tab ? 'var(--pro-sun)' : '#FFFFFF',
                  color: activeTab === tab ? '#FFFFFF' : '#4A5568',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== tab) (e.currentTarget as HTMLButtonElement).style.background = '#F5F5F5';
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== tab) (e.currentTarget as HTMLButtonElement).style.background = '#FFFFFF';
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                padding: '0.5rem',
                borderRadius: '0.5rem',
                background: viewMode === 'grid' ? 'var(--pro-sun)' : '#FFFFFF',
                color: viewMode === 'grid' ? '#FFFFFF' : '#4A5568',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                padding: '0.5rem',
                borderRadius: '0.5rem',
                background: viewMode === 'list' ? 'var(--pro-sun)' : '#FFFFFF',
                color: viewMode === 'list' ? '#FFFFFF' : '#4A5568',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Erreur */}
        {error && (
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ padding: '1rem', background: '#FFE0E3', border: '1px solid #E63946', borderRadius: '0.5rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <AlertCircle className="h-4 w-4" style={{ color: 'var(--pro-coral)', marginTop: '0.25rem', flexShrink: 0 }} />
              <p style={{ color: 'var(--pro-coral)', margin: 0 }}>{error}</p>
            </div>
            <div style={{ marginTop: '1rem' }}>
              <button
                onClick={() => {
                  setError(null);
                  setLoading(true);
                  fetchTravels({
                    status: (STATUS_MAP[activeTab] || 'DRAFT').split(','),
                    search: search || undefined,
                  }).catch(() => {
                    setError('Une erreur est survenue lors du chargement des voyages');
                  }).finally(() => {
                    setLoading(false);
                  });
                }}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#FFFFFF',
                  color: 'var(--pro-coral)',
                  border: '1px solid #E63946',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '0.875rem',
                }}
              >
                Réessayer
              </button>
            </div>
          </div>
        )}

        {/* Chargement */}
        {loading && !error && (
          <>
            <div className="mb-6">
              <Skeleton className="h-12 rounded-lg mb-4" />
            </div>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, idx) => (
                  <div key={idx} className="rounded-lg overflow-hidden border border-slate-200">
                    <Skeleton className="h-48" />
                    <div className="p-6 space-y-4">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <div className="space-y-2">
                  {[...Array(5)].map((_, idx) => (
                    <Skeleton key={idx} className="h-12 rounded-none border-b" />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Contenu */}
        {!loading && !error && (
          <>
            {viewMode === 'grid' ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {filteredTravels.map((travel) => (
                  <Link
                    key={travel.id}
                    href={`/pro/voyages/${travel.id}`}
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '0.5rem',
                      border: '1px solid #E8F7FC',
                      overflow: 'hidden',
                      textDecoration: 'none',
                      color: 'inherit',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'box-shadow 0.2s',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)')}
                    onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)')}
                  >
                    <div style={{ height: '12rem', background: 'linear-gradient(135deg, #FF6B35 0%, #FF8F5E 100%)' }}></div>
                    <div style={{ padding: '1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem', gap: '0.75rem' }}>
                        <h3 style={{ fontWeight: 'bold', color: '#0A1628', fontSize: '1rem', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{travel.title}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
                          STATUS_COLORS[travel.status] || 'bg-slate-100 text-slate-800'
                        }`}>
                          {STATUS_LABELS[travel.status] || travel.status}
                        </span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: '#4A5568', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <MapPin className="w-4 h-4" />
                          {travel.destinationCity}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Clock className="w-4 h-4" />
                          {formatDate(travel.departureDate)} - {formatDate(travel.returnDate)}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Users className="w-4 h-4" />
                          Capacité: {travel.capacity} places
                        </div>
                      </div>

                      <button style={{
                        width: '100%',
                        padding: '0.5rem',
                        background: '#FFF0E8',
                        color: 'var(--pro-sun)',
                        border: 'none',
                        borderRadius: '0.25rem',
                        cursor: 'pointer',
                        fontWeight: '500',
                        fontSize: '0.875rem',
                      }}>
                        Voir les détails →
                      </button>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div style={{ background: '#FFFFFF', borderRadius: '0.5rem', border: '1px solid #E8F7FC', overflow: 'hidden' }}>
                <table className="pro-table" style={{ width: '100%' }}>
                  <thead style={{ background: '#F0E6D8', borderBottom: '1px solid #E8F7FC' }}>
                    <tr>
                      <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#0A1628' }}>Voyage</th>
                      <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#0A1628' }}>Destination</th>
                      <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#0A1628' }}>Dates</th>
                      <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#0A1628' }}>Statut</th>
                      <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#0A1628' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody style={{ borderTop: '1px solid #E8F7FC' }}>
                    {filteredTravels.map((travel) => (
                      <tr key={travel.id} style={{ borderBottom: '1px solid #E8F7FC', transition: 'background-color 0.2s' }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#F5F5F5')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = '#FFFFFF')}
                      >
                        <td style={{ padding: '1rem 1.5rem', fontWeight: '500', color: '#0A1628' }}>{travel.title}</td>
                        <td style={{ padding: '1rem 1.5rem', color: '#4A5568' }}>{travel.destinationCity}</td>
                        <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: '#4A5568' }}>
                          {formatDate(travel.departureDate)}
                        </td>
                        <td style={{ padding: '1rem 1.5rem' }}>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            STATUS_COLORS[travel.status] || 'bg-slate-100 text-slate-800'
                          }`}>
                            {STATUS_LABELS[travel.status] || travel.status}
                          </span>
                        </td>
                        <td style={{ padding: '1rem 1.5rem' }}>
                          <Link
                            href={`/pro/voyages/${travel.id}`}
                            style={{ color: 'var(--pro-sun)', textDecoration: 'none', fontWeight: '500', fontSize: '0.875rem' }}
                          >
                            Voir →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {filteredTravels.length === 0 && (
              <div style={{ textAlign: 'center', paddingY: '3rem', paddingTop: '3rem', paddingBottom: '3rem' }}>
                <AlertCircle style={{ margin: '0 auto', height: '3rem', width: '3rem', color: '#D1D5DB', marginBottom: '1rem' }} />
                <p style={{ color: '#4A5568', fontWeight: '500', marginBottom: '1rem' }}>Aucun voyage trouvé</p>
                <Link
                  href="/pro/voyages/nouveau"
                  style={{ color: 'var(--pro-sun)', textDecoration: 'none', fontWeight: '500' }}
                >
                  Créer votre premier voyage →
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
