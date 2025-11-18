import axios from 'axios';
import type {
  Coffee,
  UsageLog,
  CoffeeMachine,
  Recipe,
  MachineUsageLog,
  OverallStats,
  MachineStats,
} from '../types';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Coffee API
export const coffeeApi = {
  getAll: () => api.get<Coffee[]>('/coffees'),
  getById: (id: number) => api.get<Coffee>(`/coffees/${id}`),
  create: (data: Partial<Coffee>) => api.post<Coffee>('/coffees', data),
  update: (id: number, data: Partial<Coffee>) => api.put<Coffee>(`/coffees/${id}`, data),
  delete: (id: number) => api.delete(`/coffees/${id}`),
};

// Usage Log API
export const usageApi = {
  getAll: () => api.get<UsageLog[]>('/usage'),
  getByCoffeeId: (coffeeId: number) => api.get<UsageLog[]>(`/usage/coffee/${coffeeId}`),
  create: (data: Partial<UsageLog>) => api.post<UsageLog>('/usage', data),
  delete: (id: number) => api.delete(`/usage/${id}`),
};

// Coffee Machine API
export const machineApi = {
  getAll: () => api.get<CoffeeMachine[]>('/machines'),
  getById: (id: number) => api.get<CoffeeMachine>(`/machines/${id}`),
  create: (data: Partial<CoffeeMachine>) => api.post<CoffeeMachine>('/machines', data),
  update: (id: number, data: Partial<CoffeeMachine>) =>
    api.put<CoffeeMachine>(`/machines/${id}`, data),
  delete: (id: number) => api.delete(`/machines/${id}`),
};

// Recipe API
export const recipeApi = {
  getAll: () => api.get<Recipe[]>('/recipes'),
  getById: (id: number) => api.get<Recipe>(`/recipes/${id}`),
  getByMachineId: (machineId: number) => api.get<Recipe[]>(`/recipes/machine/${machineId}`),
  create: (data: Partial<Recipe>) => api.post<Recipe>('/recipes', data),
  update: (id: number, data: Partial<Recipe>) => api.put<Recipe>(`/recipes/${id}`, data),
  delete: (id: number) => api.delete(`/recipes/${id}`),
};

// Machine Usage API
export const machineUsageApi = {
  getAll: () => api.get<MachineUsageLog[]>('/machine-usage'),
  getByRecipeId: (recipeId: number) =>
    api.get<MachineUsageLog[]>(`/machine-usage/recipe/${recipeId}`),
  getByMachineId: (machineId: number) =>
    api.get<MachineUsageLog[]>(`/machine-usage/machine/${machineId}`),
  create: (data: Partial<MachineUsageLog>) =>
    api.post<MachineUsageLog>('/machine-usage', data),
  delete: (id: number) => api.delete(`/machine-usage/${id}`),
};

// Statistics API
export const statsApi = {
  getOverall: () => api.get<OverallStats>('/stats'),
  getMachineStats: (machineId: number) => api.get<MachineStats>(`/stats/machine/${machineId}`),
  getRecipeStats: (recipeId: number) => api.get(`/stats/recipe/${recipeId}`),
};

export default api;
