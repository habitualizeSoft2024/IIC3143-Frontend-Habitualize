import axios, { AxiosInstance } from 'axios';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'https://dev.rlabb.works/',
}) as CustomAxiosInstance;

interface CustomAxiosInstance extends AxiosInstance {
  getGreeting: typeof getGreeting;
  logIn: typeof logIn;
  createUser: typeof createUser;
  createHabit: typeof createHabit;
  getHabits: typeof getHabits;
  getHabit: typeof getHabit;
  updateHabit: typeof updateHabit;
  deleteHabit: typeof deleteHabit;
}

async function getGreeting() {
  return api.get('/hello_world');
}
api.getGreeting = getGreeting;

async function logIn(payload: {
  email: string;
  password: string;
  username: string;
}) {
  return (await api.post('/user/login/', payload)).data;
}
api.logIn = logIn;

async function createUser(payload: {
  username: string;
  email: string;
  password: string;
}) {
  return (await api.post('/user/', payload)).data;
}
api.createUser = createUser;

async function createHabit(payload: {
  name: string;
  description: string;
  expected_counter: number;
}) {
  return (await api.post('user/create-habit/', payload)).data;
}
api.createHabit = createHabit;

async function getHabits() {
  return (await api.get('user/habits/')).data;
}
api.getHabits = getHabits;

async function getHabit({ id }: { id: number }) {
  return (await api.get('habit/' + id + '/')).data;
}

async function updateHabit({
  id,
  ...payload
}: {
  id: number;
  name?: string;
  description?: string;
  expected_counter?: number;
}) {
  return (await api.patch('/habit/' + id + '/', payload)).data;
}
api.updateHabit = updateHabit;

async function deleteHabit({ id }: { id: number }) {
  return (await api.delete('/habit/' + id + '/')).data;
}
api.deleteHabit = deleteHabit;

export default api;
