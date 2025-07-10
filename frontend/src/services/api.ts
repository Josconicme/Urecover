import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { toast } from 'react-hot-toast';

// Types
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
}

class ApiService {
  private api: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1';
    
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        return response.data;
      },
      async (error) => {
        const originalRequest = error.config;

        // Handle 401 errors (token expired)
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
              const response = await axios.post(`${this.baseURL}/auth/refresh`, {
                refreshToken
              });

              const { session } = response.data;
              localStorage.setItem('access_token', session.access_token);
              localStorage.setItem('refresh_token', session.refresh_token);

              // Retry original request
              originalRequest.headers.Authorization = `Bearer ${session.access_token}`;
              return this.api(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, redirect to login
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        // Handle other errors
        const message = error.response?.data?.message || error.response?.data?.error || error.message || 'An error occurred';
        
        // Don't show toast for certain errors
        const silentErrors = [401, 403];
        if (!silentErrors.includes(error.response?.status)) {
          toast.error(message);
        }

        return Promise.reject(error);
      }
    );
  }

  // Generic HTTP methods
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.api.get(url, config);
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.api.post(url, data, config);
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.api.put(url, data, config);
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.api.patch(url, data, config);
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.api.delete(url, config);
  }

  getApi(): AxiosInstance {
    return this.api;
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;

// Export specific API modules
export * from './modules/auth';
export * from './modules/counsellors';
export * from './modules/appointments';
export * from './modules/wellness';
export * from './modules/blogs';
export * from './modules/articles';
export * from './modules/resources';
export * from './modules/messages';
export * from './modules/notifications';
export * from './modules/goals';
export * from './modules/testimonials';
export * from './modules/admin';