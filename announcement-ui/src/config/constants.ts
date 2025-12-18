// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/api/auth/login',
    REFRESH: '/api/auth/refresh',
    LOGOUT: '/api/auth/logout',
    ME: '/api/auth/me',
  },
  // Public
  PUBLIC: {
    ANNOUNCEMENTS: '/api/public/announcements',
    ANNOUNCEMENT_DETAIL: (id: number) => `/api/public/announcements/${id}`,
    ASSET_DETAIL: (id: number) => `/api/public/assets/${id}`,
    ASSET_STREAM: (id: number) => `/api/public/assets/${id}/stream`,
  },
  // Admin
  ADMIN: {
    // Users
    USERS: '/api/admin/users',
    USER_DETAIL: (id: number) => `/api/admin/users/${id}`,
    // Announcements
    ANNOUNCEMENTS: '/api/admin/announcements',
    ANNOUNCEMENT_DETAIL: (id: number) => `/api/admin/announcements/${id}`,
    // Assets
    ASSETS: '/api/admin/assets',
    ASSET_DETAIL: (id: number) => `/api/admin/assets/${id}`,
  },
} as const;

// Route paths
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  ADMIN: {
    HOME: '/admin',
    USERS: '/admin/users',
    ANNOUNCEMENTS: '/admin/announcements',
    ASSETS: '/admin/assets',
  },
  USER: {
    HOME: '/user',
    ANNOUNCEMENTS: '/user/announcements',
    ANNOUNCEMENT_DETAIL: (id: number) => `/user/announcements/${id}`,
  },
} as const;

// App metadata
export const APP_NAME = 'Digital Announcement';
export const APP_DESCRIPTION = 'Digital Announcement System';

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
