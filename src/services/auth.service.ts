import api from './api';

export const login = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const register = async (userData: {
  name: string;
  email: string;
  password: string;
  role: string;
}) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};