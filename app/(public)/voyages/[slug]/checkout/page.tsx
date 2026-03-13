'use client';

/**
 * Page Checkout - Tunnel de réservation multi-étapes — Sun/Ocean V4
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
import { AlertCircle, ChevronRight, Mail, Phone } from 'lucide-react';
import { useCheckoutStore, type Room } from '@/lib/stores/checkout-store';
import { useToast } from '@/lib/stores/ui-store';
import { StepIndicator } from '@/components/checkout/step-indicator';
import { PriceSummary } from '@/components/checkout/price-summary';
import { HoldTimer } from '@/components/checkout/hold-timer';
import { ROUTES } from '@/lib/constants';
import { formatDate } from '@/lib/utils';
import { logger } from '@/lib/logger';

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

/* ─── Shared inline style helpers ─── */
const cardStyle: React.CSSProperties = {
  backgroundColor: 'white',
  border: '1.5px solid #E5E0D8',
  borderRadius: '20px',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
};

const cardSelectedStyle: React.CSSProperties = {
  ...cardStyle,
  borderColor: 'var(--terra, #C75B39)',
  backgroundColor: '#FDF6E8',
};

const cardPadding: React.CSSProperties = { padding: '1.5rem' };

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.75rem 1rem',
  borderRadius: '12px',
  border: '1.5px solid #E5E0D8',
  outline: 'none',
  transition: 'all 0.3s ease',
  fontFamily: 'inherit',
  fontSize: '0.875rem',
};

const btnTerra: React.CSSProperties = {
  backgroundColor: 'var(--terra, #C75B39)',
  color: 'white',
  padding: '0.75rem 1.5rem',
  borderRadius: '12px',
  fontWeight: 700,
  border: 'none',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  fontSize: '0.875rem',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
};

