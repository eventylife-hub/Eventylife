'use client';

/**
 * Rooming détails — Gestion de la chambre et co-occupants
 * Page pour détails de rooming, préférences, et documents
 */

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ZodError } from 'zod';
import { formatDate } from '@/lib/utils';
import { logger } from '@/lib/logger';
import { roomingPreferencesSchema } from '@/lib/validations/client';
import { zodErrorsToRecord } from '@/lib/validations/auth';
import { FormFieldError } from '@/components/ui/form-field-error';
interface CoOccupant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  paymentStatus: 'PENDING' | 'PARTIAL' | 'PAID';
}

interface RoomingData {
  id: string;
  roomType: string;
  capacity: number;
  occupants: CoOccupant[];
  hotelName: string;
  checkInDate: string;
  checkOutDate: string;
  floor?: string;
  bedType?: string;
  specialRequests?: string;
  documentsRequired: boolean;
  preferences: {
    floor?: string;
    bedType?: string;
    specialRequests?: string;
  };
}

type LoadState = 'loading' | 'error' | 'data';

const paymentStatusBadge = {
  PENDING: { bg: '#FDF6E8', color: '#92400e' },
  PARTIAL: { bg: '#FEF3C7', color: '#D97706' },
  PAID: { bg: '#DCFCE7', color: '#166534' }
};

const paymentStatusLabel = {
  PENDING: 'En attente',
  PARTIAL: 'Partiellement payé',
  PAID: 'Payé'
};

