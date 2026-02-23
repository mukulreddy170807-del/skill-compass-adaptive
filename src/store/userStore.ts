import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';

interface UserStore {
  dynamicUsers: User[];
  addUser: (user: User) => void;
  removeUser: (userId: string) => void;
  getAllUsers: () => User[];
  getUserByEmail: (email: string) => User | undefined;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      dynamicUsers: [],
      
      addUser: (user: User) => {
        set((state) => ({
          dynamicUsers: [...state.dynamicUsers, user]
        }));
      },
      
      removeUser: (userId: string) => {
        set((state) => ({
          dynamicUsers: state.dynamicUsers.filter((u) => u.id !== userId)
        }));
      },
      
      getAllUsers: () => get().dynamicUsers,
      
      getUserByEmail: (email: string) => {
        return get().dynamicUsers.find((u) => u.email === email);
      }
    }),
    { name: 'user-storage' }
  )
);
