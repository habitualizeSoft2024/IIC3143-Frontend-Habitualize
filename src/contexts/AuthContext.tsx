import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import api from '@/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Preloader from '@/components/Preloader';
import { AxiosResponse } from 'axios';
import { router } from 'expo-router';

function parseJwt(token: string) {
  try {
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

    return decodedPayload;
  } catch (e) {
    console.error('Error parsing JWT', e);
    return null;
  }
}

const SessionContext = createContext<{
  token: string | null;
  userId: string | null;
  username: string | null;
  loggedIn: boolean;
  signUp: ({
    username,
    email,
    password,
  }: {
    username: string;
    email: string;
    password: string;
  }) => any;
  logIn: ({
    email,
    password,
    username,
  }: {
    email: string;
    password: string;
    username: string;
  }) => any;
  logOut: () => void;
}>({
  token: '',
  userId: '',
  username: '',
  loggedIn: false,
  signUp: () => ({}) as Promise<AxiosResponse>,
  logIn: () => ({}) as Promise<AxiosResponse>,
  logOut: () => {},
});

export function useSession() {
  return useContext(SessionContext);
}

export default function SessionProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const loadSession = async () => {
      try {
        setToken((await AsyncStorage.getItem('token')) ?? '');
        setUserId((await AsyncStorage.getItem('userId')) ?? '');
        setUsername((await AsyncStorage.getItem('username')) ?? '');
      } catch (error) {
        console.error('Error loading session from AsyncStorage:', error);
      }
    };

    loadSession();
  }, []);

  useEffect(() => {
    if (token === null) return;

    if (token === '') {
      delete api.defaults.headers.common.Authorization;
    } else api.defaults.headers.common.Authorization = `Bearer ${token}`;

    const saveToken = async () => {
      try {
        await AsyncStorage.setItem('token', token);
      } catch (error) {
        console.error('Error saving  token to AsyncStorage:', error);
      }
    };
    saveToken();
  }, [token]);

  useEffect(() => {
    if (userId === null) return;
    const saveUserId = async () => {
      try {
        await AsyncStorage.setItem('userId', userId);
      } catch (error) {
        console.error('Error saving user ID to AsyncStorage:', error);
      }
    };
    saveUserId();
  }, [userId]);

  useEffect(() => {
    if (username === null) return;
    const saveUsername = async () => {
      try {
        await AsyncStorage.setItem('username', username);
      } catch (error) {
        console.error('Error saving username to AsyncStorage:', error);
      }
    };
    saveUsername();
  }, [username]);

  useEffect(() => {
    if (token && userId && username) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, [token, userId, username]);

  async function signUp({
    username,
    email,
    password,
  }: {
    username: string;
    email: string;
    password: string;
  }) {
    try {
      const response = await api.createUser({
        username,
        email,
        password,
      });

      if ('User successfully created and authenticated' !== response.message) {
        throw new Error('Account creation failed', response.message);
      }

      const { access: token } = response;
      const userId = parseJwt(token).user_id;
      setToken(token);
      setUserId(userId);
      setUsername(username);
      router.navigate('/');
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  }

  async function logIn({
    email,
    password,
    username,
  }: {
    email: string;
    password: string;
    username: string;
  }) {
    try {
      const response = await api.logIn({
        email,
        password,
        username,
      });
      const { access: token } = response;
      const userId = parseJwt(token).user_id;
      setToken(token);
      setUserId(userId);
      setUsername(username);
      router.navigate('/');
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }

  async function logOut() {
    setToken('');
    setUserId('');
    setUsername('');
  }

  if (token === null || userId === null) {
    return <Preloader />;
  }

  return (
    <SessionContext.Provider
      value={{
        token: token,
        userId: userId,
        username: username,
        loggedIn: loggedIn,
        signUp,
        logIn,
        logOut,
      }}
      children={children}
    />
  );
}
