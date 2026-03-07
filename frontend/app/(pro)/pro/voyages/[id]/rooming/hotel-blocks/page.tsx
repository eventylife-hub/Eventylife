'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { HotelBlockCard } from '@/components/rooming/hotel-block-card';
import { AlertCircle } from 'lucide-react';

/**
 * Page Gestion Blocs Hôtel - Négociation prix et disponibilités
 *
 * Affiche:
 * - Liste blocs avec statut, prix négocié, expiration
 * - Formulaire édition bloc
 * - Alerte expiration proche
 *
 * États UI:
 * - Loading: Skeleton
 * - Empty: CTA ajouter bloc
 * - Error: Toast
 * - Data: Cartes blocs + formulaire
 */
export default function HotelBlocksPage() {
  const params = useParams();
  const travelId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [blocks, setBlocks] = useState<Record<string, unknown>[]>([]);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    roomsRequested: '',
    pricePerNightTTC: '',
    notes: '',
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/rooming/${travelId}/hotel-blocks`, { credentials: 'include' });
        if (!res.ok) throw new Error('Erreur chargement blocs hôtel');

        const data = await res.json();
        setBlocks(data);
        setError(null);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    if (travelId) {
      fetchBlocks();
    }
  }, [travelId]);

  const handleEditBlock = (block: Record<string, unknown>) => {
    setEditingBlockId(block.id as string);
    setFormData({
      roomsRequested: String(block.roomsRequested),
      pricePerNightTTC: block.pricePerNightTTC ? (Number(block.pricePerNightTTC) / 100).toFixed(2) : '',
      notes: (block.notes as string) || '',
    });
  };

  const handleSaveBlock = async () => {
    if (!editingBlockId) return;

    try {
      setIsSaving(true);
      const res = await fetch(`/api/rooming/hotel-blocks/${editingBlockId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomsRequested: parseInt(formData.roomsRequested),
          pricePerNightTTC: formData.pricePerNightTTC
            ? Math.floor(parseFloat(formData.pricePerNightTTC) * 100)
            : null,
          notes: formData.notes,
        }), credentials: 'include' });

      if (!res.ok) throw new Error('Erreur sauvegarde bloc');

      // Recharger
      const blocRes = await fetch(`/api/rooming/${travelId}/hotel-blocks`, { credentials: 'include' });
      const updated = await blocRes.json();
      setBlocks(updated);

      setEditingBlockId(null);
      setFormData({ roomsRequested: '', pricePerNightTTC: '', notes: '' });
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  const expiringBlocks = blocks.filter((b) => ((b.expiresIn as number) || 0) <= 3);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Blocs Hôtel</h1>
        <p className="text-gray-600 mt-2">Gestion des blocs hôtel réservés</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription className="flex justify-between items-center">
            <span>{error}</span>
            <Button size="sm" variant="outline" onClick={() => setError(null)}>
              Fermer
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {expiringBlocks.length > 0 && (
        <Alert>
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>
            {expiringBlocks.length} bloc(s) expirent dans les 3 jours
          </AlertDescription>
        </Alert>
      )}

      {blocks.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-500 mb-4">Aucun bloc hôtel</p>
            <Button onClick={() => (window.location.href = `/pro/voyages/${travelId}`)}>
              Ajouter bloc
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Cartes blocs */}
          <div className="grid md:grid-cols-2 gap-4">
            {blocks.map((block) => (
              <div key={block.id as string}>
                <HotelBlockCard
                  block={block as unknown as any}
                  onEdit={() => handleEditBlock(block)}
                />
              </div>
            ))}
          </div>

          {/* Formulaire édition */}
          {editingBlockId && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle>Modifier bloc</CardTitle>
                <CardDescription>Mettre à jour les détails du bloc</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Chambres demandées</label>
                  <Input
                    type="number"
                    value={formData.roomsRequested}
                    onChange={(e) =>
                      setFormData({ ...formData, roomsRequested: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Prix par nuit (€)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.pricePerNightTTC}
                    onChange={(e) =>
                      setFormData({ ...formData, pricePerNightTTC: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Notes</label>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    placeholder="Notes de négociation..."
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleSaveBlock}
                    disabled={isSaving}
                    className="flex-1"
                  >
                    {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
                  </Button>
                  <Button
                    onClick={() => setEditingBlockId(null)}
                    variant="outline"
                    className="flex-1"
                  >
                    Annuler
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
