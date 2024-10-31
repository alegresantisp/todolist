'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { registerUser } from '../../helpers/register.helper';
import { loginUser } from '../../helpers/login.helper';

interface JwtPayload {
  email: string;
}

export const parseJwt = (token: string): JwtPayload => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT');
    }
    const payload = decodeBase64Url(parts[1]);
    return JSON.parse(payload) as JwtPayload;
  } catch (error) {
    console.error('Error al decodificar el token JWT:', error);
    throw new Error('Token JWT inválido');
  }
};

const decodeBase64Url = (str: string) => {
  const pad = '='.repeat((4 - (str.length % 4)) % 4);
  const base64 = (str + pad).replace(/-/g, '+').replace(/_/g, '/');
  return atob(base64);
};

interface AuthContextType {
  user: string | null; 
  error: string | null; // Agrega esta línea
  register: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null); // Añade el estado para el error

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = parseJwt(token);
      setUser(decoded.email);
    }
  }, []);

  const register = async (email: string, password: string) => {
    try {
      const response = await registerUser(email, password);
      localStorage.setItem('token', response.token); 
      const decoded = parseJwt(response.token);
      setUser(decoded.email);
      setError(null); // Resetea el error si la operación es exitosa
    } catch (err) {
      console.error(err); // Muestra el error en la consola
      setError('Error en el registro. Inténtalo de nuevo.'); // Maneja el error
    }
  };
  
  const login = async (email: string, password: string) => {
    try {
      const response = await loginUser(email, password);
      localStorage.setItem('token', response.token); 
      const decoded = parseJwt(response.token);
      setUser(decoded.email);
      setError(null); // Resetea el error si la operación es exitosa
    } catch (err) {
      console.error(err); // Muestra el error en la consola
      setError('Error en el inicio de sesión. Inténtalo de nuevo.'); // Maneja el error
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setError(null); // Resetea el error al cerrar sesión
  };

  return (
    <AuthContext.Provider value={{ user, error, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};