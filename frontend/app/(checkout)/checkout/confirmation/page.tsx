/**
 * Page de confirmation
 * Affichée après paiement réussi
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { useCheckoutStore } from '@/lib/stores/checkout-store';
import { api } from '@/lib/api';
import { ROUTES } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';

interface BookingDetails {
  id: string;
  referenceNumber: string;
  travelName: string;
  totalAmountTTC: number;
  participants: Array<{
    firstName: string;
    lastName: string;
    email: string;
  }>;
  roomCount: number;
  createdAt: string;
}

export default function CheckoutConfirmationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const { bookingGroupId, reset } = useCheckoutStore();
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger les détails de la réservation via sessionId ou bookingGroupId
  useEffect(() => {
    const loadBooking = async () => {
      try {
        setLoading(true);
        setError(null);

        // Utiliser sessionId en priorité, sinon bookingGroupId
        const id = sessionId || bookingGroupId;
        if (!id) {
          setError('Aucune réservation trouvée');
          setLoading(false);
          return;
        }

        const endpoint = sessionId
          ? `/checkout/by-session/${sessionId}`
          : `/checkout/${id}`;

        const response = await api.get<BookingDetails>(endpoint);

        if (response.success && response.data) {
          setBooking(response.data);
        } else {
          setError(response.error?.message || 'Erreur lors du chargement des détails');
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Erreur lors du chargement';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    if (sessionId || bookingGroupId) {
      loadBooking();
    }
  }, [sessionId, bookingGroupId]);

  const handleDownloadPDF = async () => {
    if (!booking) return;

    try {
      setDownloading(true);
      setError(null);

      const response = await api.get<Blob>(
        `/checkout/${booking.id}/confirmation-pdf`,
        { headers: { 'Accept': 'application/pdf' } }
      );

      if (response.success && response.data) {
        // Créer un blob et télécharger
        const url = window.URL.createObjectURL(new Blob([response.data as unknown as BlobPart]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `confirmation-${booking.referenceNumber}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } else {
        setError(response.error?.message || 'Erreur lors du téléchargement du PDF');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur lors du téléchargement';
      setError(message);
    } finally {
      setDownloading(false);
    }
  };

  const handleViewReservation = () => {
    reset();
    router.push(`${ROUTES.CLIENT.RESERVATIONS}/${bookingGroupId}`);
  };

  const handleBackHome = () => {
    reset();
    router.push(ROUTES.HOME);
  };

  // État Loading
  if (loading) {
    return (
      <div className="space-y-8 py-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-4 animate-pulse"></div>
          <div className="h-8 bg-gray-300 rounded w-1/2 mx-auto mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-300 rounded w-1/3 mx-auto animate-pulse"></div>
        </div>
      </div>
    );
  }

  // État Error
  if (error || !booking) {
    return (
      <div className="space-y-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-700 font-medium mb-4">
            {error || 'Erreur lors du chargement de votre réservation'}
          </p>
          <Button
            onClick={() => router.push(ROUTES.HOME)}
            className="w-full"
          >
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-8">
      <div className="text-center">
        <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Réservation confirmée!
        </h1>
        <p className="text-gray-600">
          Votre paiement a été reçu avec succès
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
        <p className="text-sm text-gray-600 mb-2">Numéro de confirmation</p>
        <p className="text-2xl font-bold text-blue-600">{booking.referenceNumber}</p>
      </div>

      <div className="border rounded-lg p-6 space-y-4">
        <h2 className="font-semibold text-lg">Résumé de votre réservation</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Voyage:</span>
            <span className="font-medium">{booking.travelName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Nombre de chambres:</span>
            <span className="font-medium">{booking.roomCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Participants:</span>
            <span className="font-medium">{booking.participants.length}</span>
          </div>
          <div className="border-t pt-3 flex justify-between font-semibold">
            <span>Total:</span>
            <span>{formatPrice(booking.totalAmountTTC)}</span>
          </div>
        </div>
        <p className="text-gray-600 text-sm mt-4">
          Vous recevrez un email de confirmation avec tous les détails à vos coordonnées.
        </p>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <p>✓ Paiement confirmé</p>
        <p>✓ Réservation verrouillée</p>
        <p>✓ Confirmation envoyée par email</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <Button
          onClick={handleDownloadPDF}
          disabled={downloading}
          variant="outline"
          className="w-full"
        >
          {downloading ? 'Téléchargement...' : 'Télécharger la confirmation (PDF)'}
        </Button>
        <Button
          onClick={handleViewReservation}
          className="w-full"
        >
          Voir ma réservation
        </Button>
        <Button
          onClick={handleBackHome}
          variant="outline"
          className="w-full"
        >
          Retour à l'accueil
        </Button>
      </div>
    </div>
  );
}
