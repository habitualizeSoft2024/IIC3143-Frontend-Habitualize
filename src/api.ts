import axios, { AxiosInstance } from 'axios';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://www.rlabb.works/',
}) as CustomAxiosInstance;

interface CustomAxiosInstance extends AxiosInstance {
  getGreeting: typeof getGreeting;
}

async function getGreeting() {
  return api.get('/hello_world');
}
api.getGreeting = getGreeting;

export default api;
