import apiClient from './client';
import { API_ENDPOINTS } from '@/config/constants';
import type { Announcement, CreateAnnouncementPayload, UpdateAnnouncementPayload } from '@/types';

export const announcementsApi = {
  // Public
  getAll: async (): Promise<Announcement[]> => {
    const response = await apiClient.get<Announcement[]>(API_ENDPOINTS.PUBLIC.ANNOUNCEMENTS);
    return response.data;
  },

  getById: async (id: number): Promise<Announcement> => {
    const response = await apiClient.get<Announcement>(API_ENDPOINTS.PUBLIC.ANNOUNCEMENT_DETAIL(id));
    return response.data;
  },

  // Admin
  create: async (data: CreateAnnouncementPayload): Promise<Announcement> => {
    const response = await apiClient.post<Announcement>(API_ENDPOINTS.ADMIN.ANNOUNCEMENTS, data);
    return response.data;
  },

  update: async (id: number, data: UpdateAnnouncementPayload): Promise<Announcement> => {
    const response = await apiClient.patch<Announcement>(API_ENDPOINTS.ADMIN.ANNOUNCEMENT_DETAIL(id), data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.ADMIN.ANNOUNCEMENT_DETAIL(id));
  },
};
