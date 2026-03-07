import { create } from 'zustand';

/**
 * Store Zustand - Gestion de l'état des annulations
 * Gère les demandes d'annulation, les calculs de remboursement, les statuts
 */

export interface Cancellation {
  id: string;
  bookingGroupId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'REFUNDED';
  reason: string;
  paidAmountCents: number;
  refundAmountCents: number;
  cancellationFeeCents: number;
  policyApplied: string;
  requestedAt: string;
  processedAt?: string;
  refundedAt?: string;
}

interface RefundCalculation {
  paidAmountCents: number;
  refundAmountCents: number;
  cancellationFeeCents: number;
  policyApplied: string;
  daysUntilDeparture: number;
}

interface CancellationStoreState {
  // State
  cancellations: Cancellation[];
  currentCancellation: Cancellation | null;
  refundCalc: RefundCalculation | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchCancellations: (filters?: {
    status?: string;
    offset?: number;
    limit?: number;
  }) => Promise<void>;
  fetchCancellation: (cancellationId: string) => Promise<void>;
  requestCancellation: (
    bookingGroupId: string,
    reason: string
  ) => Promise<void>;
  calculateRefund: (bookingGroupId: string) => Promise<RefundCalculation>;
  approveCancellation: (cancellationId: string) => Promise<void>;
  rejectCancellation: (
    cancellationId: string,
    rejectionReason: string
  ) => Promise<void>;
  processCancellationRefund: (cancellationId: string) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

export const useCancellationStore = create<CancellationStoreState>(
  (set, get) => ({
    // State initial
    cancellations: [],
    currentCancellation: null,
    refundCalc: null,
    isLoading: false,
    error: null,

    // Fetch liste des annulations
    fetchCancellations: async (filters) => {
      set({ isLoading: true, error: null });
      try {
        const params = new URLSearchParams();
        if (filters?.status) params.append('status', filters.status);
        if (filters?.offset) params.append('offset', filters.offset.toString());
        if (filters?.limit) params.append('limit', filters.limit.toString());

        const response = await fetch(
          `/api/admin/cancellations?${params.toString()}`,
          { credentials: 'include' }
        );
        if (!response.ok) throw new Error('Erreur lors du chargement');

        const data = await response.json();
        set({ cancellations: data.data || [] });
      } catch (error) {
        set({
          error:
            error instanceof Error ? error.message : 'Erreur inconnue',
        });
      } finally {
        set({ isLoading: false });
      }
    },

    // Fetch détail annulation
    fetchCancellation: async (cancellationId: string) => {
      set({ isLoading: true, error: null });
      try {
        const response = await fetch(`/api/cancellations/${cancellationId}`, { credentials: 'include' });
        if (!response.ok) throw new Error('Annulation non trouvée');

        const data = await response.json();
        set({
          currentCancellation: data.data,
          refundCalc: {
            paidAmountCents: data.data.paidAmountCents,
            refundAmountCents: data.data.refundAmountCents,
            cancellationFeeCents: data.data.cancellationFeeCents,
            policyApplied: data.data.policyApplied,
            daysUntilDeparture: data.data.daysUntilDeparture || 0,
          },
        });
      } catch (error) {
        set({
          error:
            error instanceof Error ? error.message : 'Erreur inconnue',
        });
      } finally {
        set({ isLoading: false });
      }
    },

    // Demander l'annulation (client)
    requestCancellation: async (bookingGroupId: string, reason: string) => {
      set({ isLoading: true, error: null });
      try {
        const response = await fetch(
          `/api/cancellations/booking/${bookingGroupId}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reason }),
            credentials: 'include',
          }
        );

        if (!response.ok) throw new Error('Erreur lors de la demande');

        const data = await response.json();
        set({ currentCancellation: data.data });
      } catch (error) {
        set({
          error:
            error instanceof Error ? error.message : 'Erreur inconnue',
        });
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },

    // Calculer le remboursement
    calculateRefund: async (bookingGroupId: string) => {
      set({ isLoading: true, error: null });
      try {
        const response = await fetch(
          `/api/cancellations/${bookingGroupId}/calculate-refund`,
          { credentials: 'include' }
        );
        if (!response.ok) throw new Error('Erreur du calcul');

        const data = await response.json();
        set({ refundCalc: data.data });
        return data.data;
      } catch (error) {
        set({
          error:
            error instanceof Error ? error.message : 'Erreur inconnue',
        });
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },

    // Approuver l'annulation (admin)
    approveCancellation: async (cancellationId: string) => {
      set({ isLoading: true, error: null });
      try {
        const response = await fetch(
          `/api/admin/cancellations/${cancellationId}/process`,
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ decision: 'APPROVED' }),
            credentials: 'include',
          }
        );

        if (!response.ok) throw new Error('Erreur lors de l\'approbation');

        const data = await response.json();
        set({ currentCancellation: data.data });
      } catch (error) {
        set({
          error:
            error instanceof Error ? error.message : 'Erreur inconnue',
        });
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },

    // Rejeter l'annulation (admin)
    rejectCancellation: async (
      cancellationId: string,
      rejectionReason: string
    ) => {
      set({ isLoading: true, error: null });
      try {
        const response = await fetch(
          `/api/admin/cancellations/${cancellationId}/process`,
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              decision: 'REJECTED',
              rejectionReason,
            }),
            credentials: 'include',
          }
        );

        if (!response.ok) throw new Error('Erreur lors du rejet');

        const data = await response.json();
        set({ currentCancellation: data.data });
      } catch (error) {
        set({
          error:
            error instanceof Error ? error.message : 'Erreur inconnue',
        });
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },

    // Traiter le remboursement (admin)
    processCancellationRefund: async (cancellationId: string) => {
      set({ isLoading: true, error: null });
      try {
        const response = await fetch(
          `/api/admin/cancellations/${cancellationId}/refund`,
          {
            method: 'POST',
            credentials: 'include',
          }
        );

        if (!response.ok) throw new Error('Erreur du remboursement');

        const data = await response.json();
        set({ currentCancellation: data.data });
      } catch (error) {
        set({
          error:
            error instanceof Error ? error.message : 'Erreur inconnue',
        });
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },

    // Effacer l'erreur
    clearError: () => set({ error: null }),

    // Réinitialiser le store
    reset: () => {
      set({
        cancellations: [],
        currentCancellation: null,
        refundCalc: null,
        isLoading: false,
        error: null,
      });
    },
  })
);
