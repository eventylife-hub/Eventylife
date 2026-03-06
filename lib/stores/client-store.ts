import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProfileData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  avatarUrl: string;
  stats?: {
    totalBookings: number;
    confirmedBookings: number;
    pendingBookings: number;
    cancelledBookings: number;
    totalAmountSpentCents: number;
  };
}

interface BookingData {
  id: string;
  status: string;
  travelTitle: string;
  travelSlug: string;
  travelCoverImageUrl?: string;
  departureDate: string;
  returnDate: string;
  destinationCity: string;
  totalAmountTTC: number;
  participantCount: number;
  createdAt: string;
}

interface GroupData {
  id: string;
  name: string;
  status: string;
  travelTitle: string;
  travelSlug: string;
  departureDate: string;
  destinationCity: string;
  memberCount: number;
  createdAt: string;
}

interface PaymentData {
  id: string;
  amount: number;
  currency: string;
  status: string;
  provider: string;
  createdAt: string;
  travelTitle: string;
  travelSlug: string;
  bookingId: string;
}

interface ClientStore {
  // Profile
  profile: ProfileData | null;
  profileLoading: boolean;
  setProfile: (profile: ProfileData | null) => void;
  setProfileLoading: (loading: boolean) => void;

  // Bookings
  bookings: BookingData[];
  bookingsLoading: boolean;
  setBookings: (bookings: BookingData[]) => void;
  setBookingsLoading: (loading: boolean) => void;
  addBooking: (booking: BookingData) => void;
  updateBooking: (id: string, booking: Partial<BookingData>) => void;

  // Groups
  groups: GroupData[];
  groupsLoading: boolean;
  setGroups: (groups: GroupData[]) => void;
  setGroupsLoading: (loading: boolean) => void;

  // Payments
  payments: PaymentData[];
  paymentsLoading: boolean;
  setPayments: (payments: PaymentData[]) => void;
  setPaymentsLoading: (loading: boolean) => void;

  // Cache management
  lastUpdated: {
    profile: number | null;
    bookings: number | null;
    groups: number | null;
    payments: number | null;
  };
  isCacheValid: (key: 'profile' | 'bookings' | 'groups' | 'payments', maxAge: number) => boolean;
  updateCacheTime: (key: 'profile' | 'bookings' | 'groups' | 'payments') => void;

  // Clear all data
  clearAll: () => void;
}

export const useClientStore = create<ClientStore>()(
  persist(
    (set, get) => ({
      // Profile
      profile: null,
      profileLoading: false,
      setProfile: (profile) => set({ profile }),
      setProfileLoading: (loading) => set({ profileLoading: loading }),

      // Bookings
      bookings: [],
      bookingsLoading: false,
      setBookings: (bookings) => set({ bookings }),
      setBookingsLoading: (loading) => set({ bookingsLoading: loading }),
      addBooking: (booking) =>
        set((state) => ({
          bookings: [booking, ...state.bookings],
        })),
      updateBooking: (id, updates) =>
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === id ? { ...b, ...updates } : b
          ),
        })),

      // Groups
      groups: [],
      groupsLoading: false,
      setGroups: (groups) => set({ groups }),
      setGroupsLoading: (loading) => set({ groupsLoading: loading }),

      // Payments
      payments: [],
      paymentsLoading: false,
      setPayments: (payments) => set({ payments }),
      setPaymentsLoading: (loading) => set({ paymentsLoading: loading }),

      // Cache management
      lastUpdated: {
        profile: null,
        bookings: null,
        groups: null,
        payments: null,
      },
      isCacheValid: (key, maxAge) => {
        const lastUpdate = get().lastUpdated[key];
        if (!lastUpdate) return false;
        return Date.now() - lastUpdate < maxAge;
      },
      updateCacheTime: (key) =>
        set((state) => ({
          lastUpdated: {
            ...state.lastUpdated,
            [key]: Date.now(),
          },
        })),

      // Clear all data
      clearAll: () =>
        set({
          profile: null,
          profileLoading: false,
          bookings: [],
          bookingsLoading: false,
          groups: [],
          groupsLoading: false,
          payments: [],
          paymentsLoading: false,
          lastUpdated: {
            profile: null,
            bookings: null,
            groups: null,
            payments: null,
          },
        }),
    }),
    {
      name: 'client-store',
      partialize: (state) => ({
        profile: state.profile,
        bookings: state.bookings,
        groups: state.groups,
        payments: state.payments,
        lastUpdated: state.lastUpdated,
      }),
    }
  )
);
