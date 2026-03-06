import type { ProProfile, Travel, BusStop } from '@/lib/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Statut de l'onboarding Pro
 */
export interface OnboardingStatus {
  step1_profile: boolean;
  step2_legal: boolean;
  step3_payout: boolean;
  step4_documents: boolean;
  step5_contracts: boolean;
  step6_formation: boolean;
  currentStatus: string;
  completedAt?: string;
}

/**
 * Module de formation
 */
export interface FormationModule {
  id: string;
  title: string;
  description: string;
  duration: number;
  icon: string;
}

/**
 * Filtres pour les voyages
 */
export interface TravelFilters {
  status?: string[];
  search?: string;
}

/**
 * Filtres pour les arrêts de bus
 */
export interface BusStopFilters {
  type?: string;
  status?: string;
}

/**
 * Team member
 */
export interface TeamMember {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
}

/**
 * Financial data
 */
export interface FinancialData {
  totalRevenue: number;
  totalCosts: number;
  totalMargin: number;
  marginPercent: number;
}

/**
 * Marketing campaign
 */
export interface MarketingCampaign {
  id: string;
  name: string;
  budget: number;
  spent: number;
  status: string;
}

interface ProStore {
  // State
  proProfile: ProProfile | null;
  onboardingStatus: OnboardingStatus | null;
  travels: Travel[];
  busStops: BusStop[];
  formationModules: FormationModule[];
  formationProgress: {
    completedModules: string[];
    percentage: number;
  };
  team: TeamMember[];
  financials: FinancialData | null;
  marketingCampaigns: MarketingCampaign[];
  loading: boolean;
  error: string | null;

