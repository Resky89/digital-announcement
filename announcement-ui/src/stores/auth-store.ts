import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User, AuthState } from '@/types';
import { authApi } from '@/lib/api/auth';

interface AuthStore extends AuthState {
  setUser: (user: User | null) => void;
  setTokens: (accessToken: string, refreshToken: string, csrfToken: string) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      csrfToken: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      setTokens: (accessToken, refreshToken, csrfToken) =>
        set({ accessToken, refreshToken, csrfToken }),

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const response = await authApi.login({ email, password });
          set({
            accessToken: response.access_token,
            refreshToken: response.refresh_token,
            csrfToken: response.csrf_token,
            isAuthenticated: true,
          });
          // Fetch user info after login
          await get().fetchUser();
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        try {
          await authApi.logout();
        } catch (error) {
          // Ignore logout errors
        } finally {
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            csrfToken: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      fetchUser: async () => {
        const { accessToken } = get();
        if (!accessToken) {
          set({ isLoading: false });
          return;
        }

        set({ isLoading: true });

        try {
          const user = await authApi.getMe();
          set({ user, isAuthenticated: true });
        } catch (error) {
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            csrfToken: null,
            isAuthenticated: false,
          });
        } finally {
          set({ isLoading: false });
        }
      },

      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        csrfToken: state.csrfToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
