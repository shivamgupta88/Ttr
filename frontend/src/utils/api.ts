import axios from 'axios';
import { PageContent, ApiResponse, FilterOptions } from '@/types';

const API_BASE_URL = process.env.BACKEND_URL || 'http://localhost:6000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const pagesApi = {
  // Get all pages with filters and pagination
  getPages: async (filters: FilterOptions = {}) => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    const response = await api.get<ApiResponse<PageContent[]>>(`/api/pages?${params}`);
    return response.data;
  },

  // Get single page by slug
  getPageBySlug: async (slug: string) => {
    const response = await api.get<ApiResponse<PageContent>>(`/api/pages/${slug}`);
    return response.data;
  },

  // Get random pages for featured content
  getRandomPages: async (limit: number = 6) => {
    const response = await api.get<ApiResponse<PageContent[]>>(`/api/pages/random?limit=${limit}`);
    return response.data;
  },

  // Search pages
  searchPages: async (query: string, filters: Omit<FilterOptions, 'search'> = {}) => {
    const params = new URLSearchParams({ search: query });
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    const response = await api.get<ApiResponse<PageContent[]>>(`/api/pages/search?${params}`);
    return response.data;
  },

  // Get page analytics
  getAnalytics: async () => {
    const response = await api.get<ApiResponse<any>>('/api/analytics');
    return response.data;
  },

  // Get unique values for filters
  getFilterOptions: async () => {
    const response = await api.get<ApiResponse<any>>('/api/pages/filters');
    return response.data;
  }
};

export default api;