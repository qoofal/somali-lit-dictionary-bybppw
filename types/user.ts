
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  dateCreated: Date;
  lastLogin?: Date;
}

export interface NewUser {
  username: string;
  email: string;
  password: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
