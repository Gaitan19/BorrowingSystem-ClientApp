// src/services/items.service.ts
import api from './api';
import { IItem } from '../interfaces';

export const getItems = async (page?: number, pageSize?: number): Promise<IItem[]> => {
  const params = new URLSearchParams();
  if (page) params.append('page', page.toString());
  if (pageSize) params.append('pageSize', pageSize.toString());
  
  const response = await api.get('/Items', { params });
  return response.data;
};

export const getItemById = async (id: string): Promise<IItem> => {
  const response = await api.get(`/Items/${id}`);
  return response.data;
};

export const createItem = async (itemData: Omit<IItem, 'id'>): Promise<IItem> => {
  const response = await api.post('/Items', itemData);
  return response.data;
};

export const updateItem = async (id: string, itemData: Partial<IItem>): Promise<IItem> => {
  const response = await api.put(`/Items/${id}`, itemData);
  return response.data;
};

export const deleteItem = async (id: string): Promise<void> => {
  await api.delete(`/Items/${id}`);
};