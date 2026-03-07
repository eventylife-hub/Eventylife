import { create } from 'zustand';

interface GroupMessage {
  id: string;
  content: string;
  userId: string;
  createdAt: string;
}

interface CreateGroupData {
  travelId: string;
  name?: string;
  maxRooms?: number;
}

interface Group {
  id: string;
  code: string;
  name?: string;
  travelId: string;
  leaderUserId: string;
  status: string;
  maxRooms?: number;
  memberCount: number;
  pendingInvites: number;
  messages: GroupMessage[];
  createdAt: string;
}

interface GroupsState {
  // État
  groups: Group[];
  selectedGroup: Group | null;
  loading: boolean;
  error: string | null;

  // Actions
  setGroups: (groups: Group[]) => void;
  setSelectedGroup: (group: Group | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Opérations
  fetchGroups: (travelId: string) => Promise<void>;
  fetchGroupDetail: (groupId: string) => Promise<void>;
  createGroup: (data: CreateGroupData) => Promise<Group>;
  joinGroup: (groupId: string) => Promise<void>;
  leaveGroup: (groupId: string) => Promise<void>;
  inviteMember: (groupId: string, email: string) => Promise<void>;
  sendMessage: (groupId: string, content: string) => Promise<void>;
  closeGroup: (groupId: string) => Promise<void>;

  // Clearing
  clear: () => void;
}

/**
 * Store Zustand pour la gestion des groupes de voyage
 */
export const useGroupsStore = create<GroupsState>((set, get) => ({
  // État initial
  groups: [],
  selectedGroup: null,
  loading: false,
  error: null,

  // Setters
  setGroups: (groups) => set({ groups }),
  setSelectedGroup: (group) => set({ selectedGroup: group }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Opérations
  fetchGroups: async (travelId: string) => {
    try {
      set({ loading: true, error: null });
      const res = await fetch(`/api/groups/travel/${travelId}`, { credentials: 'include' });
      if (!res.ok) throw new Error('Erreur lors du chargement');
      const data = await res.json();
      set({ groups: data, loading: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur inattendue';
      set({ error: message, loading: false });
    }
  },

  fetchGroupDetail: async (groupId: string) => {
    try {
      set({ loading: true, error: null });
      const res = await fetch(`/api/groups/${groupId}/stats`, { credentials: 'include' });
      if (!res.ok) throw new Error('Groupe non trouvé');
      const data = await res.json();
      set({ selectedGroup: data, loading: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur inattendue';
      set({ error: message, loading: false });
    }
  },

  createGroup: async (data: CreateGroupData) => {
    try {
      set({ error: null });
      const res = await fetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Erreur lors de la création');
      const group = await res.json();
      set((state) => ({
        groups: [...state.groups, group],
        selectedGroup: group,
      }));
      return group;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur inattendue';
      set({ error: message });
      throw err;
    }
  },

  joinGroup: async (groupId: string) => {
    try {
      set({ error: null });
      const res = await fetch(`/api/groups/${groupId}/join`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Erreur lors de l\'adhésion');
      const group = await res.json();
      set((state) => ({
        groups: state.groups.map((g) =>
          g.id === groupId ? group : g
        ),
      }));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur inattendue';
      set({ error: message });
      throw err;
    }
  },

  leaveGroup: async (groupId: string) => {
    try {
      set({ error: null });
      const res = await fetch(`/api/groups/${groupId}/leave`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Erreur');
      set((state) => ({
        groups: state.groups.filter((g) => g.id !== groupId),
        selectedGroup:
          state.selectedGroup?.id === groupId ? null : state.selectedGroup,
      }));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur inattendue';
      set({ error: message });
      throw err;
    }
  },

  inviteMember: async (groupId: string, email: string) => {
    try {
      set({ error: null });
      const res = await fetch(`/api/groups/${groupId}/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Erreur lors de l\'invitation');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur inattendue';
      set({ error: message });
      throw err;
    }
  },

  sendMessage: async (groupId: string, content: string) => {
    try {
      set({ error: null });
      const res = await fetch(`/api/groups/${groupId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Erreur');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur inattendue';
      set({ error: message });
      throw err;
    }
  },

  closeGroup: async (groupId: string) => {
    try {
      set({ error: null });
      const res = await fetch(`/api/groups/${groupId}/close`, {
        method: 'PATCH',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Erreur');
      set((state) => ({
        groups: state.groups.map((g) =>
          g.id === groupId ? { ...g, status: 'CLOSED' } : g
        ),
      }));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur inattendue';
      set({ error: message });
      throw err;
    }
  },

  clear: () => {
    set({
      groups: [],
      selectedGroup: null,
      loading: false,
      error: null,
    });
  },
}));
