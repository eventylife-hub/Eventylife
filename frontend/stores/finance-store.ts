import { create } from 'zustand';

/**
 * Store Finance (Zustand)
 *
 * État global:
 * - CA TTC, Coûts TTC
 * - Marge (CA - Coûts)
 * - TVA Marge = Marge × 20/120 (INVARIANT 6)
 * - Coûts détaillés
 *
 * INVARIANT 3: Tous en centimes Int
 * INVARIANT 6: TVA_marge = (CA_TTC − coûts_TTC) × 20/120
 */

// Interface pour un élément de coût
interface CostItem {
  id: string;
  costAmountTTC: number;
  [key: string]: unknown;
}

interface FinanceState {
  caTTC: number;
  coutsTTC: number;
  marge: number;
  tvaMarge: number;
  costs: CostItem[];

  // Actions
  setCATTC: (amount: number) => void;
  setCoutsTTC: (amount: number) => void;
  setCosts: (costs: CostItem[]) => void;
  addCost: (cost: CostItem) => void;
  removeCost: (costId: string) => void;

  // Calculs
  computeMargin: () => void;
  computeTVAMargin: () => void;
  reset: () => void;
}

export const useFinanceStore = create<FinanceState>((set, get) => ({
  // État initial
  caTTC: 0,
  coutsTTC: 0,
  marge: 0,
  tvaMarge: 0,
  costs: [],

  // Actions
  setCATTC: (amount) => {
    set({ caTTC: amount });
    get().computeMargin();
    get().computeTVAMargin();
  },
  setCoutsTTC: (amount) => {
    set({ coutsTTC: amount });
    get().computeMargin();
    get().computeTVAMargin();
  },
  setCosts: (costs) => {
    set({ costs });
    const totalCosts = costs.reduce((sum, c) => sum + c.costAmountTTC, 0);
    set({ coutsTTC: totalCosts });
    get().computeMargin();
    get().computeTVAMargin();
  },
  addCost: (cost) => {
    const newCosts = [...get().costs, cost];
    get().setCosts(newCosts);
  },
  removeCost: (costId) => {
    const newCosts = get().costs.filter((c) => c.id !== costId);
    get().setCosts(newCosts);
  },

  // Calculs
  computeMargin: () => {
    const state = get();
    const marge = state.caTTC - state.coutsTTC;
    set({ marge });
  },
  computeTVAMargin: () => {
    const state = get();
    // INVARIANT 6: TVA_marge = Marge × 20/120
    const tvaMarge = Math.floor((state.marge * 20) / 120);
    set({ tvaMarge });
  },
  reset: () =>
    set({
      caTTC: 0,
      coutsTTC: 0,
      marge: 0,
      tvaMarge: 0,
      costs: [],
    }),
}));