const btnOutline: React.CSSProperties = {
  backgroundColor: 'white',
  color: 'var(--navy, #1A1A2E)',
  padding: '0.75rem 1.5rem',
  borderRadius: '12px',
  fontWeight: 700,
  border: '1.5px solid #E5E0D8',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  fontSize: '0.875rem',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const counterBtn: React.CSSProperties = {
  width: '2.25rem',
  height: '2.25rem',
  borderRadius: '8px',
  border: '1.5px solid #E5E0D8',
  backgroundColor: 'white',
  color: 'var(--navy, #1A1A2E)',
  fontWeight: 700,
  fontSize: '1rem',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.2s ease',
};

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
        const data = await response.json() as Travel;
        setTravel(data);
        setStoreTravel(data);
        setLoadState('data');
      } catch {
        logger.warn('API voyage indisponible — données démo');
        const fallbackTravel: Travel = {
          id: 'voyage-demo-' + params.slug,
          title: 'Îles Éoliennes & Baroque Sicilien',
          startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          roomTypes: [
            { id: 'room-1', label: 'Chambre double standard', capacity: 2, priceTotalTTC: 149000, stock: 8 },
            { id: 'room-2', label: 'Chambre triple', capacity: 3, priceTotalTTC: 189000, stock: 5 },
            { id: 'room-3', label: 'Chambre quadruple', capacity: 4, priceTotalTTC: 229000, stock: 3 },
          ],
        };
        setTravel(fallbackTravel);
        setStoreTravel(fallbackTravel);
        setLoadState('data');
      }
    };
    loadTravel();
  }, [params.slug, setStoreTravel]);

  const formatEUR = useCallback((centimes: number): string => {
    const euros = Math.floor(centimes / 100);
    const cents = centimes % 100;
    return `${euros},${String(cents).padStart(2, '0')} €`;
  }, []);

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
          const { perPerson, total, remainder } = calculateRoomTotal(roomType.priceTotalTTC, occupancy);
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
        body: JSON.stringify({ slug: params.slug, rooms: roomsData, paymentMode, insuranceSelected }),
      });
      if (!response.ok) {
        toast.error('Erreur lors du démarrage du checkout');
        return;
      }
      const session = await response.json() as CheckoutSession;
      setBookingGroupId(session.bookingGroupId);
      setStoreRooms(session.rooms);
      setHoldExpiresAt(new Date(session.holdExpiresAt));
      nextStep();
    } catch {
      toast.error('Erreur lors du démarrage du checkout');
    }
  }, [selectedRooms, travel, calculateRoomTotal, params.slug, paymentMode, insuranceSelected, toast, nextStep, setBookingGroupId, setStoreRooms, setHoldExpiresAt]);

  const addInvite = useCallback(() => {
    if (!newInviteEmail) { toast.error('Entrez une adresse email'); return; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newInviteEmail)) { toast.error('Adresse email invalide'); return; }
    setInvites(prev => [...prev, { email: newInviteEmail, phone: newInvitePhone || undefined }]);
    setNewInviteEmail('');
    setNewInvitePhone('');
  }, [newInviteEmail, newInvitePhone, toast]);

  const removeInvite = useCallback((email: string) => {
    setInvites(prev => prev.filter(inv => inv.email !== email));
  }, []);

  const proceedToStripe = useCallback(async () => {
    if (!cgvAccepted) { toast.error('Acceptez les conditions générales'); return; }
    if (!bookingGroupId) { toast.error('Session de paiement introuvable'); return; }
    try {
      const response = await fetch('/api/checkout/stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ bookingGroupId, invites: paymentMode === 'split' ? invites : [] }),
      });
      if (!response.ok) { toast.error('Erreur lors de la redirection paiement'); return; }
      const { redirectUrl } = await response.json() as { redirectUrl: string };
      // SECURITY: Valider l'URL Stripe avant redirection
      try {
        const parsed = new URL(redirectUrl);
        if (parsed.protocol !== 'https:' || !parsed.hostname.includes('stripe.com')) {
          toast.error('URL de paiement invalide');
          return;
        }
      } catch {
        toast.error('URL de paiement invalide');
        return;
      }
      window.location.href = redirectUrl;
    } catch {
      toast.error('Erreur lors de la redirection paiement');
    }
  }, [bookingGroupId, cgvAccepted, invites, paymentMode, toast]);

  /* ─── Loading ─── */
  if (loadState === 'loading') {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--cream, #FAF7F2)', padding: '1rem' }}>
        <div style={{ maxWidth: '42rem', margin: '0 auto', paddingTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {[160, '100%', '100%', '100%', '100%'].map((w, i) => (
            <div key={i} style={{ height: i === 0 ? '32px' : '40px', backgroundColor: '#E5E0D8', borderRadius: '8px', width: typeof w === 'number' ? `${w}px` : w, opacity: 0.5, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
          ))}
          <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
        </div>
      </div>
    );
  }

  /* ─── Error ─── */
  if (loadState === 'error') {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--cream, #FAF7F2)', padding: '1rem' }}>
        <div style={{ maxWidth: '42rem', margin: '0 auto', paddingTop: '2rem' }}>
          <div style={{ backgroundColor: '#FEF2F2', border: '1.5px solid #E5E0D8', borderRadius: '20px', padding: '1.5rem', display: 'flex', gap: '1rem' }}>
            <AlertCircle style={{ width: '24px', height: '24px', color: 'var(--terra, #C75B39)', flexShrink: 0, marginTop: '0.125rem' }} />
            <div>
              <h3 style={{ fontWeight: 600, color: 'var(--terra, #C75B39)', marginBottom: '0.5rem' }}>Erreur lors du chargement</h3>
              <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '1rem' }}>Impossible de charger les données du voyage. Veuillez réessayer.</p>
              <button type="button" onClick={() => window.location.reload()} style={{ ...btnOutline, padding: '0.5rem 1rem' }}>
                Réessayer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ─── Empty ─── */
  if (!travel) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--cream, #FAF7F2)', padding: '1rem' }}>
        <div style={{ maxWidth: '42rem', margin: '0 auto', paddingTop: '2rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--navy, #1A1A2E)', marginBottom: '0.5rem' }}>Voyage non trouvé</h2>
          <p style={{ color: '#6B7280', marginBottom: '1.5rem' }}>Le voyage demandé n&apos;existe pas ou a été supprimé.</p>
          <button type="button" onClick={() => router.push(ROUTES.VOYAGES)} style={btnTerra}>Retour aux voyages</button>
        </div>
      </div>
    );
  }

  /* ─── Data — Checkout flow ─── */
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--cream, #FAF7F2)', padding: '1rem' }}>
      <div style={{ maxWidth: '42rem', margin: '0 auto', paddingTop: '2rem' }}>

        {/* Title */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--navy, #1A1A2E)', marginBottom: '0.5rem', fontFamily: 'var(--font-display, Playfair Display, serif)' }}>
            Réservation: {travel.title}
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>Départ: {formatDate(travel.startDate)}</p>
        </div>

        <StepIndicator currentStep={currentStep} />

        {/* ── Étape 1: Chambres ── */}
        {currentStep === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
            <div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--navy, #1A1A2E)', marginBottom: '1rem' }}>
                Étape 1/5: Sélection des chambres
              </h2>
              <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '1.5rem' }}>
                Choisissez le type de chambre et le nombre d&apos;occupants.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {travel.roomTypes.map(roomType => {
                const selected = selectedRooms.get(roomType.id);
                const occupancy = selected?.occupancy || 1;
                const { perPerson, remainder } = calculateRoomTotal(roomType.priceTotalTTC, occupancy);
                return (
                  <div
                    key={roomType.id}
                    style={selected ? cardSelectedStyle : { ...cardStyle, cursor: 'pointer' }}
                    onClick={() => {
                      if (selected) {
                        setSelectedRooms(prev => { const next = new Map(prev); next.delete(roomType.id); return next; });
                      } else {
                        setSelectedRooms(prev => new Map(prev).set(roomType.id, { occupancy: 1 }));
                      }
                    }}
                  >
                    <div style={cardPadding}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <div style={{ flex: 1 }}>
                          <h3 style={{ fontWeight: 600, color: 'var(--navy, #1A1A2E)', marginBottom: '0.25rem' }}>{roomType.label}</h3>
                          <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.5rem' }}>
                            Capacité: jusqu&apos;à {roomType.capacity} personnes
                          </p>
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#FDF6E8', color: 'var(--navy, #1A1A2E)', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>
                            {roomType.stock} disponible{roomType.stock > 1 ? 's' : ''}
                          </span>
                        </div>
                        <div style={{ textAlign: 'right', fontWeight: 600, fontSize: '1.125rem', color: selected ? 'var(--terra, #C75B39)' : 'var(--navy, #1A1A2E)' }}>
                          {formatEUR(roomType.priceTotalTTC)}
                        </div>
                      </div>

                      {selected && (
                        <div style={{ borderTop: '1.5px solid #E5E0D8', paddingTop: '1rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--navy, #1A1A2E)', marginBottom: '0.75rem' }}>
                              Nombre d&apos;occupants
                            </label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <button type="button" style={counterBtn}
                                onClick={(e) => { e.stopPropagation(); if (occupancy > 1) setSelectedRooms(prev => new Map(prev).set(roomType.id, { occupancy: occupancy - 1 })); }}>
                                −
                              </button>
                              <span style={{ width: '2rem', textAlign: 'center', fontWeight: 600 }}>{occupancy}</span>
                              <button type="button" style={counterBtn}
                                onClick={(e) => { e.stopPropagation(); if (occupancy < roomType.capacity) setSelectedRooms(prev => new Map(prev).set(roomType.id, { occupancy: occupancy + 1 })); }}>
                                +
                              </button>
                            </div>
                          </div>
                          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '0.75rem', border: '1.5px solid #E5E0D8' }}>
                            <p style={{ fontSize: '0.75rem', color: '#6B7280', marginBottom: '0.5rem' }}>Prix par personne:</p>
                            <p style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--terra, #C75B39)' }}>
                              {formatEUR(perPerson)} / personne
                            </p>
                            {remainder > 0 && (
                              <p style={{ fontSize: '0.75rem', color: '#D97706', marginTop: '0.5rem' }}>
                                Arrondi: +{formatEUR(remainder)}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Insurance */}
            <div style={{ ...cardStyle, borderColor: 'var(--gold, #D4A853)', backgroundColor: '#FDF6E8' }}>
              <div style={cardPadding}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={insuranceSelected} onChange={e => setInsuranceSelected(e.target.checked)}
                    style={{ width: '1.25rem', height: '1.25rem', marginTop: '0.125rem', borderRadius: '4px', cursor: 'pointer', accentColor: 'var(--terra, #C75B39)' }} />
                  <div>
                    <p style={{ fontWeight: 600, color: 'var(--navy, #1A1A2E)', marginBottom: '0.25rem' }}>Ajouter une assurance annulation</p>
                    <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>Protection complète en cas d&apos;imprévu (5% du montant total)</p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* ── Étape 2: Mode de paiement ── */}
        {currentStep === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
            <div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--navy, #1A1A2E)', marginBottom: '1rem' }}>Étape 2/5: Mode de paiement</h2>
              <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '1.5rem' }}>Sélectionnez comment vous souhaitez gérer le paiement.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { id: 'all', label: 'Je paie tout', desc: 'Vous réglerez la totalité du montant' },
                { id: 'split', label: 'Paiement partagé', desc: 'Chacun paie sa part, invitez les autres' },
                { id: 'mix', label: 'Paiement mixte', desc: 'Vous payez N parts + invitez les autres' },
                { id: 'reimburse', label: 'Je paie tout (remboursement)', desc: 'Vous payez, on vous rembourse après' },
              ].map(option => (
                <div
                  key={option.id}
                  style={paymentMode === option.id ? cardSelectedStyle : { ...cardStyle, cursor: 'pointer' }}
                  onClick={() => setPaymentMode(option.id as typeof paymentMode)}
                >
                  <div style={{ ...cardPadding, paddingTop: '1.25rem', paddingBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                      <div style={{
                        width: '1.25rem', height: '1.25rem', borderRadius: '50%',
                        border: `2px solid ${paymentMode === option.id ? 'var(--terra, #C75B39)' : '#D1D5DB'}`,
                        backgroundColor: paymentMode === option.id ? 'var(--terra, #C75B39)' : 'transparent',
                        flexShrink: 0, marginTop: '0.125rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {paymentMode === option.id && <div style={{ width: '0.5rem', height: '0.5rem', backgroundColor: 'white', borderRadius: '50%' }} />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 600, color: 'var(--navy, #1A1A2E)' }}>{option.label}</p>
                        <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>{option.desc}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {paymentMode === 'mix' && (
              <div style={{ ...cardStyle, borderColor: 'var(--gold, #D4A853)', backgroundColor: '#FDF6E8' }}>
                <div style={cardPadding}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--navy, #1A1A2E)', marginBottom: '0.75rem' }}>
                    Combien de parts voulez-vous payer ?
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <button type="button" style={counterBtn} onClick={() => setMyShareCount(Math.max(1, myShareCount - 1))}>−</button>
                    <span style={{ width: '2rem', textAlign: 'center', fontWeight: 600 }}>{myShareCount}</span>
                    <button type="button" style={counterBtn} onClick={() => setMyShareCount(Math.min(selectedRooms.size * 4, myShareCount + 1))}>+</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Étape 3: Invitations ── */}
        {currentStep === 3 && paymentMode !== 'all' && paymentMode !== 'reimburse' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
            <div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--navy, #1A1A2E)', marginBottom: '1rem' }}>Étape 3/5: Inviter les co-payeurs</h2>
              <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '1.5rem' }}>Entrez les contacts de ceux qui participeront au paiement.</p>
            </div>

            <div style={cardStyle}>
              <div style={{ ...cardPadding, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label htmlFor="ckout-inviteEmail" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--navy, #1A1A2E)', marginBottom: '0.5rem' }}>Adresse email</label>
                  <input id="ckout-inviteEmail" type="email" autoComplete="email" value={newInviteEmail} onChange={e => setNewInviteEmail(e.target.value)} placeholder="exemple@mail.com" style={inputStyle}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--terra, #C75B39)'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(199, 91, 57, 0.1)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = '#E5E0D8'; e.currentTarget.style.boxShadow = 'none'; }} />
                </div>
                <div>
                  <label htmlFor="ckout-invitePhone" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--navy, #1A1A2E)', marginBottom: '0.5rem' }}>Téléphone (optionnel)</label>
                  <input id="ckout-invitePhone" type="tel" autoComplete="tel" value={newInvitePhone} onChange={e => setNewInvitePhone(e.target.value)} placeholder="+33 6 XX XX XX XX" style={inputStyle}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--terra, #C75B39)'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(199, 91, 57, 0.1)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = '#E5E0D8'; e.currentTarget.style.boxShadow = 'none'; }} />
                </div>
                <button type="button" onClick={addInvite} style={{ ...btnTerra, width: '100%' }}>
                  Ajouter
                </button>
              </div>
            </div>

            {invites.length > 0 && (
              <div style={cardStyle}>
                <div style={{ padding: '1rem 1.5rem', borderBottom: '1.5px solid #E5E0D8' }}>
                  <h3 style={{ fontWeight: 600, color: 'var(--navy, #1A1A2E)' }}>Co-payeurs invités ({invites.length})</h3>
                </div>
                <div style={{ ...cardPadding, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {invites.map((invite, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', backgroundColor: 'var(--cream, #FAF7F2)', borderRadius: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', flex: 1, minWidth: 0 }}>
                        <Mail style={{ width: '1rem', height: '1rem', color: '#9CA3AF', flexShrink: 0, marginTop: '0.125rem' }} />
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--navy, #1A1A2E)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{invite.email}</p>
                          {invite.phone && (
                            <p style={{ fontSize: '0.75rem', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
                              <Phone style={{ width: '0.75rem', height: '0.75rem' }} />{invite.phone}
                            </p>
                          )}
                        </div>
                      </div>
                      <button type="button" onClick={() => removeInvite(invite.email)}
                        style={{ color: '#E63946', fontSize: '0.875rem', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem 0.5rem', borderRadius: '8px', transition: 'all 0.2s ease' }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FEF2F2'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}>
                        Retirer
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Étape 4: Vérification ── */}
        {currentStep === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
            <div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--navy, #1A1A2E)', marginBottom: '1rem' }}>Étape 4/5: Vérification</h2>
              <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '1.5rem' }}>Vérifiez les informations avant de procéder au paiement.</p>
            </div>
            <PriceSummary rooms={storeRooms} />

            <div style={{ ...cardStyle, borderColor: 'var(--gold, #D4A853)', backgroundColor: '#FDF6E8' }}>
              <div style={cardPadding}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={cgvAccepted} onChange={e => setCgvAccepted(e.target.checked)}
                    style={{ width: '1.25rem', height: '1.25rem', marginTop: '0.125rem', borderRadius: '4px', cursor: 'pointer', accentColor: 'var(--terra, #C75B39)' }} />
                  <div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--navy, #1A1A2E)', marginBottom: '0.25rem', fontWeight: 600 }}>
                      J&apos;accepte les conditions générales de vente
                    </p>
                    <p style={{ fontSize: '0.75rem', color: '#6B7280', lineHeight: 1.5 }}>
                      En confirmant, vous acceptez les CGV Eventy Life (Arrêté 1er mars 2018). Aucun droit de rétractation n&apos;est applicable car il s&apos;agit d&apos;une prestation à date déterminée.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* ── Étape 5: Confirmation ── */}
        {currentStep === 5 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--navy, #1A1A2E)', marginBottom: '0.5rem' }}>Étape 5/5: Confirmation</h2>

            {confirmationData ? (
              <>
                <div style={{ ...cardStyle, borderColor: '#86EFAC', backgroundColor: '#F0FDF4' }}>
                  <div style={{ ...cardPadding, textAlign: 'center' }}>
                    <div style={{ width: '3rem', height: '3rem', backgroundColor: '#16A34A', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem', fontSize: '1.25rem', fontWeight: 700 }}>✓</div>
                    <p style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--navy, #1A1A2E)' }}>Réservation en cours</p>
                    <span style={{ display: 'inline-block', marginTop: '0.75rem', fontSize: '0.75rem', fontWeight: 600, padding: '0.25rem 0.75rem', borderRadius: '9999px', backgroundColor: confirmationData.paymentStatus === 'CONFIRMED' ? '#16A34A' : '#FDF6E8', color: confirmationData.paymentStatus === 'CONFIRMED' ? 'white' : 'var(--navy, #1A1A2E)' }}>
                      Statut: {confirmationData.paymentStatus}
                    </span>
                  </div>
                </div>

                {holdExpiresAt && (
                  <div style={cardStyle}>
                    <div style={{ ...cardPadding, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--navy, #1A1A2E)', fontWeight: 600 }}>Expiration du hold:</span>
                      <HoldTimer expiresAt={holdExpiresAt} />
                    </div>
                  </div>
                )}

                {confirmationData.progressPercent !== undefined && (
                  <div style={cardStyle}>
                    <div style={cardPadding}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--navy, #1A1A2E)' }}>Paiement</span>
                        <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>{confirmationData.progressPercent}%</span>
                      </div>
                      <div style={{ height: '0.5rem', backgroundColor: '#E5E0D8', borderRadius: '9999px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', backgroundColor: 'var(--terra, #C75B39)', transition: 'width 0.3s ease', width: `${confirmationData.progressPercent}%`, borderRadius: '9999px' }} />
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : null}
          </div>
        )}

        {/* ── Navigation buttons ── */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
          {currentStep > 1 && (
            <button type="button" onClick={prevStep} style={{ ...btnOutline, flex: 1 }}>
              Précédent
            </button>
          )}
          {currentStep < 4 && (
            <button type="button"
              onClick={() => { currentStep === 1 ? startCheckoutSession() : nextStep(); }}
              style={{ ...btnTerra, flex: 1 }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#D97B5E'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--terra, #C75B39)'; }}>
              Suivant <ChevronRight style={{ width: '1rem', height: '1rem' }} />
            </button>
          )}
          {currentStep === 4 && (
            <button type="button" onClick={proceedToStripe} disabled={!cgvAccepted}
              style={{ ...btnTerra, flex: 1, backgroundColor: cgvAccepted ? '#16A34A' : '#D1D5DB', cursor: cgvAccepted ? 'pointer' : 'not-allowed' }}
              onMouseEnter={(e) => { if (cgvAccepted) e.currentTarget.style.backgroundColor = '#15803D'; }}
              onMouseLeave={(e) => { if (cgvAccepted) e.currentTarget.style.backgroundColor = '#16A34A'; }}>
              Passer au paiement
            </button>
          )}
          {currentStep === 5 && (
            <button type="button" onClick={() => router.push(ROUTES.VOYAGES)}
              style={{ ...btnTerra, flex: 1 }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#D97B5E'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--terra, #C75B39)'; }}>
              Retour aux voyages
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
