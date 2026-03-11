'use client';

/**
 * Page Checkout - Tunnel de réservation multi-étapes
 * 
 * 5 étapes:
 * 1. Chambre: sélection type + occupancy
 * 2. Paiement: mode paiement (tout, split, mix, autre)
 * 3. Inviter: emails des co-payeurs (si split)
 * 4. Stripe: redirection paiement
 * 5. Confirmation: statut + timer
 *
 * Invariants financiers critiques:
 * - pricingParts = occupancyCount (JAMAIS capacity)
 * - perPersonTTC × occupancyCount + roundingRemainder == roomTotalTTC
 * - Money = centimes Int (JAMAIS Float)
 */


import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, ChevronRight, Mail, Phone } from 'lucide-react';
import { useCheckoutStore, type Room } from '@/lib/stores/checkout-store';
import { useToast } from '@/lib/stores/ui-store';
import { StepIndicator } from '@/components/checkout/step-indicator';
import { PriceSummary } from '@/components/checkout/price-summary';
import { HoldTimer } from '@/components/checkout/hold-timer';
import { ROUTES } from '@/lib/constants';
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

type LoadState = 'loading' | 'error' | 'empty' | 'data';

interface RoomType {
  id: string;
  label: string;
  capacity: number;
  priceTotalTTC: number;
  stock: number;
}

interface Travel {
  id: string;
  title: string;
  startDate: string;
  roomTypes: RoomType[];
}

interface CheckoutSession {
  id: string;
  bookingGroupId: string;
  holdExpiresAt: string;
  rooms: Room[];
}

