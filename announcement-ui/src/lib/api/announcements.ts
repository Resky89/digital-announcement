import apiClient from './client';
import { API_ENDPOINTS } from '@/config/constants';
import type { Announcement, CreateAnnouncementPayload, UpdateAnnouncementPayload } from '@/types';

export const announcementsApi = {
  // Public
  getAll: async (): Promise<Announcement[]> => {
    const response = await apiClient.get(API_ENDPOINTS.PUBLIC.ANNOUNCEMENTS);
    const payload: any = response.data;
    const list =
      Array.isArray(payload) ? payload :
      Array.isArray(payload?.data) ? payload.data :
      Array.isArray(payload?.results) ? payload.results :
      Array.isArray(payload?.items) ? payload.items :
      Array.isArray(payload?.announcements) ? payload.announcements :
      Array.isArray(payload?.data?.data) ? payload.data.data : [];
    return list as Announcement[];
  },

  getById: async (id: number): Promise<Announcement> => {
    const response = await apiClient.get(API_ENDPOINTS.PUBLIC.ANNOUNCEMENT_DETAIL(id));
    const payload: any = response.data;
    const obj =
      (payload && typeof payload === 'object' && payload.data) ? payload.data :
      (payload && typeof payload === 'object' && payload.announcement) ? payload.announcement :
      payload;
    return obj as Announcement;
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
