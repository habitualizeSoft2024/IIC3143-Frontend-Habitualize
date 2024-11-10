import axios, { AxiosInstance } from 'axios';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'https://dev.rlabb.works/',
}) as CustomAxiosInstance;

interface CustomAxiosInstance extends AxiosInstance {
  getGreeting: typeof getGreeting;
  logIn: typeof logIn;
  signUp: typeof signUp;
}

async function getGreeting() {
  return api.get('/hello_world');
}
api.getGreeting = getGreeting;

async function logIn({ email, password }: { email: string; password: string }) {
  return (
    await api.post('/users/login/', {
      email,
      password,
    })
  ).data;
}
api.logIn = logIn;

async function signUp({
  username,
  email,
  password,
}: {
  username: string;
  email: string;
  password: string;
}) {
  return (
    await api.post('/users/signup', {
      username,
      email,
      password,
    })
  ).data;
}
api.signUp = signUp;

export default api;