export default function CheckoutPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const toast = useToast();
  const {
    currentStep,
    setCurrentStep,
    nextStep,
    prevStep,
    setTravel: setStoreTravel,
    setRooms: setStoreRooms,
    setHoldExpiresAt,
    bookingGroupId,
    setBookingGroupId,
    rooms: storeRooms,
    holdExpiresAt,
  } = useCheckoutStore();

  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [travel, setTravel] = useState<Travel | null>(null);
  const [selectedRooms, setSelectedRooms] = useState<Map<string, { occupancy: number }>>(new Map());
  const [paymentMode, setPaymentMode] = useState<'all' | 'split' | 'mix' | 'reimburse'>('all');
  const [myShareCount, setMyShareCount] = useState(1);
  const [insuranceSelected, setInsuranceSelected] = useState(false);
  const [invites, setInvites] = useState<{ email: string; phone?: string }[]>([]);
  const [newInviteEmail, setNewInviteEmail] = useState('');
  const [newInvitePhone, setNewInvitePhone] = useState('');
  const [cgvAccepted, setCgvAccepted] = useState(false);
  const [confirmationData, setConfirmationData] = useState<{
    paymentStatus: 'HOLD' | 'PARTIALLY_PAID' | 'CONFIRMED';
    progressPercent?: number;
  } | null>(null);

  // Load travel data on mount
  useEffect(() => {
    const loadTravel = async () => {
      try {
        setLoadState('loading');
        const response = await fetch(`/api/travels/${params.slug}`, {
          credentials: 'include',
        });
        if (!response.ok) {
          setLoadState('error');
          return;
        }
        const data = await response.json();
        setTravel(data);
        setStoreTravel(data);
        setLoadState('data');
      } catch {
        setLoadState('error');
        // Erreur silencieuse — chargement voyage échoué
      }
    };
    loadTravel();
  }, [params.slug, setStoreTravel]);

  // Format centimes to EUR with French locale
  const formatEUR = useCallback((centimes: number): string => {
    const euros = Math.floor(centimes / 100);
    const cents = centimes % 100;
    return `${euros},${String(cents).padStart(2, '0')} €`;
  }, []);

  // Calculate room total with rounding
  const calculateRoomTotal = useCallback(
    (roomPrice: number, occupancy: number) => {
      if (occupancy === 0) return { perPerson: 0, total: 0, remainder: 0 };
      const perPersonTTC = Math.floor(roomPrice / occupancy);
      const total = perPersonTTC * occupancy;
      const remainder = roomPrice - total;
      return { perPerson: perPersonTTC, total, remainder };
    },
    [],
  );

  // Start checkout session
  const startCheckoutSession = useCallback(async () => {
    if (!selectedRooms.size) {
      toast.error('Sélectionnez au moins une chambre');
      return;
    }
    try {
      const roomsData = Array.from(selectedRooms.entries()).map(
        ([roomTypeId, { occupancy }]) => {
          const roomType = travel?.roomTypes.find(rt => rt.id === roomTypeId);
          if (!roomType) return null;
          const { perPerson, total, remainder } = calculateRoomTotal(
            roomType.priceTotalTTC,
            occupancy,
          );
          return {
            roomTypeId,
            label: roomType.label,
            capacity: roomType.capacity,
            occupancyCount: occupancy,
            priceTotalTTC: total,
            perPersonTTC: perPerson,
            roundingRemainder: remainder,
          };
        },
      );
      const response = await fetch('/api/checkout/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          slug: params.slug,
          rooms: roomsData,
          paymentMode,
          insuranceSelected,
        }),
      });
      if (!response.ok) {
        toast.error('Erreur lors du démarrage du checkout');
        return;
      }
      const session: CheckoutSession = await response.json() as unknown;
      setBookingGroupId(session.bookingGroupId);
      setStoreRooms(session.rooms);
      setHoldExpiresAt(new Date(session.holdExpiresAt));
      nextStep();
    } catch {
      // Erreur silencieuse — checkout start échoué
      toast.error('Erreur lors du démarrage du checkout');
    }
  }, [selectedRooms, travel, calculateRoomTotal, params.slug, paymentMode, insuranceSelected, toast, nextStep, setBookingGroupId, setStoreRooms, setHoldExpiresAt]);

  // Add invitation
  const addInvite = useCallback(() => {
    if (!newInviteEmail) {
      toast.error('Entrez une adresse email');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newInviteEmail)) {
      toast.error('Adresse email invalide');
      return;
    }
    setInvites(prev => [...prev, { email: newInviteEmail, phone: newInvitePhone || undefined }]);
    setNewInviteEmail('');
    setNewInvitePhone('');
  }, [newInviteEmail, newInvitePhone, toast]);

  // Remove invitation
  const removeInvite = useCallback((email: string) => {
    setInvites(prev => prev.filter(inv => inv.email !== email));
  }, []);

  // Proceed to Stripe
  const proceedToStripe = useCallback(async () => {
    if (!cgvAccepted) {
      toast.error('Acceptez les conditions générales');
      return;
    }
    if (!bookingGroupId) {
      toast.error('Session de paiement introuvable');
      return;
    }
    try {
      const response = await fetch('/api/checkout/stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          bookingGroupId,
          invites: paymentMode === 'split' ? invites : unknown[],
        }),
      });
      if (!response.ok) {
        toast.error('Erreur lors de la redirection paiement');
        return;
      }
      const { redirectUrl } = await response.json() as unknown;
      window.location.href = redirectUrl;
    } catch {
      // Erreur silencieuse — redirection Stripe échouée
      toast.error('Erreur lors de la redirection paiement');
    }
  }, [bookingGroupId, cgvAccepted, invites, paymentMode, toast]);

  if (loadState === 'loading') {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: C.cream,
          padding: '1rem',
        }}
      >
        <div style={{ maxWidth: '42rem', margin: '0 auto', paddingTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ height: '32px', backgroundColor: C.border, borderRadius: '8px', width: '160px', opacity: 0.5 }}></div>
          <div style={{ height: '16px', backgroundColor: C.border, borderRadius: '8px', width: '100%', opacity: 0.5 }}></div>
          <div style={{ height: '40px', backgroundColor: C.border, borderRadius: '8px', width: '100%', opacity: 0.5 }}></div>
          <div style={{ height: '40px', backgroundColor: C.border, borderRadius: '8px', width: '100%', opacity: 0.5 }}></div>
          <div style={{ height: '40px', backgroundColor: C.border, borderRadius: '8px', width: '100%', opacity: 0.5 }}></div>
        </div>
      </div>
    );
  }

  if (loadState === 'error') {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: C.cream,
          padding: '1rem',
        }}
      >
        <div style={{ maxWidth: '42rem', margin: '0 auto', paddingTop: '2rem' }}>
          <div
            style={{
              backgroundColor: 'var(--terra-soft, #FEF2F2)',
              border: `1.5px solid ${C.border}`,
              borderRadius: '20px',
              padding: '1.5rem',
              display: 'flex',
              gap: '1rem',
            }}
          >
            <AlertCircle style={{ width: '24px', height: '24px', color: C.terra, flexShrink: 0, marginTop: '0.125rem' }} />
            <div>
              <h3 style={{ fontWeight: '600', color: C.terra, marginBottom: '0.5rem' }}>
                Erreur lors du chargement
              </h3>
              <p style={{ fontSize: '0.875rem', color: C.muted, marginBottom: '1rem' }}>
                Impossible de charger les données du voyage. Veuillez réessayer.
              </p>
              <button
                onClick={() => window.location.reload()}
                style={{
                  backgroundColor: 'transparent',
                  color: C.terra,
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  fontWeight: '600',
                  border: `1.5px solid ${C.border}`,
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.backgroundColor = C.terraSoft;
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.backgroundColor = 'transparent';
                }}
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!travel) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: C.cream,
          padding: '1rem',
        }}
      >
        <div style={{ maxWidth: '42rem', margin: '0 auto', paddingTop: '2rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: C.navy, marginBottom: '0.5rem' }}>
            Voyage non trouvé
          </h2>
          <p style={{ color: C.muted, marginBottom: '1.5rem' }}>
            Le voyage demandé n&apos;existe pas ou a été supprimé.
          </p>
          <button
            onClick={() => router.push(ROUTES.VOYAGES)}
            style={{
              backgroundColor: C.terra,
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '10px',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              boxShadow: `0 10px 25px -5px rgba(199, 91, 57, 0.2)`,
            }}
          >
            Retour aux voyages
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: C.cream,
        padding: '1rem',
      }}
    >
      <div style={{ maxWidth: '42rem', margin: '0 auto', paddingTop: '2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1
            style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: C.navy,
              marginBottom: '0.5rem',
            }}
          >
            Réservation: {travel.title}
          </h1>
          <p style={{ fontSize: '0.875rem', color: C.muted }}>
            Départ: {formatDate(travel.startDate)}
          </p>
        </div>

        <StepIndicator currentStep={currentStep} />

        {currentStep === 1 && (
          <div className="space-y-6 mb-8">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Étape 1/5: Sélection des chambres
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Choisissez le type de chambre et le nombre d&apos;occupants.
              </p>
            </div>
            <div className="space-y-4">
              {travel.roomTypes.map(roomType => {
                const selected = selectedRooms.get(roomType.id);
                const occupancy = selected?.occupancy || 1;
                const { perPerson, remainder } = calculateRoomTotal(
                  roomType.priceTotalTTC,
                  occupancy,
                );
                return (
                  <Card
                    key={roomType.id}
                    className={`cursor-pointer transition-all ${
                      selected
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => {
                      if (selected) {
                        setSelectedRooms(prev => {
                          const next = new Map(prev);
                          next.delete(roomType.id);
                          return next;
                        });
                      } else {
                        setSelectedRooms(prev =>
                          new Map(prev).set(roomType.id, { occupancy: 1 }),
                        );
                      }
                    }}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {roomType.label}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            Capacité: jusqu&apos;à {roomType.capacity} personnes
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {roomType.stock} disponible{roomType.stock > 1 ? 's' : ''}
                          </Badge>
                        </div>
                        <div
                          className={`text-right font-semibold text-lg ${
                            selected ? 'text-blue-600' : 'text-gray-900'
                          }`}
                        >
                          {formatEUR(roomType.priceTotalTTC)}
                        </div>
                      </div>
                      {selected && (
                        <div className="border-t border-gray-200 pt-4 mt-4 space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                              Nombre d&apos;occupants
                            </label>
                            <div className="flex items-center gap-3">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e: React.MouseEvent) => {
                                  e.stopPropagation();
                                  if (occupancy > 1) {
                                    setSelectedRooms(prev =>
                                      new Map(prev).set(roomType.id, {
                                        occupancy: occupancy - 1,
                                      }),
                                    );
                                  }
                                }}
                                className="h-9 w-9 p-0"
                              >
                                −
                              </Button>
                              <span className="w-8 text-center font-semibold">
                                {occupancy}
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e: React.MouseEvent) => {
                                  e.stopPropagation();
                                  if (occupancy < roomType.capacity) {
                                    setSelectedRooms(prev =>
                                      new Map(prev).set(roomType.id, {
                                        occupancy: occupancy + 1,
                                      }),
                                    );
                                  }
                                }}
                                className="h-9 w-9 p-0"
                              >
                                +
                              </Button>
                            </div>
                          </div>
                          <div className="bg-white rounded p-3 border border-gray-200">
                            <p className="text-xs text-gray-600 mb-2">Prix par personne:</p>
                            <p className="text-lg font-bold text-blue-600">
                              {formatEUR(perPerson)} / personne
                            </p>
                            {remainder > 0 && (
                              <p className="text-xs text-orange-600 mt-2">
                                Arrondi: +{formatEUR(remainder)}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="pt-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={insuranceSelected}
                    onChange={e => setInsuranceSelected((e.target as HTMLInputElement).checked)}
                    className="w-5 h-5 mt-1 rounded border-gray-300 text-blue-600 cursor-pointer"
                  />
                  <div>
                    <p className="font-medium text-gray-900 mb-1">
                      Ajouter une assurance annulation
                    </p>
                    <p className="text-sm text-gray-600">
                      Protection complète en cas d&apos;imprévu (5% du montant total)
                    </p>
                  </div>
                </label>
              </CardContent>
            </Card>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6 mb-8">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Étape 2/5: Mode de paiement
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Sélectionnez comment vous souhaitez gérer le paiement.
              </p>
            </div>
            <div className="space-y-3">
              {[
                {
                  id: 'all',
                  label: 'Je paie tout',
                  desc: 'Vous réglerez la totalité du montant',
                },
                {
                  id: 'split',
                  label: 'Paiement partagé',
                  desc: 'Chacun paie sa part, invitez les autres',
                },
                {
                  id: 'mix',
                  label: 'Paiement mixte',
                  desc: 'Vous payez N parts + invitez les autres',
                },
                {
                  id: 'reimburse',
                  label: 'Je paie tout (remboursement)',
                  desc: 'Vous payez, on vous rembourse après',
                },
              ].map(option => (
                <Card
                  key={option.id}
                  className={`cursor-pointer transition-all ${
                    paymentMode === option.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() =>
                    setPaymentMode(option.id as typeof paymentMode)
                  }
                >
                  <CardContent className="pt-6 pb-4">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${
                          paymentMode === option.id
                            ? 'border-blue-600 bg-blue-600'
                            : 'border-gray-300'
                        }`}
                      >
                        {paymentMode === option.id && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {option.label}
                        </p>
                        <p className="text-sm text-gray-600">{option.desc}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {paymentMode === 'mix' && (
              <Card className="border-amber-200 bg-amber-50">
                <CardContent className="pt-6">
                  <label className="block text-sm font-medium text-gray-900 mb-3">
                    Combien de parts voulez-vous payer ?
                  </label>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setMyShareCount(Math.max(1, myShareCount - 1))
                      }
                      className="h-9 w-9 p-0"
                    >
                      −
                    </Button>
                    <span className="w-8 text-center font-semibold">
                      {myShareCount}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setMyShareCount(
                          Math.min(
                            selectedRooms.size * 4,
                            myShareCount + 1,
                          ),
                        )
                      }
                      className="h-9 w-9 p-0"
                    >
                      +
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {currentStep === 3 && paymentMode !== 'all' && paymentMode !== 'reimburse' && (
          <div className="space-y-6 mb-8">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Étape 3/5: Inviter les co-payeurs
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Entrez les contacts de ceux qui participeront au paiement.
              </p>
            </div>
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse email
                  </label>
                  <input
                    type="email"
                    value={newInviteEmail}
                    onChange={e => setNewInviteEmail((e.target as HTMLInputElement).value)}
                    placeholder="exemple@mail.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone (optionnel)
                  </label>
                  <input
                    type="tel"
                    value={newInvitePhone}
                    onChange={e => setNewInvitePhone((e.target as HTMLInputElement).value)}
                    placeholder="+33 6 XX XX XX XX"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <Button
                  onClick={addInvite}
                  className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                >
                  Ajouter
                </Button>
              </CardContent>
            </Card>
            {invites.length > 0 && (
              <Card>
                <CardHeader>
                  <h3 className="font-semibold text-gray-900">
                    Co-payeurs invités ({invites.length})
                  </h3>
                </CardHeader>
                <CardContent className="space-y-2">
                  {invites.map((invite, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <Mail className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {invite.email}
                          </p>
                          {invite.phone && (
                            <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                              <Phone className="w-3 h-3" />
                              {invite.phone}
                            </p>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeInvite(invite.email)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Retirer
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-6 mb-8">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Étape 4/5: Vérification
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Vérifiez les informations avant de procéder au paiement.
              </p>
            </div>
            <PriceSummary rooms={storeRooms} />
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="pt-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cgvAccepted}
                    onChange={e => setCgvAccepted((e.target as HTMLInputElement).checked)}
                    className="w-5 h-5 mt-1 rounded border-gray-300 text-amber-600 cursor-pointer"
                  />
                  <div>
                    <p className="text-sm text-gray-900 mb-1">
                      J&apos;accepte les conditions générales de vente
                    </p>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      En confirmant, vous acceptez les CGV Eventy Life
                      (Arrêté 1er mars 2018). Aucun droit de rétractation
                      n&apos;est applicable car il s&apos;agit d&apos;une prestation à date
                      déterminée.
                    </p>
                  </div>
                </label>
              </CardContent>
            </Card>
          </div>
        )}

        {currentStep === 5 && (
          <div className="space-y-6 mb-8">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Étape 5/5: Confirmation
              </h2>
            </div>
            {confirmationData ? (
              <>
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                        ✓
                      </div>
                      <p className="text-lg font-semibold text-gray-900">
                        Réservation en cours
                      </p>
                      <Badge
                        variant={
                          confirmationData.paymentStatus === 'CONFIRMED'
                            ? 'default'
                            : 'outline'
                        }
                        className="mt-3 text-xs"
                      >
                        Statut: {confirmationData.paymentStatus}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
                {holdExpiresAt && (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-900 font-medium">
                          Expiration du hold:
                        </span>
                        <HoldTimer expiresAt={holdExpiresAt} />
                      </div>
                    </CardContent>
                  </Card>
                )}
                {confirmationData.progressPercent !== undefined && (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="mb-2 flex justify-between">
                        <span className="text-sm text-gray-900 font-medium">
                          Paiement
                        </span>
                        <span className="text-sm text-gray-600">
                          {confirmationData.progressPercent}%
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 transition-all duration-300"
                          style={{
                            width: `${confirmationData.progressPercent}%`,
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : null}
          </div>
        )}

        <div className="flex gap-3 mb-8">
          {currentStep > 1 && (
            <Button
              variant="outline"
              onClick={prevStep}
              className="flex-1 h-11"
            >
              Précédent
            </Button>
          )}
          {currentStep < 4 && (
            <Button
              onClick={() => {
                if (currentStep === 1) {
                  startCheckoutSession();
                } else {
                  nextStep();
                }
              }}
              className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
            >
              Suivant
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
          {currentStep === 4 && (
            <Button
              onClick={proceedToStripe}
              disabled={!cgvAccepted}
              className="flex-1 h-11 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded-lg font-medium"
            >
              Passer au paiement
            </Button>
          )}
          {currentStep === 5 && (
            <Button
              onClick={() => router.push(ROUTES.VOYAGES)}
              className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
            >
              Retour aux voyages
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
