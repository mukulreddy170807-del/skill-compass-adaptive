import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Role } from '@/types';
import { users } from '@/data/mockData';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
}

function createMockJWT(user: User): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ sub: user.id, email: user.email, role: user.role, name: user.name, exp: Date.now() + 86400000 }));
  return `${header}.${payload}.mock-signature`;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (email: string, _password: string) => {
        const user = users.find((u) => u.email === email);
        if (!user) return { success: false, error: 'Invalid credentials' };
        const token = createMockJWT(user);
        set({ user, token, isAuthenticated: true });
        return { success: true };
      },
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    { name: 'auth-storage' }
  )
);

export function getRoleDashboardPath(role: Role): string {
  switch (role) {
    case 'employee': return '/dashboard';
    case 'manager': return '/manager';
    case 'hr': return '/hr';
  }
}
