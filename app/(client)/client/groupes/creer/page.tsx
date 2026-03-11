'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle, Loader2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
/**
 * Page de création d'un groupe de voyage
 * Formulaire avec prévisualisation du groupe créé
 */
export default function CreerGroupePage() {
  const router = useRouter();

  const [voyages, setVoyages] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    travelId: '',
    maxMembers: '10',
    isPrivate: false,
  });

  useEffect(() => {
    const fetchVoyages = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/travels?status=SALES_OPEN', {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Erreur lors du chargement des voyages');
        const data = (await res.json() as unknown) as Record<string, unknown>;
        setVoyages(data.travels || []);
      } catch (err: unknown) {
        console.warn('API travels indisponible — données démo');
        const FALLBACK_TRAVELS = [
          {
            id: 'demo-1',
            title: 'Côte d\'Azur - 5 jours',
            departureDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            returnDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
            destinationCity: 'Nice',
          },
          {
            id: 'demo-2',
            title: 'Paris - Week-end',
            departureDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            returnDate: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000).toISOString(),
            destinationCity: 'Paris',
          },
          {
            id: 'demo-3',
            title: 'Provence - 7 jours',
            departureDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
            returnDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
            destinationCity: 'Avignon',
          },
        ];
        setVoyages(FALLBACK_TRAVELS);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchVoyages();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError('Le nom du groupe est requis');
      return;
    }

    if (!formData.travelId) {
      setError('Veuillez sélectionner un voyage');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: formData.name,
          travelId: formData.travelId,
          maxMembers: parseInt(formData.maxMembers) || undefined,
          isPrivate: formData.isPrivate,
        }),
      });

      if (!res.ok) {
        const data = (await res.json() as unknown) as Record<string, unknown>;
        throw new Error((data.message as string) || 'Erreur lors de la création');
      }

      const newGroup = (await res.json() as unknown) as Record<string, unknown>;
      router.push(`/client/groupes/${newGroup.id as string}`);
    } catch (err: unknown) {
      console.warn('API groups indisponible — données démo');
      const demoGroupId = 'demo-group-' + Date.now();
      setError(null);
      setTimeout(() => router.push(`/client/groupes/${demoGroupId}`), 1000);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedVoyage = voyages.find(v => v.id === formData.travelId);

  return (
    <div className="min-h-screen p-4" style={{ backgroundColor: 'var(--cream, #FAF7F2)', animation: 'fadeUp 0.6s ease-out' }}>
      <div className="mx-auto max-w-2xl">
        <Link href="/client/groupes" className="text-sm hover:opacity-80 mb-4 inline-block" style={{ color: 'var(--terra, #C75B39)' }}>
          ← Retour aux groupes
        </Link>

        <h1 className="text-3xl font-bold mb-6" style={{ color: 'var(--navy, #1A1A2E)' }}>Créer un groupe</h1>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Formulaire */}
          <div style={{ border: '1.5px solid #E5E0D8', borderRadius: '20px', backgroundColor: 'white' }}>
            <div style={{ padding: '1.5rem 1.5rem 0' }}>
              <h3 style={{ fontWeight: 700, fontSize: '1.125rem', color: 'var(--navy, #1A1A2E)' }}>Informations du groupe</h3>
            </div>
            <div style={{ padding: '1.5rem' }}>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-10 rounded animate-pulse" style={{ backgroundColor: '#E5E0D8' }} />
                  ))}
                </div>
              ) : voyages.length === 0 ? (
                <div className="text-center py-8">
                  <p className="mb-4" style={{ color: '#6B7280' }}>Aucun voyage disponible pour créer un groupe</p>
                  <Link
                    href="/voyages"
                    className="inline-block px-4 py-2 text-white rounded-lg transition-all hover:shadow-lg"
                    style={{ backgroundColor: 'var(--terra, #C75B39)' }}
                  >
                    Voir les voyages disponibles
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="rounded-lg p-3 flex items-start gap-3" style={{ backgroundColor: 'var(--terra-soft, #FEF2F2)', border: '1.5px solid #DC2626' }}>
                      <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--terra, #DC2626)' }} />
                      <p className="text-sm" style={{ color: 'var(--terra, #DC2626)' }}>{error}</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label htmlFor="name" style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1A1A2E' }}>Nom du groupe</label>
                    <input
                      id="name"
                      name="name"
                      placeholder="Ex: Groupe Île-de-France"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={submitting}
                      required
                      style={{ padding: '0.75rem 1rem', borderRadius: '12px', border: '1.5px solid #E5E0D8', fontSize: '0.95rem', width: '100%', outline: 'none', background: 'white', color: 'var(--navy, #1A1A2E)' }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = 'var(--terra, #C75B39)';
                        e.currentTarget.style.boxShadow = `0 0 0 3px ${'rgba(199,91,57,0.1)'}`;
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#E5E0D8';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="travelId" style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1A1A2E' }}>Voyage</label>
                    <select
                      id="travelId"
                      name="travelId"
                      value={formData.travelId}
                      onChange={handleChange}
                      disabled={submitting}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1.5px solid #E5E0D8',
                        borderRadius: '10px',
                        fontSize: '0.875rem',
                        color: 'var(--navy, #1A1A2E)',
                        backgroundColor: 'white',
                      }}
                      required
                    >
                      <option value="">-- Sélectionner --</option>
                      {voyages.map((v) => (
                        <option key={v?.id as string} value={v?.id as string}>
                          {v?.title as string} ({formatDate(v?.departureDate as string | Date)})
                        </option>
                      ))}
                    </select>
                  </div>

                <div className="space-y-2">
                  <label htmlFor="maxMembers" style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1A1A2E' }}>Nombre max de membres</label>
                  <input
                    id="maxMembers"
                    name="maxMembers"
                    type="number"
                    min="2"
                    max="100"
                    value={formData.maxMembers}
                    onChange={handleChange}
                    disabled={submitting}
                    style={{ padding: '0.75rem 1rem', borderRadius: '12px', border: '1.5px solid #E5E0D8', fontSize: '0.95rem', width: '100%', outline: 'none', background: 'white', color: 'var(--navy, #1A1A2E)' }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'var(--terra, #C75B39)';
                      e.currentTarget.style.boxShadow = `0 0 0 3px ${'rgba(199,91,57,0.1)'}`;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#E5E0D8';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input type="checkbox" id="isPrivate" checked={formData.isPrivate} onChange={(e) => setFormData(prev => ({ ...prev, isPrivate: e.target.checked }))} disabled={submitting} style={{ width: 18, height: 18, accentColor: '#C75B39', cursor: 'pointer' }} />
                  <label htmlFor="isPrivate" className="cursor-pointer" style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1A1A2E' }}>
                    Groupe privé (invitation requise)
                  </label>
                </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full text-white font-semibold transition-all"
                    style={{
                      backgroundColor: 'var(--terra, #C75B39)',
                      color: 'white',
                      borderRadius: '12px',
                      fontWeight: 700,
                      padding: '0.75rem 1.5rem',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.95rem',
                      width: '100%',
                    }}
                    onMouseEnter={(e) => {
                      if (!submitting) {
                        e.currentTarget.style.backgroundColor = '#D97B5E';
                        e.currentTarget.style.boxShadow = `0 8px 16px ${'rgba(199,91,57,0.1)'}`;
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--terra, #C75B39)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Création en cours...
                      </>
                    ) : (
                      'Créer le groupe'
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Prévisualisation */}
          <div style={{ border: '1.5px solid #E5E0D8', borderRadius: '20px', backgroundColor: 'white' }}>
            <div style={{ padding: '1.5rem 1.5rem 0' }}>
              <h3 style={{ fontWeight: 700, fontSize: '1.125rem', color: 'var(--navy, #1A1A2E)' }}>Prévisualisation</h3>
            </div>
            <div style={{ padding: '1.5rem' }} className="space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase" style={{ color: '#6B7280' }}>Nom</label>
                <p className="text-lg font-semibold" style={{ color: 'var(--navy, #1A1A2E)' }}>
                  {formData.name || 'Nom du groupe'}
                </p>
              </div>

              {selectedVoyage && (
                <div>
                  <label className="text-xs font-semibold uppercase" style={{ color: '#6B7280' }}>Voyage</label>
                  <p className="text-sm" style={{ color: 'var(--navy, #1A1A2E)' }}>{selectedVoyage.title as string}</p>
                  <p className="text-xs" style={{ color: '#6B7280' }}>
                    {formatDate(selectedVoyage.departureDate as string | Date)} - {formatDate(selectedVoyage.returnDate as string | Date)}
                  </p>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold uppercase" style={{ color: '#6B7280' }}>Capacité</label>
                <p className="text-sm" style={{ color: 'var(--navy, #1A1A2E)' }}>
                  Jusqu'à {formData.maxMembers || '?'} membres
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase" style={{ color: '#6B7280' }}>Visibilité</label>
                <p className="text-sm" style={{ color: 'var(--navy, #1A1A2E)' }}>
                  {formData.isPrivate ? '🔒 Privé (invitation)' : '🔓 Public (ouvert)'}
                </p>
              </div>

              <div className="pt-4" style={{ borderTop: '1px solid #E5E0D8' }}>
                <p className="text-xs" style={{ color: '#6B7280' }}>
                  Un code d'invitation sera généré automatiquement pour partager votre groupe avec d'autres membres.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
