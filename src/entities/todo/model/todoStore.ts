import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Todo, TodosState } from '../../../shared/types';
import { useAuthStore } from '../../../features/auth';

interface TodoStore extends TodosState {
  addTodo: (title: string) => void;
  toggleTodo: (id: string) => void;
  removeTodo: (id: string) => void;
  clearCompletedTodos: () => void;
}

export const useTodoStore = create<TodoStore>()(
  persist(
    (set) => ({
      todos: [],
      isLoading: false,
      error: null,
      
      addTodo: (title: string) => {
        const user = useAuthStore.getState().user;
        
        if (!user) {
          set({ error: 'Пользователь не авторизован' });
          return;
        }
        
        const newTodo: Todo = {
          id: uuidv4(),
          title,
          completed: false,
          createdAt: new Date().toISOString(),
          userId: user.id
        };
        
        set((state) => ({
          todos: [...state.todos, newTodo],
          error: null
        }));
      },
      
      toggleTodo: (id: string) => {
        set((state) => ({
          todos: state.todos.map((todo) => 
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
          )
        }));
      },
      
      removeTodo: (id: string) => {
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id)
        }));
      },
      
      clearCompletedTodos: () => {
        set((state) => ({
          todos: state.todos.filter((todo) => !todo.completed)
        }));
      }
    }),
    {
      name: 'todos-storage',
      partialize: (state) => ({ todos: state.todos }),
    }
  )
); 