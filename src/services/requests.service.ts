import api from './api';
import { IRequest } from '../interfaces';

export const getRequests = async (): Promise<IRequest[]> => {
  const response = await api.get('/Requests');
  return response.data;
};

export const getRequestById = async (id: string): Promise<IRequest> => {
  const response = await api.get(`/Requests/${id}`);
  return response.data;
};

export const createRequest = async (data: Omit<IRequest, 'id'>): Promise<IRequest> => {
  const response = await api.post('/Requests', data);
  return response.data;
};

export const updateRequest = async (id: string, data: Partial<IRequest>): Promise<IRequest> => {
  const response = await api.put(`/Requests/${id}`, data);
  return response.data;
};

export const deleteRequest = async (id: string): Promise<void> => {
  await api.delete(`/Requests/${id}`);
};

export const approveRejectRequest = async (requestId: string, isApproved: boolean): Promise<void> => {
  await api.post('/Requests/approve-reject', { requestId, isApproved });
};

export const returnRequest = async (requestId: string): Promise<void> => {
  await api.post(`/Requests/return/${requestId}`);
};