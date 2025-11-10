import axios from 'axios'
import { getServerSession } from 'next-auth'
import { getSession } from 'next-auth/react'
import { authOptions } from '@/libs/auth'

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

/**
 * Lấy dữ liệu dashboard cho giáo viên (Server-side)
 * @returns Promise<DashboardData>
 */
export const getTeacherDashboardServer = async (): Promise<DashboardData> => {
  try {
    const session = await getServerSession(authOptions)
    const token = session?.accessToken

    const response = await axios.get<DashboardResponse>(`${API_BASE_URL}/api/v1/dashboard/teacher`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      }
    })

    if (response.data.success && response.data.data) {
      return response.data.data
    }

    throw new Error('Failed to fetch dashboard data')
  } catch (error) {
    console.error('Error fetching teacher dashboard:', error)
    throw error
  }
}

/**
 * Lấy dữ liệu dashboard cho giáo viên (Client-side)
 * @returns Promise<DashboardData>
 */
export const getTeacherDashboard = async (): Promise<DashboardData> => {
  try {
    const session = await getSession()
    const token = session?.accessToken

    const response = await axios.get<DashboardResponse>(`${API_BASE_URL}/api/v1/dashboard/teacher`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      }
    })

    if (response.data.success && response.data.data) {
      return response.data.data
    }

    throw new Error('Failed to fetch dashboard data')
  } catch (error) {
    console.error('Error fetching teacher dashboard:', error)
    throw error
  }
}
