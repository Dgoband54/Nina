// =============================================================================
// CONTEXTO DE AUTENTICACIÓN - NINA PWA
// =============================================================================

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase, getSession, signInWithPassword, signOut } from '@/lib/supabase';

// =============================================================================
// TIPOS
// =============================================================================

export type UserRole = 'diego' | 'nina' | null;

export interface AuthUser {
  id: string;
  email: string;
  username: UserRole;
  isAdmin: boolean;
  nombre: string;
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  showWelcomeAnimation: boolean;
  setShowWelcomeAnimation: (show: boolean) => void;
}

// =============================================================================
// CONTEXTO
// =============================================================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// =============================================================================
// CREDENCIALES PERMITIDAS (En producción, usar variables de entorno)
// =============================================================================

const ALLOWED_USERS = [
  { email: 'diego@nina.app', username: 'diego' as UserRole, password: 'diego2024', nombre: 'Diego', isAdmin: true },
  { email: 'nina@nina.app', username: 'nina' as UserRole, password: 'nina2024', nombre: 'Nina', isAdmin: false },
];

// =============================================================================
// PROVIDER
// =============================================================================

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcomeAnimation, setShowWelcomeAnimation] = useState(false);

  // Inicializar sesión
  useEffect(() => {
    const initSession = async () => {
      setIsLoading(true);
      
      try {
        const { session: currentSession } = await getSession();
        
        if (currentSession?.user) {
          const userMetadata = currentSession.user.user_metadata;
          const authUser: AuthUser = {
            id: currentSession.user.id,
            email: currentSession.user.email || '',
            username: userMetadata?.username as UserRole,
            isAdmin: userMetadata?.isAdmin || false,
            nombre: userMetadata?.nombre || '',
          };
          setUser(authUser);
          setSession(currentSession);
        }
      } catch (error) {
        console.error('Error initializing session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initSession();

    // Escuchar cambios en la autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (event === 'SIGNED_IN' && newSession?.user) {
        const userMetadata = newSession.user.user_metadata;
        const authUser: AuthUser = {
          id: newSession.user.id,
          email: newSession.user.email || '',
          username: userMetadata?.username as UserRole,
          isAdmin: userMetadata?.isAdmin || false,
          nombre: userMetadata?.nombre || '',
        };
        setUser(authUser);
        setSession(newSession);
        
        // Si es Nina, mostrar animación de bienvenida
        if (authUser.username === 'nina') {
          setShowWelcomeAnimation(true);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setSession(null);
        setShowWelcomeAnimation(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // =============================================================================
  // LOGIN
  // =============================================================================

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    try {
      // Verificar credenciales contra usuarios permitidos
      const allowedUser = ALLOWED_USERS.find(
        u => u.email === email && u.password === password
      );

      if (!allowedUser) {
        return { success: false, error: 'Credenciales inválidas' };
      }

      // Intentar login con Supabase Auth
      const { data, error } = await signInWithPassword(email, password);

      if (error) {
        // Si el usuario no existe en Supabase, crearlo (solo para demo)
        if (error.message.includes('Invalid login credentials')) {
          // Para demo, simulamos el login exitoso
          const mockSession = {
            user: {
              id: `mock-${allowedUser.username}`,
              email: allowedUser.email,
              user_metadata: {
                username: allowedUser.username,
                isAdmin: allowedUser.isAdmin,
                nombre: allowedUser.nombre,
              },
            },
          } as any;

          const authUser: AuthUser = {
            id: mockSession.user.id,
            email: allowedUser.email,
            username: allowedUser.username,
            isAdmin: allowedUser.isAdmin,
            nombre: allowedUser.nombre,
          };

          setUser(authUser);
          setSession(mockSession);
          
          // Si es Nina, mostrar animación de bienvenida
          if (allowedUser.username === 'nina') {
            setShowWelcomeAnimation(true);
          }

          setIsLoading(false);
          return { success: true };
        }
        
        return { success: false, error: error.message };
      }

      if (data.user) {
        const userMetadata = data.user.user_metadata;
        const authUser: AuthUser = {
          id: data.user.id,
          email: data.user.email || '',
          username: userMetadata?.username as UserRole,
          isAdmin: userMetadata?.isAdmin || false,
          nombre: userMetadata?.nombre || '',
        };
        setUser(authUser);
        setSession(data.session);
        
        // Si es Nina, mostrar animación de bienvenida
        if (authUser.username === 'nina') {
          setShowWelcomeAnimation(true);
        }
      }

      return { success: true };
    } catch (error: any) {
      console.error('Login error:', error);
      return { success: false, error: error.message || 'Error desconocido' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // =============================================================================
  // LOGOUT
  // =============================================================================

  const logout = useCallback(async () => {
    setIsLoading(true);
    
    try {
      await signOut();
      setUser(null);
      setSession(null);
      setShowWelcomeAnimation(false);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // =============================================================================
  // RENDER
  // =============================================================================

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    showWelcomeAnimation,
    setShowWelcomeAnimation,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// =============================================================================
// HOOK PERSONALIZADO
// =============================================================================

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

export default AuthContext;
