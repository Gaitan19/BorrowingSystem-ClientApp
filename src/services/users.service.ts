// src/services/users.service.ts
import api from './api';
import { IUser } from '../interfaces';

export const getUsers = async (): Promise<IUser[]> => {
  const response = await api.get('/Users');
  return response.data;
};

export const createUser = async (userData: {
  name: string;
  email: string;
  password: string;
  role: string;
}): Promise<IUser> => {
  const response = await api.post('/Users', userData);
  return response.data;
};

export const updateUser = async (id: string, userData: {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
}): Promise<IUser> => {
  const response = await api.put(`/Users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id: string): Promise<void> => {
  await api.delete(`/Users/${id}`);
};