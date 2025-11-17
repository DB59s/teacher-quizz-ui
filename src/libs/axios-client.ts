import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'

import { applyInterceptors } from './api-interceptors'

const isClient = typeof window !== 'undefined'

// Create axios instance
const axiosClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Apply centralized interceptors (includes auth, error handling, etc.)
if (isClient) {
  applyInterceptors(axiosClient)
}

// Helper functions for common requests
export const apiClient = {
  get: <T = any>(url: string, config?: AxiosRequestConfig) => axiosClient.get<T>(url, config),
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => axiosClient.post<T>(url, data, config),
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => axiosClient.put<T>(url, data, config),
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => axiosClient.patch<T>(url, data, config),
  delete: <T = any>(url: string, config?: AxiosRequestConfig) => axiosClient.delete<T>(url, config)
}

// Utility function to clear session storage
export const clearSessionStorage = () => {
  if (isClient) {
    sessionStorage.clear()
  }
}

export default axiosClient
