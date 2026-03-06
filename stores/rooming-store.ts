import { create } from 'zustand';

/**
 * Store Rooming (Zustand)
 *
 * État global:
 * - Liste des chambres avec statut paiement
 * - Blocs hôtels avec statut confirmation
 * - Statistiques occupancy
 *
 * INVARIANT 1: pricingParts = occupancyCount
 * INVARIANT 5: Verrouillé post-paiement
 */

// Interface pour une chambre
interface Room {
  id: string;
  roomLabel?: string;
  occupancyCount?: number;
  pricingParts?: number;
  capacity?: number;
  [key: string]: string | number | undefined;
}

// Interface pour un bloc hôtel
interface HotelBlock {
  id: string;
  pricePerNightTTC?: number;
  checkInDate: string;
  checkOutDate: string;
  roomsConfirmed: number;
  [key: string]: string | number | undefined;
}

// Interface pour les statistiques d'occupancy
interface OccupancyStats {
  totalRooms: number;
  totalOccupants: number;
  occupancyRate: number;
  totalRevenueTTC: number;
}

// Interface pour les mises à jour de bloc hôtel
interface HotelBlockUpdates {
  [key: string]: string | number | undefined;
}

interface RoomingState {
  rooms: Room[];
  hotelBlocks: HotelBlock[];
  occupancyStats: OccupancyStats;

  // Actions
  setRooms: (rooms: Room[]) => void;
  setHotelBlocks: (blocks: HotelBlock[]) => void;
  assignRoom: (roomId: string, roomNumber: string) => void;
  updateHotelBlock: (blockId: string, updates: HotelBlockUpdates) => void;
  removeHotelBlock: (blockId: string) => void;

  // Calculs
  computeOccupancyStats: () => void;
  reset: () => void;
}

export const useRoomingStore = create<RoomingState>((set, get) => (
  {
    // État initial
    rooms: [],
    hotelBlocks: [],
    occupancyStats: {
      totalRooms: 0,
      totalOccupants: 0,
      occupancyRate: 0,
      totalRevenueTTC: 0,
    },

    // Actions
    setRooms: (rooms) => {
      set({ rooms });
      get().computeOccupancyStats();
    },
    setHotelBlocks: (blocks) => {
      set({ hotelBlocks: blocks });
      get().computeOccupancyStats();
    },
    assignRoom: (roomId, roomNumber) => {
      const rooms = get().rooms.map((room) =>
        room.id === roomId
          ? { ...room, roomLabel: `Room-${roomNumber}` }
          : room
      );
      set({ rooms });
    },
    updateHotelBlock: (blockId, updates) => {
      const hotelBlocks = get().hotelBlocks.map((block) =>
        block.id === blockId ? { ...block, ...updates } : block
      );
      set({ hotelBlocks });
    },
    removeHotelBlock: (blockId) => {
      const hotelBlocks = get().hotelBlocks.filter(
        (block) => block.id !== blockId
      );
      set({ hotelBlocks });
    },

    // Calculs
    computeOccupancyStats: () => {
      const state = get();
      const rooms = state.rooms;
      const hotelBlocks = state.hotelBlocks;

      const totalRooms = rooms.length;
      const totalOccupants = rooms.reduce(
        (sum, room) => sum + (room.occupancyCount || 0),
        0
      );
      // INVARIANT 1 : pricingParts = occupancyCount (JAMAIS capacity hardcodée)
      const totalPricingParts = rooms.reduce(
        (sum, room) => sum + (room.pricingParts || room.capacity || 0),
        0,
      );
      const occupancyRate =
        totalPricingParts > 0
          ? Math.round((totalOccupants / totalPricingParts) * 100)
          : 0;
      const totalRevenueTTC = hotelBlocks.reduce((sum, block) => {
        const pricePerNight = block.pricePerNightTTC || 0;
        const nights =
          (new Date(block.checkOutDate).getTime() -
            new Date(block.checkInDate).getTime()) /
          (1000 * 60 * 60 * 24);
        return sum + pricePerNight * nights * block.roomsConfirmed;
      }, 0);

      set({
        occupancyStats: {
          totalRooms,
          totalOccupants,
          occupancyRate,
          totalRevenueTTC,
        },
      });
    },
    reset: () =>
      set({
        rooms: [],
        hotelBlocks: [],
        occupancyStats: {
          totalRooms: 0,
          totalOccupants: 0,
          occupancyRate: 0,
          totalRevenueTTC: 0,
        },
      }),
  }
));
