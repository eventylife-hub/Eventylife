import { create } from 'zustand';

/**
 * Store Zustand - Gestion de l'état post-vente
 * Gère les avis, rapports, factures, et bilan de voyage
 */

export interface Feedback {
  id: string;
  overallRating: number;
  transportRating: number;
  accommodationRating: number;
  organizationRating: number;
  guidanceRating: number;
  comment: string;
  submittedAt: string;
}

export interface FeedbackSummary {
  totalFeedbacks: number;
  averageRating: number;
  ratingDistribution: Record<string, number>;
}

export interface PostSaleDashboard {
  travel: {
    id: string;
    title: string;
    departureDate: string;
    returnDate: string;
    destination: string;
  };
  statistics: {
    totalRevenueCents: number;
    totalBookings: number;
    confirmedBookings: number;
    occupancyRate: number;
  };
  feedbacks: FeedbackSummary;
  actions: {
    canGenerateReport: boolean;
    canSendBilan: boolean;
    canArchive: boolean;
  };
}

interface PostSaleStoreState {
  // State
  dashboard: PostSaleDashboard | null;
  feedback: Feedback | null;
  feedbackSummary: FeedbackSummary | null;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;

  // Actions
  fetchDashboard: (travelId: string) => Promise<void>;
  submitFeedback: (
    travelId: string,
    feedbackData: Omit<Feedback, 'id' | 'submittedAt'>
  ) => Promise<void>;
  fetchFeedbackSummary: (travelId: string) => Promise<void>;
  downloadTravelReport: (travelId: string) => Promise<void>;
  downloadClientInvoice: (bookingGroupId: string) => Promise<void>;
  downloadProInvoice: (travelId: string) => Promise<void>;
  sendBilan: (travelId: string) => Promise<void>;
  archiveTravel: (travelId: string) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

export const usePostSaleStore = create<PostSaleStoreState>(
  (set, get) => ({
    // State initial
    dashboard: null,
    feedback: null,
    feedbackSummary: null,
    isLoading: false,
    isSubmitting: false,
    error: null,

    // Fetch le dashboard post-vente
    fetchDashboard: async (travelId: string) => {
      set({ isLoading: true, error: null });
      try {
        const response = await fetch(
          `/api/post-sale/travel/${travelId}/dashboard`,
          { credentials: 'include' }
        );
        if (!response.ok) throw new Error('Erreur lors du chargement');

        const data = await response.json();
        set({ dashboard: data.data });
      } catch (error) {
        set({
          error:
            error instanceof Error ? error.message : 'Erreur inconnue',
        });
      } finally {
        set({ isLoading: false });
      }
    },

    // Soumettre un avis
    submitFeedback: async (travelId: string, feedbackData) => {
      set({ isSubmitting: true, error: null });
      try {
        const response = await fetch(
          `/api/post-sale/travel/${travelId}/feedback`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(feedbackData),
            credentials: 'include',
          }
        );

        if (!response.ok) throw new Error('Erreur lors de l\'envoi');

        const data = await response.json();
        set({ feedback: data.data });
      } catch (error) {
        set({
          error:
            error instanceof Error ? error.message : 'Erreur inconnue',
        });
        throw error;
      } finally {
        set({ isSubmitting: false });
      }
    },

    // Fetch le résumé des avis
    fetchFeedbackSummary: async (travelId: string) => {
      set({ isLoading: true, error: null });
      try {
        const response = await fetch(
          `/api/post-sale/travel/${travelId}/feedback-summary`,
          { credentials: 'include' }
        );
        if (!response.ok) throw new Error('Erreur lors du chargement');

        const data = await response.json();
        set({ feedbackSummary: data.data });
      } catch (error) {
        set({
          error:
            error instanceof Error ? error.message : 'Erreur inconnue',
        });
      } finally {
        set({ isLoading: false });
      }
    },

    // Télécharger le rapport de voyage
    downloadTravelReport: async (travelId: string) => {
      set({ isLoading: true, error: null });
      try {
        const response = await fetch(
          `/api/post-sale/travel/${travelId}/report`,
          { credentials: 'include' }
        );

        if (!response.ok) throw new Error('Erreur du téléchargement');

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `rapport-voyage-${travelId.substring(0, 8)}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
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

    // Télécharger la facture client
    downloadClientInvoice: async (bookingGroupId: string) => {
      set({ isLoading: true, error: null });
      try {
        const response = await fetch(
          `/api/post-sale/booking/${bookingGroupId}/invoice`,
          { credentials: 'include' }
        );

        if (!response.ok) throw new Error('Erreur du téléchargement');

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `facture-${bookingGroupId.substring(0, 8)}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
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

    // Télécharger la facture commission
    downloadProInvoice: async (travelId: string) => {
      set({ isLoading: true, error: null });
      try {
        const response = await fetch(
          `/api/post-sale/travel/${travelId}/pro-invoice`,
          { credentials: 'include' }
        );

        if (!response.ok) throw new Error('Erreur du téléchargement');

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `facture-commission-${travelId.substring(0, 8)}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
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

    // Envoyer le bilan
    sendBilan: async (travelId: string) => {
      set({ isSubmitting: true, error: null });
      try {
        const response = await fetch(
          `/api/post-sale/travel/${travelId}/send-bilan`,
          {
            method: 'POST',
            credentials: 'include',
          }
        );

        if (!response.ok) throw new Error('Erreur lors de l\'envoi');
      } catch (error) {
        set({
          error:
            error instanceof Error ? error.message : 'Erreur inconnue',
        });
        throw error;
      } finally {
        set({ isSubmitting: false });
      }
    },

    // Archiver le voyage
    archiveTravel: async (travelId: string) => {
      set({ isSubmitting: true, error: null });
      try {
        const response = await fetch(
          `/api/post-sale/travel/${travelId}/archive`,
          {
            method: 'POST',
            credentials: 'include',
          }
        );

        if (!response.ok) throw new Error('Erreur lors de l\'archivage');

        // Rafraîchir le dashboard
        await get().fetchDashboard(travelId);
      } catch (error) {
        set({
          error:
            error instanceof Error ? error.message : 'Erreur inconnue',
        });
        throw error;
      } finally {
        set({ isSubmitting: false });
      }
    },

    // Effacer l'erreur
    clearError: () => set({ error: null }),

    // Réinitialiser le store
    reset: () => {
      set({
        dashboard: null,
        feedback: null,
        feedbackSummary: null,
        isLoading: false,
        isSubmitting: false,
        error: null,
      });
    },
  })
);
