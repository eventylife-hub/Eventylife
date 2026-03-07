import type { Travel } from '@/lib/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Zustand store pour le checkout
 * Persiste les données du checkout localement
 *
 * Gère:
 * - État du booking group
 * - Sélection des chambres
 * - Infos des participants
 * - Statut du paiement
 * - Étape courante du checkout
 */

/**
 * Représente une chambre dans le checkout
 */
export interface Room {
  roomTypeId: string;
  label: string;
  capacity: number;
  occupancyCount: number;
  priceTotalTTC: number;
  perPersonTTC: number;
  roundingRemainder: number;
}

/**
 * Représente un participant dans le checkout
 */
export interface Participant {
  roomBookingId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  busStopId?: string;
  insuranceSelected: boolean;
  insuranceAmountPerPersonTTC?: number;
}

interface CheckoutStore {
  // État
  bookingGroupId: string | null;
  selectedTravel: Travel | null;
  rooms: Room[];
  participants: Participant[];
  paymentStatus: 'pending' | 'succeeded' | 'failed' | null;
  holdExpiresAt: Date | null;
  currentStep: number; // 1-4

  // Actions
  setBookingGroupId: (id: string) => void;
  setTravel: (travel: Travel) => void;
  setRooms: (rooms: Room[]) => void;
  setParticipants: (participants: Participant[]) => void;
  setPaymentStatus: (status: 'pending' | 'succeeded' | 'failed') => void;
  setHoldExpiresAt: (date: Date) => void;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;

  // Computed
  totalAmountTTC: number;
}

const initialState = {
  bookingGroupId: null,
  selectedTravel: null,
  rooms: [],
  participants: [],
  paymentStatus: null,
  holdExpiresAt: null,
  currentStep: 1,
};

export const useCheckoutStore = create<CheckoutStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setBookingGroupId: (id: string) => set({ bookingGroupId: id }),
      setTravel: (travel: Travel) => set({ selectedTravel: travel }),
      setRooms: (rooms: Room[]) => set({ rooms }),
      setParticipants: (participants: Participant[]) =>
        set({ participants }),
      setPaymentStatus: (
        status: 'pending' | 'succeeded' | 'failed',
      ) => set({ paymentStatus: status }),
      setHoldExpiresAt: (date: Date) => set({ holdExpiresAt: date }),
      setCurrentStep: (step: number) => set({ currentStep: step }),

      nextStep: () =>
        set((state) => ({
          currentStep: Math.min(state.currentStep + 1, 4),
        })),

      prevStep: () =>
        set((state) => ({
          currentStep: Math.max(state.currentStep - 1, 1),
        })),

      reset: () => set(initialState),

      get totalAmountTTC() {
        return get().rooms.reduce((sum, room) => sum + room.priceTotalTTC, 0);
      },
    }),
    {
      name: 'checkout-store',
      version: 1,
    },
  ),
);
