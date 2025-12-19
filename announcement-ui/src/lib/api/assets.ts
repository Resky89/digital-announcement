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
  create: async (announcementId: number, file: File): Promise<Asset> => {
    const formData = new FormData();
    formData.append('announcement_id', String(announcementId));
    formData.append('file', file);

    const response = await apiClient.post<Asset>(
      API_ENDPOINTS.ADMIN.ASSETS,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.ADMIN.ASSET_DETAIL(id));
  },
};
