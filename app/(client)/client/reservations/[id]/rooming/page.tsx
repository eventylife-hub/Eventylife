/**
 * Rooming détails — Gestion de la chambre et co-occupants
 * Page pour détails de rooming, préférences, et documents
 */

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/utils';

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
  PENDING: 'bg-yellow-100 text-yellow-800',
  PARTIAL: 'bg-orange-100 text-orange-800',
  PAID: 'bg-green-100 text-green-800'
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

        const data = await res.json();
        setRooming(data);
        setPreferences({
          floor: data.preferences?.floor || '',
          bedType: data.preferences?.bedType || '',
          specialRequests: data.preferences?.specialRequests || ''
        });
        setState('data');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur');
        setState('error');
      }
    };

    if (reservationId) loadRooming();
  }, [reservationId]);

  const handlePreferencesSave = async (e: React.FormEvent) => {
    e.preventDefault();
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

      const data = await res.json();
      setRooming(data);
      setPreferencesMessage({ type: 'success', text: 'Préférences sauvegardées avec succès !' });
      setTimeout(() => setPreferencesMessage(null), 5000);
    } catch (err) {
      setPreferencesMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Erreur'
      });
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
    } catch (err) {
      setDocumentsMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Erreur'
      });
    } finally {
      setDocumentsLoading(false);
    }
  };

  if (state === 'loading') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-48 w-full rounded-lg" />
        <Skeleton className="h-80 w-full rounded-lg" />
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700">
          Erreur : {error}
          <Link href={`/client/reservations/${reservationId}`}>
            <Button variant="outline" className="ml-4">
              Retour à la réservation
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!rooming) return null;

  const isCutoffPassed = new Date(rooming.checkInDate) < new Date();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      {/* Header */}
      <div>
        <Link href={`/client/reservations/${reservationId}`}>
          <Button variant="outline" size="sm" className="mb-4">
            ← Retour
          </Button>
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Détails de la chambre</h1>
        <p className="text-gray-600">{rooming.hotelName}</p>
      </div>

      {/* Room Info Card */}
      <Card elevated>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Informations de la chambre</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Type de chambre</p>
              <p className="text-lg font-semibold text-gray-900">{rooming.roomType}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">Capacité</p>
              <p className="text-lg font-semibold text-gray-900">
                {rooming.occupants.length} / {rooming.capacity} personnes
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">Check-in</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatDate(rooming.checkInDate)}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">Check-out</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatDate(rooming.checkOutDate)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Co-occupants */}
      <Card elevated>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Co-occupants</h2>

          {rooming.occupants.length > 0 ? (
            <div className="space-y-3">
              {rooming.occupants.map((occupant) => (
                <div
                  key={occupant.id}
                  className="flex flex-col md:flex-row md:items-center md:justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div>
                    <p className="font-semibold text-gray-900">
                      {occupant.firstName} {occupant.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{occupant.email}</p>
                    <p className="text-sm text-gray-600">{occupant.phone}</p>
                  </div>

                  <Badge
                    variant="outline"
                    className={paymentStatusBadge[occupant.paymentStatus]}
                  >
                    {paymentStatusLabel[occupant.paymentStatus]}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">Aucun co-occupant pour le moment.</p>
          )}
        </CardContent>
      </Card>

      {/* Room Preferences */}
      <Card elevated>
        <CardContent className="p-6 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Préférences de chambre</h2>
            {isCutoffPassed && (
              <p className="text-sm text-orange-600 bg-orange-50 border border-orange-200 rounded p-2 mt-2">
                Vous ne pouvez plus modifier les préférences car la date du voyage approche.
              </p>
            )}
          </div>

          <form onSubmit={handlePreferencesSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Étage (optionnel)
              </label>
              <Input
                placeholder="ex: Rez-de-chaussée, 1er étage..."
                value={preferences.floor}
                onChange={(e) => setPreferences({ ...preferences, floor: e.target.value })}
                disabled={isCutoffPassed}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type de lit (optionnel)
              </label>
              <select
                value={preferences.bedType}
                onChange={(e) => setPreferences({ ...preferences, bedType: e.target.value })}
                disabled={isCutoffPassed}
                className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100"
              >
                <option value="">Pas de préférence</option>
                <option value="single">Lit simple</option>
                <option value="double">Lit double</option>
                <option value="twin">Deux lits simples</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Demandes spéciales (optionnel)
              </label>
              <textarea
                placeholder="ex: Hypoallergénique, lit surélevé, etc."
                value={preferences.specialRequests}
                onChange={(e) => setPreferences({ ...preferences, specialRequests: e.target.value })}
                disabled={isCutoffPassed}
                rows={3}
                className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100"
              />
            </div>

            <Button
              variant="primary"
              type="submit"
              disabled={preferencesLoading || isCutoffPassed}
            >
              {preferencesLoading ? 'Sauvegarde...' : 'Sauvegarder les préférences'}
            </Button>

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
        </CardContent>
      </Card>

      {/* Documents Upload */}
      {rooming.documentsRequired && (
        <Card elevated>
          <CardContent className="p-6 space-y-6">
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
                    onChange={(e) => setDocuments(Array.from(e.target.files || []))}
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

              <Button
                variant="primary"
                type="submit"
                disabled={documentsLoading || documents.length === 0}
              >
                {documentsLoading ? 'Upload...' : 'Uploader les documents'}
              </Button>

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
          </CardContent>
        </Card>
      )}
    </div>
  );
}
