import { create } from 'zustand';
import { extractErrorMessage } from '@/lib/api-error';

interface Campaign {
  id: string;
  title: string;
  description?: string;
  targetAudience?: string;
  budgetCents: number;
  status: string;
  startDate?: string;
  endDate?: string;
  metrics?: {
    impressions: number;
    clicks: number;
    conversions: number;
    ctr: number;
    conversionRate: number;
    roi: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface CampaignFormData {
  title: string;
  description?: string;
  targetAudience?: string;
  budgetCents: number;
  startDate?: string;
  endDate?: string;
}

interface MarketingState {
  // État
  campaigns: Campaign[];
  selectedCampaign: Campaign | null;
  loading: boolean;
  error: string | null;
  dashboardData?: {
    activeCampaigns: number;
    totalBudgetCents: number;
    spentCents: number;
    averageRoi: number;
    topCampaign?: Campaign;
  };

  // Actions
  setCampaigns: (campaigns: Campaign[]) => void;
  setSelectedCampaign: (campaign: Campaign | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Opérations
  fetchDashboard: () => Promise<void>;
  fetchCampaigns: () => Promise<void>;
  fetchCampaignDetail: (campaignId: string) => Promise<void>;
  createCampaign: (data: CampaignFormData) => Promise<Campaign>;
  updateCampaign: (campaignId: string, data: Partial<CampaignFormData>) => Promise<Campaign>;
  launchCampaign: (campaignId: string) => Promise<void>;
  pauseCampaign: (campaignId: string) => Promise<void>;
  resumeCampaign: (campaignId: string) => Promise<void>;
  endCampaign: (campaignId: string) => Promise<void>;
  duplicateCampaign: (campaignId: string) => Promise<Campaign>;
  scheduleCampaign: (campaignId: string, startDate: string) => Promise<void>;

  // Clearing
  clear: () => void;
}

/**
 * Store Zustand pour la gestion des campagnes marketing
 */
export const useMarketingStore = create<MarketingState>((set, get) => (
  {
    // État initial
    campaigns: [],
    selectedCampaign: null,
    loading: false,
    error: null,
    dashboardData: undefined,

    // Setters
    setCampaigns: (campaigns) => set({ campaigns }),
    setSelectedCampaign: (campaign) => set({ selectedCampaign: campaign }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),

    // Opérations
    fetchDashboard: async () => {
      try {
        set({ loading: true, error: null });
        const res = await fetch('/api/marketing/dashboard', { credentials: 'include' });
        if (!res.ok) throw new Error('Erreur lors du chargement du tableau de bord');
        const data = await res.json();
        set({ dashboardData: data, loading: false });
      } catch (err: unknown) {
        const message = extractErrorMessage(err, 'Erreur lors du chargement du tableau de bord');
        set({ error: message, loading: false });
      }
    },

    fetchCampaigns: async () => {
      try {
        set({ loading: true, error: null });
        const res = await fetch('/api/marketing', { credentials: 'include' });
        if (!res.ok) throw new Error('Erreur lors du chargement des campagnes');
        const data = await res.json();
        set({ campaigns: data, loading: false });
      } catch (err: unknown) {
        const message = extractErrorMessage(err, 'Erreur lors du chargement des campagnes');
        set({ error: message, loading: false });
      }
    },

    fetchCampaignDetail: async (campaignId: string) => {
      try {
        set({ loading: true, error: null });
        const res = await fetch(`/api/marketing/${campaignId}`, { credentials: 'include' });
        if (!res.ok) throw new Error('Campagne non trouvée');
        const data = await res.json();
        set({ selectedCampaign: data, loading: false });
      } catch (err: unknown) {
        const message = extractErrorMessage(err, 'Campagne non trouvée');
        set({ error: message, loading: false });
      }
    },

    createCampaign: async (data: CampaignFormData) => {
      try {
        set({ error: null });
        const res = await fetch('/api/marketing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Erreur lors de la création de la campagne');
        const campaign = await res.json();
        set((state) => ({
          campaigns: [...state.campaigns, campaign],
          selectedCampaign: campaign,
        }));
        return campaign;
      } catch (err: unknown) {
        const message = extractErrorMessage(err, 'Erreur inattendue');
        set({ error: message });
        throw err;
      }
    },

    updateCampaign: async (campaignId: string, data: Partial<CampaignFormData>) => {
      try {
        set({ error: null });
        const res = await fetch(`/api/marketing/${campaignId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Erreur lors de la mise à jour');
        const campaign = await res.json();
        set((state) => ({
          campaigns: state.campaigns.map((c) =>
            c.id === campaignId ? campaign : c
          ),
          selectedCampaign:
            state.selectedCampaign?.id === campaignId
              ? campaign
              : state.selectedCampaign,
        }));
        return campaign;
      } catch (err: unknown) {
        const message = extractErrorMessage(err, 'Erreur inattendue');
        set({ error: message });
        throw err;
      }
    },

    launchCampaign: async (campaignId: string) => {
      try {
        set({ error: null });
        const res = await fetch(`/api/marketing/${campaignId}/launch`, {
          method: 'POST',
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Erreur lors du lancement');
        const campaign = await res.json();
        set((state) => ({
          campaigns: state.campaigns.map((c) =>
            c.id === campaignId ? campaign : c
          ),
          selectedCampaign:
            state.selectedCampaign?.id === campaignId
              ? campaign
              : state.selectedCampaign,
        }));
      } catch (err: unknown) {
        const message = extractErrorMessage(err, 'Erreur inattendue');
        set({ error: message });
        throw err;
      }
    },

    pauseCampaign: async (campaignId: string) => {
      try {
        set({ error: null });
        const res = await fetch(`/api/marketing/${campaignId}/pause`, {
          method: 'POST',
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Erreur lors de la mise en pause');
        const campaign = await res.json();
        set((state) => ({
          campaigns: state.campaigns.map((c) =>
            c.id === campaignId ? campaign : c
          ),
          selectedCampaign:
            state.selectedCampaign?.id === campaignId
              ? campaign
              : state.selectedCampaign,
        }));
      } catch (err: unknown) {
        const message = extractErrorMessage(err, 'Erreur inattendue');
        set({ error: message });
        throw err;
      }
    },

    resumeCampaign: async (campaignId: string) => {
      try {
        set({ error: null });
        const res = await fetch(`/api/marketing/${campaignId}/resume`, {
          method: 'POST',
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Erreur lors de la reprise');
        const campaign = await res.json();
        set((state) => ({
          campaigns: state.campaigns.map((c) =>
            c.id === campaignId ? campaign : c
          ),
          selectedCampaign:
            state.selectedCampaign?.id === campaignId
              ? campaign
              : state.selectedCampaign,
        }));
      } catch (err: unknown) {
        const message = extractErrorMessage(err, 'Erreur inattendue');
        set({ error: message });
        throw err;
      }
    },

    endCampaign: async (campaignId: string) => {
      try {
        set({ error: null });
        const res = await fetch(`/api/marketing/${campaignId}/end`, {
          method: 'POST',
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Erreur lors de la fin de campagne');
        const campaign = await res.json();
        set((state) => ({
          campaigns: state.campaigns.map((c) =>
            c.id === campaignId ? campaign : c
          ),
          selectedCampaign:
            state.selectedCampaign?.id === campaignId
              ? campaign
              : state.selectedCampaign,
        }));
      } catch (err: unknown) {
        const message = extractErrorMessage(err, 'Erreur inattendue');
        set({ error: message });
        throw err;
      }
    },

    duplicateCampaign: async (campaignId: string) => {
      try {
        set({ error: null });
        const res = await fetch(`/api/marketing/${campaignId}/duplicate`, {
          method: 'POST',
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Erreur lors de la duplication');
        const campaign = await res.json();
        set((state) => ({
          campaigns: [...state.campaigns, campaign],
          selectedCampaign: campaign,
        }));
        return campaign;
      } catch (err: unknown) {
        const message = extractErrorMessage(err, 'Erreur inattendue');
        set({ error: message });
        throw err;
      }
    },

    scheduleCampaign: async (campaignId: string, startDate: string) => {
      try {
        set({ error: null });
        const res = await fetch(`/api/marketing/${campaignId}/schedule`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ startDate }),
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Erreur lors de la planification');
        const campaign = await res.json();
        set((state) => ({
          campaigns: state.campaigns.map((c) =>
            c.id === campaignId ? campaign : c
          ),
          selectedCampaign:
            state.selectedCampaign?.id === campaignId
              ? campaign
              : state.selectedCampaign,
        }));
      } catch (err: unknown) {
        const message = extractErrorMessage(err, 'Erreur inattendue');
        set({ error: message });
        throw err;
      }
    },

    clear: () => {
      set({
        campaigns: [],
        selectedCampaign: null,
        loading: false,
        error: null,
        dashboardData: undefined,
      });
    },
  }
));
