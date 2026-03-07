import { create } from 'zustand';

/**
 * Store Transport (Zustand)
 *
 * État global:
 * - Config transport (mode, compagnie, prix)
 * - Arrêts et sélections
 * - Manifest passagers
 */

// Interface pour un arrêt de transport
interface TransportStop {
  id: string;
  name: string;
  location: string;
  time?: string;
  [key: string]: unknown;
}

// Interface pour un passager dans le manifest
interface ManifestPassenger {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  [key: string]: unknown;
}

interface TransportState {
  departureMode: string;
  busCompany: string;
  busCapacity: number;
  busPriceCents: number;
  flightCompany: string;
  flightPriceCents: number;
  meetingPoint: string;
  meetingTime: string;
  stops: TransportStop[];
  manifest: ManifestPassenger[];

  // Actions
  setDepartureMode: (mode: string) => void;
  setBusCompany: (company: string) => void;
  setBusCapacity: (capacity: number) => void;
  setBusPriceCents: (price: number) => void;
  setFlightCompany: (company: string) => void;
  setFlightPriceCents: (price: number) => void;
  setMeetingPoint: (point: string) => void;
  setMeetingTime: (time: string) => void;
  setStops: (stops: TransportStop[]) => void;
  setManifest: (manifest: ManifestPassenger[]) => void;
  reset: () => void;
}

export const useTransportStore = create<TransportState>((set) => ({
  // État initial
  departureMode: 'BUS',
  busCompany: '',
  busCapacity: 0,
  busPriceCents: 0,
  flightCompany: '',
  flightPriceCents: 0,
  meetingPoint: '',
  meetingTime: '',
  stops: [],
  manifest: [],

  // Actions
  setDepartureMode: (mode) => set({ departureMode: mode }),
  setBusCompany: (company) => set({ busCompany: company }),
  setBusCapacity: (capacity) => set({ busCapacity: capacity }),
  setBusPriceCents: (price) => set({ busPriceCents: price }),
  setFlightCompany: (company) => set({ flightCompany: company }),
  setFlightPriceCents: (price) => set({ flightPriceCents: price }),
  setMeetingPoint: (point) => set({ meetingPoint: point }),
  setMeetingTime: (time) => set({ meetingTime: time }),
  setStops: (stops) => set({ stops }),
  setManifest: (manifest) => set({ manifest }),
  reset: () =>
    set({
      departureMode: 'BUS',
      busCompany: '',
      busCapacity: 0,
      busPriceCents: 0,
      flightCompany: '',
      flightPriceCents: 0,
      meetingPoint: '',
      meetingTime: '',
      stops: [],
      manifest: [],
    }),
}));
