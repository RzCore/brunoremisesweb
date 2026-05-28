'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface User {
  id: string; // DNI del usuario
  name: string;
  dni: string;
  telefono: string;
  email: string;
  points: number;
  plenos: number;
  tendencias: number;
  role?: 'USER' | 'ADMIN';
}

interface AuthContextType {
  user: User | null;
  login: (dni: string, passwordDni: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id' | 'points' | 'plenos' | 'tendencias'>) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (identifier: string, passwordDni: string): Promise<boolean> => {
    try {
      const cleanInput = identifier.trim();
      const cleanPass = passwordDni.trim().replace(/\./g, '');
      const isEmail = cleanInput.includes('@');



      // Consultar por email o por DNI dependiendo del formato del input
      let query = supabase.from('fixture_usuarios').select('*');
      if (isEmail) {
        query = query.eq('email', cleanInput.toLowerCase());
      } else {
        query = query.eq('dni', cleanInput.replace(/\./g, ''));
      }

      const { data, error } = await query.single();

      if (error || !data) {
        console.error('Error al iniciar sesión:', error);
        return false;
      }

      const dbDniClean = data.dni.trim().replace(/\./g, '');
      
      // Permitir acceso con DNI real, DNI limpio o atajo de test "110" / "bruno"
      if (dbDniClean === cleanPass || cleanPass === '110' || cleanPass === 'bruno') {
        const loggedUser: User = {
          id: data.dni,
          name: data.nombre_apellido,
          dni: data.dni,
          telefono: data.telefono || '',
          email: data.email || '',
          points: data.puntos || 0,
          plenos: data.plenos || 0,
          tendencias: data.tendencias || 0,
          role: data.rol || 'USER',
        };
        setUser(loggedUser);
        localStorage.setItem('currentUser', JSON.stringify(loggedUser));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error de login:', err);
      return false;
    }
  };

  const register = async (userData: Omit<User, 'id' | 'points' | 'plenos' | 'tendencias'>): Promise<boolean> => {
    try {
      const cleanDni = userData.dni.trim().replace(/\./g, '');

      const newUser = {
        dni: cleanDni,
        nombre_apellido: userData.name,
        telefono: userData.telefono.trim(),
        email: userData.email.trim(),
        puntos: 0,
        plenos: 0,
        tendencias: 0,
        rol: 'USER'
      };

      const { data, error } = await supabase
        .from('fixture_usuarios')
        .insert([newUser])
        .select()
        .single();

      if (error) {
        console.error('Error en registro en Supabase:', error);
        return false;
      }

      const registeredUser: User = {
        id: data.dni,
        name: data.nombre_apellido,
        dni: data.dni,
        telefono: data.telefono || '',
        email: data.email || '',
        points: data.puntos,
        plenos: data.plenos,
        tendencias: data.tendencias,
        role: data.rol || 'USER'
      };

      setUser(registeredUser);
      localStorage.setItem('currentUser', JSON.stringify(registeredUser));
      return true;
    } catch (err) {
      console.error('Excepción en registro:', err);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateProfile = async (updatedData: Partial<User>) => {
    if (!user) return;

    try {
      const updatePayload: any = {};
      if (updatedData.name !== undefined) updatePayload.nombre_apellido = updatedData.name;
      if (updatedData.telefono !== undefined) updatePayload.telefono = updatedData.telefono;
      if (updatedData.email !== undefined) updatePayload.email = updatedData.email;

      const { data, error } = await supabase
        .from('fixture_usuarios')
        .update(updatePayload)
        .eq('dni', user.dni)
        .select()
        .single();

      if (error) {
        console.error('Error al actualizar perfil en Supabase:', error);
        return;
      }

      const updatedUser: User = {
        id: data.dni,
        name: data.nombre_apellido,
        dni: data.dni,
        telefono: data.telefono || '',
        email: data.email || '',
        points: data.puntos,
        plenos: data.plenos,
        tendencias: data.tendencias,
        role: data.rol || 'USER'
      };

      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    } catch (err) {
      console.error('Excepción al actualizar perfil:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
