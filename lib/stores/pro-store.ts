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
          if (!response.ok) throw new Error('Erreur profil');
          const data = await response.json();
          set({ proProfile: data });
        } catch {
          console.warn('API pro/profile indisponible — données démo');
          set({
            proProfile: {
              id: 'pro_demo_001',
              companyName: 'Voyages du Soleil',
              firstName: 'Jean',
              lastName: 'Dupont',
              email: 'jean.dupont@voyages-soleil.fr',
              phone: '+33 6 12 34 56 78',
              status: 'ACTIVE',
            } as ProProfile,
            error: null,
          });
        } finally {
          set({ loading: false });
        }
      },

      fetchOnboardingStatus: async () => {
        set({ loading: true, error: null });
        try {
          const response = await fetch('/api/pro/onboarding/status', { credentials: 'include' });
          if (!response.ok) throw new Error('Erreur onboarding');
          const data = await response.json();
          set({ onboardingStatus: data });
        } catch {
          console.warn('API pro/onboarding indisponible — données démo');
          set({
            onboardingStatus: {
              step1_profile: true,
              step2_legal: true,
              step3_payout: true,
              step4_documents: true,
              step5_contracts: true,
              step6_formation: false,
              currentStatus: 'IN_PROGRESS',
            },
            error: null,
          });
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
          if (!response.ok) throw new Error('Erreur voyages');
          const data = await response.json();
          set({ travels: (data as Record<string, unknown>).data as Travel[] || [] });
        } catch {
          console.warn('API pro/travels indisponible — données démo');
          set({
            travels: [
              { id: '1', slug: 'marrakech-express', title: 'Marrakech Express', destination: 'Marrakech, Maroc', startDate: '2026-05-15', endDate: '2026-05-22', pricePerPerson: 89900, image: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=600&h=400&fit=crop', rating: 4.8, reviews: 124, daysCount: 7, capacity: 50, bookings: 38, status: 'SALES_OPEN', transport: 'BUS', pickupCity: 'Bordeaux' },
              { id: '3', slug: 'barcelone-gaudi', title: 'Barcelone & Gaudí', destination: 'Barcelone, Espagne', startDate: '2026-06-20', endDate: '2026-06-25', pricePerPerson: 69900, image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600&h=400&fit=crop', rating: 4.9, reviews: 156, daysCount: 5, capacity: 50, bookings: 44, status: 'SALES_OPEN', transport: 'BUS', pickupCity: 'Toulouse' },
              { id: '5', slug: 'istanbul-bosphore', title: 'Istanbul & le Bosphore', destination: 'Istanbul, Turquie', startDate: '2026-07-18', endDate: '2026-07-25', pricePerPerson: 94900, image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600&h=400&fit=crop', rating: 4.8, reviews: 98, daysCount: 7, capacity: 45, bookings: 36, status: 'SALES_OPEN', transport: 'AVION', pickupCity: 'Marseille' },
            ] as Travel[],
            error: null,
          });
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
          if (!response.ok) throw new Error('Erreur arrêts');
          const data = await response.json();
          set({ busStops: (data as Record<string, unknown>).data as BusStop[] || [] });
        } catch {
          console.warn('API pro/bus-stops indisponible — données démo');
          set({
            busStops: [
              { id: 'bs_001', name: 'Gare Saint-Jean', city: 'Bordeaux', address: '1 Rue Charles Domercq, 33800 Bordeaux', lat: 44.8256, lng: -0.5561, type: 'DEPARTURE', status: 'ACTIVE' },
              { id: 'bs_002', name: 'Gare Matabiau', city: 'Toulouse', address: '64 Bd Pierre Semard, 31500 Toulouse', lat: 43.6115, lng: 1.4538, type: 'DEPARTURE', status: 'ACTIVE' },
              { id: 'bs_003', name: 'Gare Part-Dieu', city: 'Lyon', address: '5 Pl. Charles Béraudier, 69003 Lyon', lat: 45.7602, lng: 4.8596, type: 'DEPARTURE', status: 'ACTIVE' },
            ] as BusStop[],
            error: null,
          });
        } finally {
          set({ loading: false });
        }
      },

      fetchFormationModules: async () => {
        set({ loading: true, error: null });
        try {
          const response = await fetch('/api/pro/formation/modules', { credentials: 'include' });
          if (!response.ok) throw new Error('Erreur formation');
          const data = await response.json();
          set({ formationModules: (data as FormationModule[]) || [] });
        } catch {
          console.warn('API pro/formation indisponible — données démo');
          set({
            formationModules: [
              { id: 'mod_001', title: 'Bases du voyage de groupe', description: 'Les fondamentaux pour organiser un voyage de groupe réussi', duration: 45, icon: '🎓' },
              { id: 'mod_002', title: 'Gestion des réservations', description: 'Maîtriser le processus de réservation de A à Z', duration: 30, icon: '📋' },
              { id: 'mod_003', title: 'Accompagnement client', description: 'Techniques d\'accompagnement porte-à-porte', duration: 60, icon: '🤝' },
              { id: 'mod_004', title: 'Obligations légales', description: 'Conformité RGPD, CGV et réglementation tourisme', duration: 40, icon: '⚖️' },
            ],
            error: null,
          });
        } finally {
          set({ loading: false });
        }
      },

      fetchFormationProgress: async () => {
        set({ loading: true, error: null });
        try {
          const response = await fetch('/api/pro/formation/progress', { credentials: 'include' });
          if (!response.ok) throw new Error('Erreur progression');
          const data = await response.json();
          const typedData = data as Record<string, unknown>;
          set({
            formationProgress: {
              completedModules: (typedData.completedModules as string[]) || [],
              percentage: (typedData.percentage as number) || 0,
            },
          });
        } catch {
          console.warn('API pro/formation/progress indisponible — données démo');
          set({
            formationProgress: {
              completedModules: ['mod_001', 'mod_002'],
              percentage: 50,
            },
            error: null,
          });
        } finally {
          set({ loading: false });
        }
      },

      fetchTeam: async () => {
        set({ loading: true, error: null });
        try {
          const response = await fetch('/api/pro/team', { credentials: 'include' });
          if (!response.ok) throw new Error('Erreur équipe');
          const data = await response.json();
          set({ team: (data as TeamMember[]) || [] });
        } catch {
          console.warn('API pro/team indisponible — données démo');
          set({
            team: [
              { id: 'tm_001', email: 'jean.dupont@voyages-soleil.fr', name: 'Jean Dupont', role: 'OWNER', createdAt: '2025-09-01T10:00:00Z' },
              { id: 'tm_002', email: 'marie.martin@voyages-soleil.fr', name: 'Marie Martin', role: 'MANAGER', createdAt: '2025-10-15T14:00:00Z' },
              { id: 'tm_003', email: 'paul.bernard@voyages-soleil.fr', name: 'Paul Bernard', role: 'AGENT', createdAt: '2026-01-05T09:00:00Z' },
            ],
            error: null,
          });
        } finally {
          set({ loading: false });
        }
      },

      fetchFinancials: async () => {
        set({ loading: true, error: null });
        try {
          const response = await fetch('/api/pro/financials', { credentials: 'include' });
          if (!response.ok) throw new Error('Erreur financials');
          const data = await response.json();
          set({ financials: data as FinancialData });
        } catch {
          console.warn('API pro/financials indisponible — données démo');
          set({
            financials: {
              totalRevenue: 9908200,
              totalCosts: 7926560,
              totalMargin: 1981640,
              marginPercent: 20,
            },
            error: null,
          });
        } finally {
          set({ loading: false });
        }
      },

      fetchMarketingCampaigns: async () => {
        set({ loading: true, error: null });
        try {
          const response = await fetch('/api/pro/marketing/campaigns', { credentials: 'include' });
          if (!response.ok) throw new Error('Erreur campagnes');
          const data = await response.json();
          set({ marketingCampaigns: (data as MarketingCampaign[]) || [] });
        } catch {
          console.warn('API pro/marketing indisponible — données démo');
          set({
            marketingCampaigns: [
              { id: 'camp_001', name: 'Lancement Été 2026', budget: 250000, spent: 125000, status: 'ACTIVE' },
              { id: 'camp_002', name: 'Promo Early Bird', budget: 100000, spent: 98000, status: 'COMPLETED' },
              { id: 'camp_003', name: 'Parrainage Automne', budget: 150000, spent: 0, status: 'PLANNED' },
            ],
            error: null,
          });
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
