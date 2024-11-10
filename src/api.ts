import axios, { AxiosInstance } from 'axios';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'https://dev.rlabb.works/',
}) as CustomAxiosInstance;

interface CustomAxiosInstance extends AxiosInstance {
  getGreeting: typeof getGreeting;
  login: typeof login;
  createUser: typeof createUser;
}

async function getGreeting() {
  return api.get('/hello_world');
}
api.getGreeting = getGreeting;

async function login(
  email: string,
  password: string,
  username: string,
  status: string,
) {
  status = status || 'active'; // Default to 'active' if not provided
  const response = await api.post('/users/login/', {
    email,
    password,
    username,
    status,
  });
  return response.data;
}
api.login = login;

async function createUser(
  username: string,
  email: string,
  password: string,
  status: string,
) {
  status = status || 'active'; // Default to 'active' if not provided
  const response = await api.post('/users', {
    username,
    email,
    password,
    status,
  });
  return response.data;
}
api.createUser = createUser;

export default api;
