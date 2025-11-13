import { getServerSession } from 'next-auth'
import { getSession, signOut } from 'next-auth/react'

import axios, { type AxiosInstance } from 'axios'

import { authOptions } from '@/libs/auth'
import { applyInterceptors } from '@/libs/api-interceptors'

export interface DashboardKPI {
  total_classes: number
  total_students: number
  total_quizzes: number
  total_questions: number
}

export interface ScoreDistributionItem {
  range: string
  count: number
}

export interface DashboardData {
  kpi: DashboardKPI
  score_distribution_chart: ScoreDistributionItem[]
}

export interface DashboardResponse {
  success: boolean
  data: DashboardData
}

const API_BASE_URL = 'https://api.vuquangduy.io.vn'

// Create axios instance for dashboard service with interceptors
let dashboardServerInstance: AxiosInstance | null = null

const getDashboardServerInstance = (): AxiosInstance => {
  if (!dashboardServerInstance) {
    dashboardServerInstance = axios.create({
      baseURL: API_BASE_URL
    })
    applyInterceptors(dashboardServerInstance)
  }

  return dashboardServerInstance
}

/**
 * Custom error class for authentication errors
 */
export class AuthenticationError extends Error {
  constructor(message: string = 'Authentication required') {
    super(message)
    this.name = 'AuthenticationError'
  }
}

/**
 * Lấy dữ liệu dashboard cho giáo viên (Server-side)
 * @returns Promise<DashboardData>
 */
export const getTeacherDashboardServer = async (): Promise<DashboardData> => {
  const session = await getServerSession(authOptions)

  if (!session?.accessToken) {
    throw new AuthenticationError('No access token available')
  }

  try {
    const instance = getDashboardServerInstance()

    const response = await instance.get<DashboardResponse>('/api/v1/dashboard/teacher', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.accessToken}`
      }
    })

    if (response.data.success && response.data.data) {
      return response.data.data
    }

    throw new Error('Failed to fetch dashboard data')
  } catch (error: any) {
    // Re-throw redirect errors (NEXT_REDIRECT) - don't catch them
    if (error && typeof error === 'object' && 'digest' in error && error.digest?.startsWith('NEXT_REDIRECT')) {
      throw error
    }

    // Handle 401 errors - token is invalid/expired
    if (error.response?.status === 401) {
      // Return null or throw error to signal invalid session
      // Component will handle the error and redirect
      throw new AuthenticationError('Token expired or invalid. Please log in again.')
    }

    console.error('Error fetching teacher dashboard:', error)
    throw error
  }
}

// Create axios instance for client-side dashboard service
let dashboardClientInstance: AxiosInstance | null = null

const getDashboardClientInstance = (): AxiosInstance => {
  if (!dashboardClientInstance) {
    dashboardClientInstance = axios.create({
      baseURL: API_BASE_URL
    })
    applyInterceptors(dashboardClientInstance)
  }

  return dashboardClientInstance
}

/**
 * Lấy dữ liệu dashboard cho giáo viên (Client-side)
 * @returns Promise<DashboardData>
 */
export const getTeacherDashboard = async (): Promise<DashboardData> => {
  try {
    const session = await getSession()
    const token = session?.accessToken

    if (!token) {
      await signOut({ callbackUrl: '/login', redirect: true })
      throw new Error('No access token available')
    }

    const instance = getDashboardClientInstance()

    const response = await instance.get<DashboardResponse>('/api/v1/dashboard/teacher', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })

    if (response.data.success && response.data.data) {
      return response.data.data
    }

    throw new Error('Failed to fetch dashboard data')
  } catch (error: any) {
    // Handle 401 errors - sign out and redirect
    if (error.response?.status === 401) {
      await signOut({ callbackUrl: '/login', redirect: true })
    }

    console.error('Error fetching teacher dashboard:', error)
    throw error
  }
}
