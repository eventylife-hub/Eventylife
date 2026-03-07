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
        const data = await res.json();
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
        const data = await res.json();
        throw new Error(data.message || 'Erreur lors de la création');
      }

      const newGroup = await res.json();
      router.push(`/client/groupes/${newGroup.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedVoyage = voyages.find(v => v.id === formData.travelId);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-2xl">
        <Link href="/client/groupes" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
          ← Retour aux groupes
        </Link>

        <h1 className="text-3xl font-bold mb-6">Créer un groupe</h1>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Formulaire */}
          <Card>
            <CardHeader>
              <CardTitle>Informations du groupe</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-10 bg-gray-200 rounded animate-pulse" />
                  ))}
                </div>
              ) : voyages.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">Aucun voyage disponible pour créer un groupe</p>
                  <Link
                    href="/voyages"
                    className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Voir les voyages disponibles
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-3 flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="name">Nom du groupe</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Ex: Groupe Île-de-France"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={submitting}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="travelId">Voyage</Label>
                    <select
                      id="travelId"
                      name="travelId"
                      value={formData.travelId}
                      onChange={handleChange}
                      disabled={submitting}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">-- Sélectionner --</option>
                      {voyages.map((v: any) => (
                        <option key={v?.id as string} value={v?.id as string}>
                          {v?.title as string} ({formatDate(v?.departureDate as string | Date)})
                        </option>
                      ))}
                    </select>
                  </div>

                <div className="space-y-2">
                  <Label htmlFor="maxMembers">Nombre max de membres</Label>
                  <Input
                    id="maxMembers"
                    name="maxMembers"
                    type="number"
                    min="2"
                    max="100"
                    value={formData.maxMembers}
                    onChange={handleChange}
                    disabled={submitting}
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
                  <Label htmlFor="isPrivate" className="cursor-pointer">
                    Groupe privé (invitation requise)
                  </Label>
                </div>

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full"
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
          <Card>
            <CardHeader>
              <CardTitle>Prévisualisation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase">Nom</label>
                <p className="text-lg font-semibold">
                  {formData.name || 'Nom du groupe'}
                </p>
              </div>

              {selectedVoyage && (
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase">Voyage</label>
                  <p className="text-sm">{selectedVoyage.title as string}</p>
                  <p className="text-xs text-gray-500">
                    {formatDate(selectedVoyage.departureDate as string | Date)} - {formatDate(selectedVoyage.returnDate as string | Date)}
                  </p>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase">Capacité</label>
                <p className="text-sm">
                  Jusqu'à {formData.maxMembers || '?'} membres
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase">Visibilité</label>
                <p className="text-sm">
                  {formData.isPrivate ? '🔒 Privé (invitation)' : '🔓 Public (ouvert)'}
                </p>
              </div>

              <div className="pt-4 border-t">
                <p className="text-xs text-gray-600">
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
