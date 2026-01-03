import apiClient from './client';
import { API_ENDPOINTS } from '@/config/constants';
import type { Asset } from '@/types';

export const assetsApi = {
  // Public
  getById: async (id: number): Promise<Asset> => {
    const response = await apiClient.get<Asset>(API_ENDPOINTS.PUBLIC.ASSET_DETAIL(id));
    return response.data;
  },

  getStreamUrl: (id: number): string => {
    return `${API_ENDPOINTS.PUBLIC.ASSET_STREAM(id)}`;
  },

  // Admin
  list: async (): Promise<Asset[]> => {
    const response = await apiClient.get(API_ENDPOINTS.ADMIN.ASSETS);
    const payload: any = response.data;
    return Array.isArray(payload) ? payload : (Array.isArray(payload?.data) ? payload.data : []);
  },

  create: async (fileName: string, file: File): Promise<Asset> => {
    const formData = new FormData();
    formData.append('file_name', fileName);
    formData.append('file', file);

    const response = await apiClient.post<Asset>(
      API_ENDPOINTS.ADMIN.ASSETS,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
  },

  update: async (id: number, params: { fileName?: string; file?: File }): Promise<Asset> => {
    const formData = new FormData();
    if (params.fileName !== undefined) formData.append('file_name', params.fileName);
    if (params.file) formData.append('file', params.file);

    const response = await apiClient.put<Asset>(
      API_ENDPOINTS.ADMIN.ASSET_DETAIL(id),
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.ADMIN.ASSET_DETAIL(id));
  },
};