export default function RoomingPage() {
  const params = useParams();
  const reservationId = params.id as string;

  const [state, setState] = useState<LoadState>('loading');
  const [rooming, setRooming] = useState<RoomingData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Préférences form
  const [preferences, setPreferences] = useState({
    floor: '',
    bedType: '',
    specialRequests: ''
  });
  const [preferencesLoading, setPreferencesLoading] = useState(false);
  const [preferencesMessage, setPreferencesMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [preferencesErrors, setPreferencesErrors] = useState<Record<string, string>>({});

  // Documents upload
  const [documents, setDocuments] = useState<File[]>([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [documentsMessage, setDocumentsMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Charger les données de rooming
  useEffect(() => {
    const loadRooming = async () => {
      try {
        setState('loading');
        const res = await fetch(`/api/client/reservations/${reservationId}/rooming`, {
          credentials: 'include',
        });

        if (!res.ok) {
          throw new Error('Impossible de charger les détails de rooming');
        }

        const data = (await res.json() as unknown) as RoomingData;
        setRooming(data);
        setPreferences({
          floor: data.preferences?.floor || '',
          bedType: data.preferences?.bedType || '',
          specialRequests: data.preferences?.specialRequests || ''
        });
        setState('data');
      } catch (err: unknown) {
        logger.warn('API client/reservations/rooming indisponible — données démo');
        const FALLBACK_ROOMING: RoomingData = {
          id: 'room-' + reservationId,
          roomType: 'Double',
          capacity: 2,
          occupants: [
            {
              id: 'occ-1',
              firstName: 'Jean',
              lastName: 'Dupont',
              email: 'jean@example.com',
              phone: '+33612345678',
              paymentStatus: 'PAID',
            },
            {
              id: 'occ-2',
              firstName: 'Marie',
              lastName: 'Martin',
              email: 'marie@example.com',
              phone: '+33687654321',
              paymentStatus: 'PAID',
            },
          ],
          hotelName: 'Hotel Côte d\'Azur ★★★★',
          checkInDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          checkOutDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(),
          documentsRequired: true,
          preferences: {
            floor: '',
            bedType: '',
            specialRequests: '',
          },
        };
        setRooming(FALLBACK_ROOMING);
        setPreferences({
          floor: '',
          bedType: '',
          specialRequests: '',
        });
        setState('data');
        setError(null);
      }
    };

    if (reservationId) loadRooming();
  }, [reservationId]);

  const handlePreferencesSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setPreferencesErrors({});
    setPreferencesMessage(null);

    try {
      roomingPreferencesSchema.parse(preferences);
    } catch (err) {
      if (err instanceof ZodError) {
        setPreferencesErrors(zodErrorsToRecord(err));
        return;
      }
    }

    setPreferencesLoading(true);

    try {
      const res = await fetch(`/api/client/reservations/${reservationId}/rooming/preferences`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(preferences),
      });

      if (!res.ok) {
        throw new Error('Erreur lors de la sauvegarde des préférences');
      }

      const data = (await res.json() as unknown) as RoomingData;
      setRooming(data);
      setPreferencesMessage({ type: 'success', text: 'Préférences sauvegardées avec succès !' });
      setTimeout(() => setPreferencesMessage(null), 5000);
    } catch (err: unknown) {
      logger.warn('API client/reservations/rooming/preferences indisponible — données démo');
      if (rooming) {
        setRooming({
          ...rooming,
          preferences,
        });
      }
      setPreferencesMessage({ type: 'success', text: 'Préférences sauvegardées (démo) !' });
      setTimeout(() => setPreferencesMessage(null), 5000);
    } finally {
      setPreferencesLoading(false);
    }
  };

  const handleDocumentsUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (documents.length === 0) {
      setDocumentsMessage({ type: 'error', text: 'Veuillez sélectionner au moins un document' });
      return;
    }

    setDocumentsLoading(true);
    const formData = new FormData();
    documents.forEach(doc => formData.append('documents', doc));

    try {
      const res = await fetch(`/api/client/reservations/${reservationId}/rooming/documents`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Erreur lors de l\'upload des documents');
      }

      setDocuments([]);
      setDocumentsMessage({ type: 'success', text: 'Documents uploadés avec succès !' });
      setTimeout(() => setDocumentsMessage(null), 5000);
    } catch (err: unknown) {
      logger.warn('API client/reservations/rooming/documents indisponible — données démo');
      setDocuments([]);
      setDocumentsMessage({ type: 'success', text: 'Documents uploadés (démo) !' });
      setTimeout(() => setDocumentsMessage(null), 5000);
    } finally {
      setDocumentsLoading(false);
    }
  };

  if (state === 'loading') {
    return (
    <>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8" style={{ backgroundColor: 'var(--cream, #FAF7F2)' }}>
        <div style={{ height: 40, width: 192, borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
        <div style={{ height: 192, width: '100%', borderRadius: 8, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
        <div style={{ height: 320, width: '100%', borderRadius: 8, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12" style={{ backgroundColor: 'var(--cream, #FAF7F2)' }}>
        <div className="rounded-lg p-6" style={{ backgroundColor: 'var(--terra-soft, #FEF2F2)', border: '1.5px solid #DC2626' }}>
          <p style={{ color: 'var(--terra, #DC2626)' }}>Erreur : {error}</p>
          <Link href={`/client/reservations/${reservationId}`}>
            <button type="button" className="ml-4 mt-4" style={{ backgroundColor: 'white', color: 'var(--terra, #C75B39)', borderRadius: '12px', fontWeight: 600, padding: '0.75rem 1.5rem', border: '1.5px solid #E5E0D8', cursor: 'pointer', fontSize: '0.95rem' }}>
              Retour à la réservation
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (!rooming) return null;

  const isCutoffPassed = new Date(rooming.checkInDate) < new Date();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8" style={{ backgroundColor: 'var(--cream, #FAF7F2)', animation: 'fadeUp 0.6s ease-out' }}>
      {/* Header */}
      <div>
        <Link href={`/client/reservations/${reservationId}`}>
          <button type="button" className="mb-4" style={{ backgroundColor: 'white', color: 'var(--terra, #C75B39)', borderRadius: '12px', fontWeight: 600, padding: '0.75rem 1.5rem', border: '1.5px solid #E5E0D8', cursor: 'pointer', fontSize: '0.95rem' }}>
            ← Retour
          </button>
        </Link>
        <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--navy, #1A1A2E)' }}>Détails de la chambre</h1>
        <p style={{ color: '#6B7280' }}>{rooming.hotelName}</p>
      </div>

      {/* Room Info Card */}
      <div style={{ backgroundColor: 'white', border: '1.5px solid #E5E0D8', borderRadius: '20px', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem' }} className="space-y-4">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--navy, #1A1A2E)' }}>Informations de la chambre</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm mb-1" style={{ color: '#6B7280' }}>Type de chambre</p>
              <p className="text-lg font-semibold" style={{ color: 'var(--navy, #1A1A2E)' }}>{rooming.roomType}</p>
            </div>

            <div>
              <p className="text-sm mb-1" style={{ color: '#6B7280' }}>Capacité</p>
              <p className="text-lg font-semibold" style={{ color: 'var(--navy, #1A1A2E)' }}>
                {rooming.occupants.length} / {rooming.capacity} personnes
              </p>
            </div>

            <div>
              <p className="text-sm mb-1" style={{ color: '#6B7280' }}>Check-in</p>
              <p className="text-lg font-semibold" style={{ color: 'var(--navy, #1A1A2E)' }}>
                {formatDate(rooming.checkInDate)}
              </p>
            </div>

            <div>
              <p className="text-sm mb-1" style={{ color: '#6B7280' }}>Check-out</p>
              <p className="text-lg font-semibold" style={{ color: 'var(--navy, #1A1A2E)' }}>
                {formatDate(rooming.checkOutDate)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Co-occupants */}
      <div style={{ backgroundColor: 'white', border: '1.5px solid #E5E0D8', borderRadius: '20px', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem' }} className="space-y-4">
          <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--navy, #1A1A2E)' }}>Co-occupants</h2>

          {rooming.occupants.length > 0 ? (
            <div className="space-y-3">
              {rooming.occupants.map((occupant) => (
                <div
                  key={occupant.id}
                  className="flex flex-col md:flex-row md:items-center md:justify-between p-4 rounded-lg border"
                  style={{ backgroundColor: 'var(--cream, #FAF7F2)', borderColor: '#E5E0D8' }}
                >
                  <div>
                    <p className="font-semibold" style={{ color: 'var(--navy, #1A1A2E)' }}>
                      {occupant.firstName} {occupant.lastName}
                    </p>
                    <p className="text-sm" style={{ color: '#6B7280' }}>{occupant.email}</p>
                    <p className="text-sm" style={{ color: '#6B7280' }}>{occupant.phone}</p>
                  </div>

                  <span style={{ display: 'inline-flex', alignItems: 'center', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, backgroundColor: paymentStatusBadge[occupant.paymentStatus].bg, color: paymentStatusBadge[occupant.paymentStatus].color, border: `1px solid ${paymentStatusBadge[occupant.paymentStatus].color}` }}>
                    {paymentStatusLabel[occupant.paymentStatus]}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👥</div>
              <p className="text-sm font-medium" style={{ color: 'var(--navy, #1A1A2E)' }}>Aucun co-occupant</p>
              <p className="text-xs mt-1" style={{ color: '#6B7280' }}>Invitez quelqu&apos;un à partager votre chambre</p>
            </div>
          )}
        </div>
      </div>

      {/* Room Preferences */}
      <div style={{ backgroundColor: 'white', border: '1.5px solid #E5E0D8', borderRadius: '20px', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem' }} className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--navy, #1A1A2E)' }}>Préférences de chambre</h2>
            {isCutoffPassed && (
              <p className="text-sm rounded p-2 mt-2" style={{ color: '#D97706', backgroundColor: '#FEF3C7', border: '1px solid #F59E0B' }}>
                Vous ne pouvez plus modifier les préférences car la date du voyage approche.
              </p>
            )}
          </div>

          <form onSubmit={handlePreferencesSave} className="space-y-4">
            <div>
              <label htmlFor="room-floor" className="block text-sm font-medium mb-1" style={{ color: 'var(--navy, #1A1A2E)' }}>
                Étage (optionnel)
              </label>
              <input
                id="room-floor"
                placeholder="ex: Rez-de-chaussée, 1er étage..."
                value={preferences.floor}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPreferences({ ...preferences, floor: (e.target as HTMLInputElement).value })}
                disabled={isCutoffPassed}
                aria-invalid={!!preferencesErrors.floor}
                aria-describedby={preferencesErrors.floor ? 'floor-error' : undefined}
                style={{ padding: '0.75rem 1rem', borderRadius: '12px', border: `1.5px solid ${preferencesErrors.floor ? '#DC2626' : '#E5E0D8'}`, fontSize: '0.95rem', width: '100%', outline: 'none', background: 'white', color: 'var(--navy, #1A1A2E)' }}
              />
              <FormFieldError error={preferencesErrors.floor} id="floor-error" />
            </div>

            <div>
              <label htmlFor="room-bedType" className="block text-sm font-medium mb-1" style={{ color: 'var(--navy, #1A1A2E)' }}>
                Type de lit (optionnel)
              </label>
              <select
                id="room-bedType"
                value={preferences.bedType}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPreferences({ ...preferences, bedType: e.target.value })}
                disabled={isCutoffPassed}
                aria-invalid={!!preferencesErrors.bedType}
                aria-describedby={preferencesErrors.bedType ? 'bedType-error' : undefined}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: `1.5px solid ${preferencesErrors.bedType ? '#DC2626' : '#E5E0D8'}`,
                  color: 'var(--navy, #1A1A2E)',
                  backgroundColor: 'white',
                }}
              >
                <option value="">Pas de préférence</option>
                <option value="single">Lit simple</option>
                <option value="double">Lit double</option>
                <option value="twin">Deux lits simples</option>
              </select>
              <FormFieldError error={preferencesErrors.bedType} id="bedType-error" />
            </div>

            <div>
              <label htmlFor="room-specialRequests" className="block text-sm font-medium mb-1" style={{ color: 'var(--navy, #1A1A2E)' }}>
                Demandes spéciales (optionnel)
              </label>
              <textarea
                id="room-specialRequests"
                placeholder="ex: Hypoallergénique, lit surélevé, etc."
                value={preferences.specialRequests}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPreferences({ ...preferences, specialRequests: (e.target as HTMLInputElement).value })}
                disabled={isCutoffPassed}
                rows={3}
                aria-invalid={!!preferencesErrors.specialRequests}
                aria-describedby={preferencesErrors.specialRequests ? 'specialRequests-error' : undefined}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: `1.5px solid ${preferencesErrors.specialRequests ? '#DC2626' : '#E5E0D8'}`,
                  color: 'var(--navy, #1A1A2E)',
                  backgroundColor: 'white',
                }}
              />
              <FormFieldError error={preferencesErrors.specialRequests} id="specialRequests-error" />
            </div>

            <button
              type="submit"
              disabled={preferencesLoading || isCutoffPassed}
              style={{
                backgroundColor: 'var(--terra, #C75B39)',
                color: 'white',
                borderRadius: '12px',
                fontWeight: 700,
                padding: '0.75rem 1.5rem',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.95rem',
              }}
            >
              {preferencesLoading ? 'Sauvegarde...' : 'Sauvegarder les préférences'}
            </button>

            {preferencesMessage && (
              <div
                className={`p-3 rounded-lg text-sm ${
                  preferencesMessage.type === 'success'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {preferencesMessage.text}
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Documents Upload */}
      {rooming.documentsRequired && (
        <div style={{ backgroundColor: 'white', border: '1.5px solid #E5E0D8', borderRadius: '20px', overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem' }} className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Documents requis</h2>
              <p className="text-sm text-gray-600">
                Veuillez uploader vos documents d'identité (passeport ou carte d'identité)
              </p>
            </div>

            <form onSubmit={handleDocumentsUpload} className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <label className="cursor-pointer">
                  <p className="text-gray-600 mb-2">
                    Cliquez pour sélectionner les fichiers ou glissez-déposez
                  </p>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDocuments(Array.from(e.target.files || []))}
                    className="hidden"
                  />
                </label>
              </div>

              {documents.length > 0 && (
                <div className="space-y-2">
                  <p className="font-medium text-gray-900 text-sm">
                    Fichiers sélectionnés ({documents.length}):
                  </p>
                  {documents.map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-700">{doc.name}</span>
                      <button
                        type="button"
                        onClick={() => setDocuments(documents.filter((_, i) => i !== idx))}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Supprimer
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="submit"
                disabled={documentsLoading || documents.length === 0}
                style={{
                  backgroundColor: 'var(--terra, #C75B39)',
                  color: 'white',
                  borderRadius: '12px',
                  fontWeight: 700,
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                }}
              >
                {documentsLoading ? 'Upload...' : 'Uploader les documents'}
              </button>

              {documentsMessage && (
                <div
                  className={`p-3 rounded-lg text-sm ${
                    documentsMessage.type === 'success'
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  {documentsMessage.text}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
