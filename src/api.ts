import axios, { AxiosInstance } from 'axios';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'https://dev.rlabb.works/',
}) as CustomAxiosInstance;

interface CustomAxiosInstance extends AxiosInstance {
  getGreeting: typeof getGreeting;
  logIn: typeof logIn;
  createUser: typeof createUser;
}

async function getGreeting() {
  return api.get('/hello_world');
}
api.getGreeting = getGreeting;

async function logIn({ email, password }: { email: string; password: string }) {
  return (
    await api.post('/user/login/', {
      email,
      password,
    })
  ).data;
}
api.logIn = logIn;

async function createUser({
  username,
  email,
  password,
}: {
  username: string;
  email: string;
  password: string;
}) {
  return (
    await api.post('/user/', {
      username,
      email,
      password,
    })
  ).data;
}
api.createUser = createUser;

export default api;
