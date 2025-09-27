
import { useState, useEffect } from 'react';
import { User, NewUser, LoginCredentials, AuthState } from '../types/user';
import { authService } from '../services/authService';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      await authService.initializeAuth();
      const currentUser = await authService.getCurrentUser();
      setAuthState({
        user: currentUser,
        isAuthenticated: !!currentUser,
        isLoading: false
      });
      console.log('Auth initialized, current user:', currentUser?.username || 'None');
    } catch (error) {
      console.error('Error initializing auth:', error);
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });
    }
  };

  const register = async (userData: NewUser) => {
    const result = await authService.register(userData);
    if (result.success && result.user) {
      setAuthState({
        user: result.user,
        isAuthenticated: true,
        isLoading: false
      });
    }
    return result;
  };

  const login = async (credentials: LoginCredentials) => {
    const result = await authService.login(credentials);
    if (result.success && result.user) {
      setAuthState({
        user: result.user,
        isAuthenticated: true,
        isLoading: false
      });
    }
    return result;
  };

  const logout = async () => {
    await authService.logout();
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
  };

  const isAdmin = () => {
    return authState.user?.role === 'admin';
  };

  return {
    ...authState,
    register,
    login,
    logout,
    isAdmin
  };
};