  // Actions
  setProProfile: (profile: ProProfile | null) => void;
  setOnboardingStatus: (status: OnboardingStatus | null) => void;
  setTravels: (travels: Travel[]) => void;
  setBusStops: (stops: BusStop[]) => void;
  setFormationModules: (modules: FormationModule[]) => void;
  setFormationProgress: (progress: { completedModules: string[]; percentage: number }) => void;
  setTeam: (team: TeamMember[]) => void;
  setFinancials: (financials: FinancialData | null) => void;
  setMarketingCampaigns: (campaigns: MarketingCampaign[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // API Actions
  fetchProProfile: () => Promise<void>;
  fetchOnboardingStatus: () => Promise<void>;
  fetchTravels: (filters?: TravelFilters) => Promise<void>;
  fetchBusStops: (filters?: BusStopFilters) => Promise<void>;
  fetchFormationModules: () => Promise<void>;
  fetchFormationProgress: () => Promise<void>;
  fetchTeam: () => Promise<void>;
  fetchFinancials: () => Promise<void>;
  fetchMarketingCampaigns: () => Promise<void>;

  // Helpers
  isOnboardingComplete: () => boolean;
  getAllStepsComplete: () => boolean;
  reset: () => void;
}

export const useProStore = create<ProStore>()(
  persist(
    (set, get) => ({
      // Initial State
      proProfile: null,
      onboardingStatus: null,
      travels: [],
      busStops: [],
      formationModules: [],
      formationProgress: {
        completedModules: [],
        percentage: 0,
      },
      team: [],
      financials: null,
      marketingCampaigns: [],
      loading: false,
      error: null,

      // Simple Setters
      setProProfile: (profile) => set({ proProfile: profile }),
      setOnboardingStatus: (status) => set({ onboardingStatus: status }),
      setTravels: (travels) => set({ travels }),
      setBusStops: (stops) => set({ busStops: stops }),
      setFormationModules: (modules) => set({ formationModules: modules }),
      setFormationProgress: (progress) => set({ formationProgress: progress }),
      setTeam: (team) => set({ team }),
      setFinancials: (financials) => set({ financials }),
      setMarketingCampaigns: (campaigns) => set({ marketingCampaigns: campaigns }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),

      // API Actions
      fetchProProfile: async () => {
        set({ loading: true, error: null });
        try {
          const response = await fetch('/api/pro/profile', { credentials: 'include' });
          const data = await response.json();
          set({ proProfile: data });
        } catch (error) {
          set({ error: (error as Error).message });
        } finally {
          set({ loading: false });
        }
      },

      fetchOnboardingStatus: async () => {
        set({ loading: true, error: null });
        try {
          const response = await fetch('/api/pro/onboarding/status', { credentials: 'include' });
          const data = await response.json();
          set({ onboardingStatus: data });
        } catch (error) {
          set({ error: (error as Error).message });
        } finally {
          set({ loading: false });
        }
      },

      fetchTravels: async (filters?: TravelFilters) => {
        set({ loading: true, error: null });
        try {
          const params = new URLSearchParams();
          if (filters?.status) {
            params.append('status', filters.status.join(','));
          }
          if (filters?.search) {
            params.append('search', filters.search);
          }

          const response = await fetch(`/api/pro/travels?${params.toString()}`, { credentials: 'include' });
          const data = await response.json();
          // Récupère les données de voyage avec fallback à un tableau vide
          set({ travels: (data as Record<string, unknown>).data as Travel[] || [] });
        } catch (error) {
          set({ error: (error as Error).message });
        } finally {
          set({ loading: false });
        }
      },

      fetchBusStops: async (filters?: BusStopFilters) => {
        set({ loading: true, error: null });
        try {
          const params = new URLSearchParams();
          if (filters?.type) {
            params.append('type', filters.type);
          }
          if (filters?.status) {
            params.append('status', filters.status);
          }

          const response = await fetch(`/api/pro/bus-stops?${params.toString()}`, { credentials: 'include' });
          const data = await response.json();
          // Récupère les données d'arrêts de bus avec fallback à un tableau vide
          set({ busStops: (data as Record<string, unknown>).data as BusStop[] || [] });
        } catch (error) {
          set({ error: (error as Error).message });
        } finally {
          set({ loading: false });
        }
      },

      fetchFormationModules: async () => {
        set({ loading: true, error: null });
        try {
          const response = await fetch('/api/pro/formation/modules', { credentials: 'include' });
          const data = await response.json();
          // Récupère les modules de formation depuis la réponse API
          set({ formationModules: (data as FormationModule[]) || [] });
        } catch (error) {
          set({ error: (error as Error).message });
        } finally {
          set({ loading: false });
        }
      },

      fetchFormationProgress: async () => {
        set({ loading: true, error: null });
        try {
          const response = await fetch('/api/pro/formation/progress', { credentials: 'include' });
          const data = await response.json();
          // Récupère la progression de formation avec fallback aux valeurs par défaut
          const typedData = data as Record<string, unknown>;
          set({
            formationProgress: {
              completedModules: (typedData.completedModules as string[]) || [],
              percentage: (typedData.percentage as number) || 0,
            },
          });
        } catch (error) {
          set({ error: (error as Error).message });
        } finally {
          set({ loading: false });
        }
      },

      fetchTeam: async () => {
        set({ loading: true, error: null });
        try {
          const response = await fetch('/api/pro/team', { credentials: 'include' });
          const data = await response.json();
          set({ team: (data as TeamMember[]) || [] });
        } catch (error) {
          set({ error: (error as Error).message });
        } finally {
          set({ loading: false });
        }
      },

      fetchFinancials: async () => {
        set({ loading: true, error: null });
        try {
          const response = await fetch('/api/pro/financials', { credentials: 'include' });
          const data = await response.json();
          set({ financials: data as FinancialData });
        } catch (error) {
          set({ error: (error as Error).message });
        } finally {
          set({ loading: false });
        }
      },

      fetchMarketingCampaigns: async () => {
        set({ loading: true, error: null });
        try {
          const response = await fetch('/api/pro/marketing/campaigns', { credentials: 'include' });
          const data = await response.json();
          set({ marketingCampaigns: (data as MarketingCampaign[]) || [] });
        } catch (error) {
          set({ error: (error as Error).message });
        } finally {
          set({ loading: false });
        }
      },

      // Helpers
      isOnboardingComplete: () => {
        const { onboardingStatus } = get();
        if (!onboardingStatus) return false;
        return (
          onboardingStatus.step1_profile &&
          onboardingStatus.step2_legal &&
          onboardingStatus.step3_payout &&
          onboardingStatus.step4_documents &&
          onboardingStatus.step5_contracts &&
          onboardingStatus.step6_formation
        );
      },

      getAllStepsComplete: () => {
        const { onboardingStatus } = get();
        if (!onboardingStatus) return false;
        return (
          onboardingStatus.step1_profile &&
          onboardingStatus.step2_legal &&
          onboardingStatus.step3_payout &&
          onboardingStatus.step4_documents &&
          onboardingStatus.step5_contracts &&
          onboardingStatus.step6_formation
        );
      },

      reset: () => {
        set({
          proProfile: null,
          onboardingStatus: null,
          travels: [],
          busStops: [],
          formationModules: [],
          formationProgress: {
            completedModules: [],
            percentage: 0,
          },
          team: [],
          financials: null,
          marketingCampaigns: [],
          loading: false,
          error: null,
        });
      },
    }),
    {
      name: 'pro-store',
    },
  ),
);
