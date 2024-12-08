import axios, { AxiosInstance } from 'axios';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'https://dev.rlabb.works/',
}) as CustomAxiosInstance;

interface CustomAxiosInstance extends AxiosInstance {
  getGreeting: typeof getGreeting;
  logIn: typeof logIn;
  createUser: typeof createUser;
  createHabit: typeof createHabit;
  getUser: typeof getUser;
  getHabits: typeof getHabits;
  getHabit: typeof getHabit;
  updateHabit: typeof updateHabit;
  deleteHabit: typeof deleteHabit;
  getHabitWeeklyStat: typeof getHabitWeeklyStat;
  getMedals: typeof getMedals;
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

async function getUser({ id }: { id: string }) {
  return (await api.get(`user/${id}`)).data;
}
api.getUser = getUser;

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
api.getHabit = getHabit;

async function updateHabit({
  id,
  ...payload
}: {
  id: number;
  name?: string;
  description?: string;
  expected_counter?: number;
  counter?: number;
}) {
  return (await api.patch('/habit/' + id + '/', payload)).data;
}
api.updateHabit = updateHabit;

async function deleteHabit({ id }: { id: number }) {
  return (await api.delete('/habit/' + id + '/')).data;
}
api.deleteHabit = deleteHabit;

async function getHabitWeeklyStat({ id }: { id: number }) {
  return (await api.get(`/habit/${id}/weekly/`)).data;
}
api.getHabitWeeklyStat = getHabitWeeklyStat;

async function getMedals() {
  return (await api.get('user/medals/')).data;
}
api.getMedals = getMedals;

export default api;
