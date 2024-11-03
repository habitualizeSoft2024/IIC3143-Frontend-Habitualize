// AuthContext.tsx
import React, { createContext, ReactNode, useState } from 'react';
import api from '../../api';

const parseJwt = (token: string) => {
  try {
    console.log('🚀 ~ parseJwt: ~ token', token); // Logging for development
    const parts = token.split('.');

    if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
    }

    // Helper function to decode Base64Url encoding
    const base64UrlDecode = (str: string) => {
      const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
      // Add necessary padding to the string
      const paddedBase64 = base64.padEnd(
        base64.length + ((4 - (base64.length % 4)) % 4),
        '=',
      );
      return atob(paddedBase64);
    };

    // Decode the Base64Url payload (2nd part of the JWT)
    const decodedPayload = JSON.parse(base64UrlDecode(parts[1]));

    console.log('✨ ~ parseJwt: ~ decodedPayload', decodedPayload); // Logging for development
    return decodedPayload;
  } catch (e) {
    console.error('Error parsing JWT', e);
    return null;
  }
};

interface AuthContextType {
  userId: string | null;
  token: string | null;
  login: (
    email: string,
    password: string,
    username?: string,
    status?: string,
  ) => Promise<void>;
  logout: () => void;
  createUser: (
    username: string,
    email: string,
    password: string,
  ) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  userId: null,
  token: null,
  login: async () => {},
  createUser: async () => {},
  logout: () => {},
});

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const login = async (
    email: string,
    password: string,
    username = '',
    status = 'active',
  ) => {
    try {
      const response = await api.login(email, password, username, status);
      const { access: token } = response;
      const userId = parseJwt(token).user_id;
      setToken(token);
      setUserId(userId);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const createUser = async (
    username: string,
    email: string,
    password: string,
  ) => {
    try {
      const response = await api.createUser(
        username,
        email,
        password,
        'active',
      );

      if ('User successfully created and authenticated' !== response.message) {
        throw new Error('Account creation failed', response.message);
      }

      const { access: token } = response;
      const userId = parseJwt(token).user_id;
      setToken(token);
      setUserId(userId);
    } catch (error) {
      console.error('Account creation failed:', error);
      throw error;
    }
  };

  const logout = () => {
    setUserId(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ userId, token, login, logout, createUser }}>
      {children}
    </AuthContext.Provider>
  );
}
