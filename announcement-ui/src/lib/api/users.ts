import apiClient from './client';
import { API_ENDPOINTS } from '@/config/constants';
import type { User, CreateUserPayload, UpdateUserPayload } from '@/types';

export const usersApi = {
  getAll: async (params?: { search?: string; per_page?: number; page?: number }): Promise<User[]> => {
    const response = await apiClient.get(API_ENDPOINTS.ADMIN.USERS, { params });
    const payload: any = response.data;
    const list =
      Array.isArray(payload) ? payload :
      Array.isArray(payload?.data) ? payload.data :
      Array.isArray(payload?.results) ? payload.results :
      Array.isArray(payload?.items) ? payload.items : [];
    return list as User[];
  },

  getById: async (id: number): Promise<User> => {
    const response = await apiClient.get<User>(API_ENDPOINTS.ADMIN.USER_DETAIL(id));
    return response.data;
  },

  create: async (data: CreateUserPayload): Promise<User> => {
    const response = await apiClient.post<User>(API_ENDPOINTS.ADMIN.USERS, data);
    return response.data;
  },

  update: async (id: number, data: UpdateUserPayload): Promise<User> => {
    const response = await apiClient.patch<User>(API_ENDPOINTS.ADMIN.USER_DETAIL(id), data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.ADMIN.USER_DETAIL(id));
  },
};
