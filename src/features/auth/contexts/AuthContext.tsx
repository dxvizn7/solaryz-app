import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { api } from '@/lib/api';
import { User, LoginData } from '../types';

interface AuthContextData {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (data: LoginData) => Promise<void>;
  loginWithGoogle: (googleToken: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: User) => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carrega a sessão salva ao iniciar o app de forma segura
  useEffect(() => {
    async function loadStoredData() {
      try {
        const storedToken = await SecureStore.getItemAsync('@SolaryZ:token');
        const storedUser = await SecureStore.getItemAsync('@SolaryZ:user');
        
        if (storedToken && storedUser) {
          api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Erro ao recuperar sessão', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadStoredData();
  }, []);

  const login = async (data: LoginData) => {
    const response = await api.post('/login', data);
    
    const token = response.data.access_token;
    const userData = response.data.user; 

    if (token && userData) {
      await SecureStore.setItemAsync('@SolaryZ:token', token);
      await SecureStore.setItemAsync('@SolaryZ:user', JSON.stringify(userData));
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userData);
    }
  };

  const loginWithGoogle = async (googleToken: string) => {
    const response = await api.post('/auth/google', { token: googleToken });
    
    const token = response.data.access_token;
    const userData = response.data.user; 

    if (token && userData) {
      await SecureStore.setItemAsync('@SolaryZ:token', token);
      await SecureStore.setItemAsync('@SolaryZ:user', JSON.stringify(userData));
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userData);
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('@SolaryZ:token');
    await SecureStore.deleteItemAsync('@SolaryZ:user');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const updateUser = async (userData: User) => {
    await SecureStore.setItemAsync('@SolaryZ:user', JSON.stringify(userData));
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, isLoading, login, loginWithGoogle, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
