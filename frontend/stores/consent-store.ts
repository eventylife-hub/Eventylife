import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ConsentType = 'accepted' | 'refused' | 'custom' | null;

interface ConsentStore {
  consent: ConsentType;
  setConsent: (consent: ConsentType) => void;
  resetConsent: () => void;
}

export const useConsentStore = create<ConsentStore>()(
  persist(
    (set) => ({
      consent: null,
      setConsent: (consent) => set({ consent }),
      resetConsent: () => set({ consent: null }),
    }),
    {
      name: 'cookie_consent',
      storage: {
        getItem: (key) => {
          if (typeof window === 'undefined') return null;
          const item = localStorage.getItem(key);
          return item ? JSON.parse(item) : null;
        },
        setItem: (key, value) => {
          if (typeof window !== 'undefined') {
            localStorage.setItem(key, JSON.stringify(value));
          }
        },
        removeItem: (key) => {
          if (typeof window !== 'undefined') {
            localStorage.removeItem(key);
          }
        },
      },
    }
  )
);
