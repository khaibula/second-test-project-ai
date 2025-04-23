import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { AuthState, User } from '../../../shared/types';

interface AuthStore extends AuthState {
  login: (username: string, password: string) => boolean;
  register: (username: string, password: string) => boolean;
  logout: () => void;
  getUsers: () => User[];
}

const getInitialUsers = (): User[] => {
  const storedUsers = localStorage.getItem('users');
  return storedUsers ? JSON.parse(storedUsers) : [];
};

const saveUsers = (users: User[]): void => {
  localStorage.setItem('users', JSON.stringify(users));
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      
      login: (username: string, password: string) => {
        const users = getInitialUsers();
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {
          set({ user, isAuthenticated: true });
          return true;
        }
        return false;
      },
      
      register: (username: string, password: string) => {
        const users = getInitialUsers();
        
        // Проверка, существует ли уже пользователь с таким именем
        if (users.some(user => user.username === username)) {
          return false;
        }
        
        const newUser: User = {
          id: uuidv4(),
          username,
          password
        };
        
        users.push(newUser);
        saveUsers(users);
        
        set({ user: newUser, isAuthenticated: true });
        return true;
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      
      getUsers: () => {
        return getInitialUsers();
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
); 