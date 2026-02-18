import axios from 'axios';
import { JobCreateRequest, JobResponse, JobListResponse, JobStatus } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth tokens if needed
api.interceptors.request.use(
  (config) => {
    // Add auth token if it exists
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API functions
export const createJob = async (data: JobCreateRequest): Promise<JobResponse> => {
  const response = await api.post<JobResponse>('/api/v1/jobs', data);
  return response.data;
};

export const getJob = async (id: string): Promise<JobResponse> => {
  const response = await api.get<JobResponse>(`/api/v1/jobs/${id}`);
  return response.data;
};

export const listJobs = async (page: number = 1, limit: number = 10): Promise<JobListResponse> => {
  const response = await api.get<JobListResponse>(`/api/v1/jobs?page=${page}&limit=${limit}`);
  return response.data;
};

export const cancelJob = async (id: string): Promise<void> => {
  await api.delete(`/api/v1/jobs/${id}`);
};

export const downloadResult = async (id: string, type: 'html' | 'text' | 'screenshot'): Promise<Blob> => {
  const response = await api.get(`/api/v1/jobs/${id}/download/${type}`, {
    responseType: 'blob',
  });
  return response.data;
};

export const previewResult = async (id: string, type: 'html' | 'text' | 'screenshot'): Promise<string> => {
  return `${API_BASE_URL}/api/v1/jobs/${id}/preview?result_type=${type}`;
};

export const createEventSource = (id: string): EventSource => {
  return new EventSource(`${API_BASE_URL}/api/v1/jobs/${id}/stream`);
};

export default api;