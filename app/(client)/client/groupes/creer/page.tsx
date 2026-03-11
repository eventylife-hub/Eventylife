'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle, Loader2 } from 'lucide-react';
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
        const data = (await res.json() as unknown) as unknown;
        setVoyages(data.travels || []);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
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
        const data = (await res.json() as unknown) as unknown;
        throw new Error(data.message || 'Erreur lors de la création');
      }

      const newGroup = (await res.json() as unknown) as unknown;
      router.push(`/client/groupes/${newGroup.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedVoyage = voyages.find(v => v.id === formData.travelId);

  return (
    <div className="min-h-screen p-4" style={{ backgroundColor: C.cream, animation: 'fadeUp 0.6s ease-out' }}>
      <div className="mx-auto max-w-2xl">
        <Link href="/client/groupes" className="text-sm hover:opacity-80 mb-4 inline-block" style={{ color: C.terra }}>
          ← Retour aux groupes
        </Link>

        <h1 className="text-3xl font-bold mb-6" style={{ color: C.navy }}>Créer un groupe</h1>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Formulaire */}
          <Card style={{ border: `1.5px solid ${C.border}`, borderRadius: '20px', backgroundColor: 'white' }}>
            <CardHeader>
              <CardTitle style={{ color: C.navy }}>Informations du groupe</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_: unknown, i: number) => (
                    <div key={i} className="h-10 rounded animate-pulse" style={{ backgroundColor: C.border }} />
                  ))}
                </div>
              ) : voyages.length === 0 ? (
                <div className="text-center py-8">
                  <p className="mb-4" style={{ color: C.muted }}>Aucun voyage disponible pour créer un groupe</p>
                  <Link
                    href="/voyages"
                    className="inline-block px-4 py-2 text-white rounded-lg transition-all hover:shadow-lg"
                    style={{ backgroundColor: C.terra }}
                  >
                    Voir les voyages disponibles
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="rounded-lg p-3 flex items-start gap-3" style={{ backgroundColor: 'var(--terra-soft, #FEF2F2)', border: `1.5px solid #DC2626` }}>
                      <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--terra, #DC2626)' }} />
                      <p className="text-sm" style={{ color: 'var(--terra, #DC2626)' }}>{error}</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="name" style={{ color: C.navy }}>Nom du groupe</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Ex: Groupe Île-de-France"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={submitting}
                      required
                      style={{
                        backgroundColor: 'white',
                        border: `1.5px solid ${C.border}`,
                        borderRadius: '10px',
                        color: C.navy,
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = C.terra;
                        e.currentTarget.style.boxShadow = `0 0 0 3px ${C.terraSoft}`;
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = C.border;
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="travelId" style={{ color: C.navy }}>Voyage</Label>
                    <select
                      id="travelId"
                      name="travelId"
                      value={formData.travelId}
                      onChange={handleChange}
                      disabled={submitting}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: `1.5px solid ${C.border}`,
                        borderRadius: '10px',
                        fontSize: '0.875rem',
                        color: C.navy,
                        backgroundColor: 'white',
                      }}
                      required
                    >
                      <option value="">-- Sélectionner --</option>
                      {voyages.map((v: unknown) => (
                        <option key={v?.id as string} value={v?.id as string}>
                          {v?.title as string} ({formatDate(v?.departureDate as string | Date)})
                        </option>
                      ))}
                    </select>
                  </div>

                <div className="space-y-2">
                  <Label htmlFor="maxMembers" style={{ color: C.navy }}>Nombre max de membres</Label>
                  <Input
                    id="maxMembers"
                    name="maxMembers"
                    type="number"
                    min="2"
                    max="100"
                    value={formData.maxMembers}
                    onChange={handleChange}
                    disabled={submitting}
                    style={{
                      backgroundColor: 'white',
                      border: `1.5px solid ${C.border}`,
                      borderRadius: '10px',
                      color: C.navy,
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = C.terra;
                      e.currentTarget.style.boxShadow = `0 0 0 3px ${C.terraSoft}`;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = C.border;
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="isPrivate"
                    checked={formData.isPrivate}
                    onCheckedChange={(checked) =>
                      setFormData(prev => ({ ...prev, isPrivate: checked === true }))
                    }
                    disabled={submitting}
                  />
                  <Label htmlFor="isPrivate" className="cursor-pointer" style={{ color: C.navy }}>
                    Groupe privé (invitation requise)
                  </Label>
                </div>

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full text-white font-semibold transition-all hover:shadow-lg"
                    style={{
                      backgroundColor: C.terra,
                      borderRadius: '10px',
                    }}
                    onMouseEnter={(e) => {
                      if (!submitting) {
                        e.currentTarget.style.backgroundColor = C.terraLight;
                        e.currentTarget.style.boxShadow = `0 8px 16px ${C.terraSoft}`;
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = C.terra;
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
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Prévisualisation */}
          <Card style={{ border: `1.5px solid ${C.border}`, borderRadius: '20px', backgroundColor: 'white' }}>
            <CardHeader>
              <CardTitle style={{ color: C.navy }}>Prévisualisation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase" style={{ color: C.muted }}>Nom</label>
                <p className="text-lg font-semibold" style={{ color: C.navy }}>
                  {formData.name || 'Nom du groupe'}
                </p>
              </div>

              {selectedVoyage && (
                <div>
                  <label className="text-xs font-semibold uppercase" style={{ color: C.muted }}>Voyage</label>
                  <p className="text-sm" style={{ color: C.navy }}>{selectedVoyage.title as string}</p>
                  <p className="text-xs" style={{ color: C.muted }}>
                    {formatDate(selectedVoyage.departureDate as string | Date)} - {formatDate(selectedVoyage.returnDate as string | Date)}
                  </p>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold uppercase" style={{ color: C.muted }}>Capacité</label>
                <p className="text-sm" style={{ color: C.navy }}>
                  Jusqu'à {formData.maxMembers || '?'} membres
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase" style={{ color: C.muted }}>Visibilité</label>
                <p className="text-sm" style={{ color: C.navy }}>
                  {formData.isPrivate ? '🔒 Privé (invitation)' : '🔓 Public (ouvert)'}
                </p>
              </div>

              <div className="pt-4" style={{ borderTop: `1px solid ${C.border}` }}>
                <p className="text-xs" style={{ color: C.muted }}>
                  Un code d'invitation sera généré automatiquement pour partager votre groupe avec d'autres membres.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
