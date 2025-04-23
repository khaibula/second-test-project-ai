export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  userId: string;
}

export interface User {
  id: string;
  username: string;
  password: string; // В реальном приложении не храните пароли в открытом виде
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface TodosState {
  todos: Todo[];
  isLoading: boolean;
  error: string | null;
} 