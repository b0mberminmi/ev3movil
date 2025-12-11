import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authenticate, getCurrentUser, clearCurrentUser, AuthUser } from '../../constants/auth';
import getAuthService from '@/services/auth-services';
import { Alert } from 'react-native';

export interface User {
  id: string;
  email: string;
  token: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await getCurrentUser();
      if (storedUser) {
        setUser(storedUser);
      }
    };
    loadUser();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const authClient = getAuthService();
    setLoading(true);

    try {
      const loginResponse = await authClient.login({ email, password });
      
      if (loginResponse.data?.token) {
        const token = loginResponse.data.token;
        console.log('Token recibido:', token);
        
        // Guardar usuario
        setUser({ email });
        await AsyncStorage.setItem('@MyApp:CurrentUser', JSON.stringify({ email }));
        
        Alert.alert('Login exitoso');
        return true;
      }
      
      Alert.alert('Error', 'Credenciales inválidas');
      return false;
    } catch (error) {
      console.error('Error en login:', error);
      Alert.alert('Error en login', (error as Error).message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setUser(null);
    await clearCurrentUser();
  };

  const register = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const isValid = await authenticate(email, password);
      if (isValid) {
        setUser({ email });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error en registro:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading: loading,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};
