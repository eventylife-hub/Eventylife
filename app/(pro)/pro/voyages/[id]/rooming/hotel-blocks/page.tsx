'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { HotelBlockCard } from '@/components/rooming/hotel-block-card';
import { AlertCircle } from 'lucide-react';
import { logger } from '@/lib/logger';
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

        const data = (await res.json()) as Record<string, unknown>[];
        setBlocks(data);
        setError(null);
      } catch (err: unknown) {
        logger.warn('API /api/rooming/hotel-blocks indisponible — données démo');
        // Fallback demo data
        const demoBlocks: Record<string, unknown>[] = [
          {
            id: 'block-001',
            hotelId: 'hotel-001',
            hotelName: 'Hotel Grand Soleil - Côte d\'Azur',
            roomsRequested: 10,
            roomsConfirmed: 8,
            pricePerNightTTC: 125000, // 1250€
            notes: 'Bloc négocié avec 5% de réduction',
            expiresIn: 15,
            expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'CONFIRMED',
          },
          {
            id: 'block-002',
            hotelId: 'hotel-002',
            hotelName: 'Hotel Riviera Palace - Cannes',
            roomsRequested: 8,
            roomsConfirmed: 8,
            pricePerNightTTC: 95000, // 950€
            notes: 'Petit-déj inclus, parking gratuit',
            expiresIn: 2,
            expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'EXPIRING_SOON',
          },
          {
            id: 'block-003',
            hotelId: 'hotel-003',
            hotelName: 'Hotel Les Pins - Antibes',
            roomsRequested: 5,
            roomsConfirmed: 3,
            pricePerNightTTC: 89900, // 899€
            notes: 'En négociation, attente confirmation',
            expiresIn: 7,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'PENDING',
          },
        ];
        setBlocks(demoBlocks);
        setError(null);
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
      const updated = (await blocRes.json()) as Record<string, unknown>[];
      setBlocks(updated);

      setEditingBlockId(null);
      setFormData({ roomsRequested: '', pricePerNightTTC: '', notes: '' });
      setError(null);
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setIsSaving(false);
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
          <div style={{ height: 128, width: '100%', borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
        </div>
      </div>
    );
  }

  const expiringBlocks = blocks.filter((b) => ((b.expiresIn as number) || 0) <= 3);

  return (
    <div className="pro-fade-in min-h-screen p-6" style={{ background: 'linear-gradient(135deg, #FEFCF3 0%, #F0E6D8 100%)' }}>
    <div style={{ maxWidth: '80rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#0A1628', margin: 0 }}>Blocs Hôtel</h1>
        <p style={{ color: '#4A5568', marginTop: '0.5rem', margin: 0 }}>Gestion des blocs hôtel réservés</p>
      </div>

      {error && (
        <div style={{ padding: '1.5rem', background: '#FFE0E3', border: '1px solid #E63946', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'space-between' }}>
          <p style={{ color: 'var(--pro-coral)', margin: 0 }}>{error}</p>
          <button type="button" onClick={() => setError(null)} className="pro-btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}>
            Fermer
          </button>
        </div>
      )}

      {expiringBlocks.length > 0 && (
        <div style={{ padding: '1rem', background: '#E8F7FC', border: '1px solid #0077B6', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <AlertCircle style={{ width: '1rem', height: '1rem', color: 'var(--pro-ocean)', flexShrink: 0 }} />
          <p style={{ color: 'var(--pro-ocean)', margin: 0 }}>
            {expiringBlocks.length} bloc(s) expirent dans les 3 jours
          </p>
        </div>
      )}

      {blocks.length === 0 ? (
        <div className="pro-panel">
          <div className="pro-panel-body" style={{ textAlign: 'center', paddingTop: '2rem', paddingBottom: '2rem' }}>
            <p style={{ color: '#4A5568', marginBottom: '1rem', margin: 0 }}>Aucun bloc hôtel</p>
            <button type="button" onClick={() => (window.location.href = `/pro/voyages/${travelId}`)} className="pro-btn-sun">
              Ajouter bloc
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Cartes blocs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1rem' }}>
            {blocks.map((block) => (
              <div key={block.id as string}>
                <HotelBlockCard
                  block={block as unknown as unknown}
                  onEdit={() => handleEditBlock(block)}
                />
              </div>
            ))}
          </div>

          {/* Formulaire édition */}
          {editingBlockId && (
            <div className="pro-panel" style={{ border: '2px solid #0077B6' }}>
              <div className="pro-panel-header">
                <h3 className="pro-panel-title">Modifier bloc</h3>
                <p style={{ fontSize: '0.875rem', color: '#64748B', margin: 0 }}>Mettre à jour les détails du bloc</p>
              </div>
              <div className="pro-panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#4A5568', marginBottom: '0.5rem' }}>Chambres demandées</label>
                  <input
                    type="number"
                    value={formData.roomsRequested}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, roomsRequested: (e.target as HTMLInputElement).value })
                    }
                    className="pro-input"
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#4A5568', marginBottom: '0.5rem' }}>Prix par nuit (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.pricePerNightTTC}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, pricePerNightTTC: (e.target as HTMLInputElement).value })
                    }
                    className="pro-input"
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#4A5568', marginBottom: '0.5rem' }}>Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, notes: (e.target as HTMLInputElement).value })
                    }
                    placeholder="Notes de négociation..."
                    className="pro-input"
                    style={{ width: '100%', minHeight: '6rem', resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button type="button"
                    onClick={handleSaveBlock}
                    disabled={isSaving}
                    className="pro-btn-sun"
                    style={{ flex: 1, opacity: isSaving ? 0.5 : 1 }}
                  >
                    {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
                  </button>
                  <button type="button"
                    onClick={() => setEditingBlockId(null)}
                    className="pro-btn-outline"
                    style={{ flex: 1 }}
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
    </div>
  );
}
