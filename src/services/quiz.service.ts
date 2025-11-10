import axios from 'axios'

import { getSession } from 'next-auth/react'

const API_BASE_URL = 'https://api.vuquangduy.io.vn'

export interface Answer {
  id: string
  content: string
  is_true: boolean
}

export interface Question {
  id: string
  content: string
  level: number
  type: string
  teacher_id: string
  created_at: string
  updated_at: string
  answers: Answer[]
}

export interface QuizDetail {
  id: string
  name: string
  description: string
  teacher_id: string
  created_at: string
  updated_at: string
  questions: Question[]
}

export interface QuizDetailResponse {
  success: boolean
  message: string
  data: QuizDetail
}

/**
 * Lấy chi tiết quiz theo ID (Client-side)
 * @param quizId - ID của quiz
 * @returns Promise<QuizDetail>
 */
export const getQuizDetail = async (quizId: string): Promise<QuizDetail> => {
  try {
    const session = await getSession()
    const token = session?.accessToken

    const response = await axios.get<QuizDetailResponse>(`${API_BASE_URL}/api/v1/quizzes/${quizId}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      }
    })

    if (response.data.success && response.data.data) {
      return response.data.data
    }

    throw new Error('Failed to fetch quiz detail')
  } catch (error) {
    console.error('Error fetching quiz detail:', error)
    throw error
  }
}

export interface DeleteQuizResponse {
  success: boolean
  message: string
}

export interface UpdateQuizPayload {
  name: string
  description: string
  question_ids: string[]
}

export interface UpdateQuizResponse {
  success: boolean
  message: string
  data?: QuizDetail
}

/**
 * Xóa quiz theo ID (Client-side)
 * @param quizId - ID của quiz cần xóa
 * @returns Promise<void>
 */
export const deleteQuiz = async (quizId: string): Promise<void> => {
  try {
    const session = await getSession()
    const token = session?.accessToken

    const response = await axios.delete<DeleteQuizResponse>(`${API_BASE_URL}/api/v1/quizzes/${quizId}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      }
    })

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to delete quiz')
    }
  } catch (error) {
    console.error('Error deleting quiz:', error)
    throw error
  }
}

/**
 * Cập nhật quiz (Client-side)
 * @param quizId - ID của quiz cần cập nhật
 * @param payload - Dữ liệu cập nhật
 * @returns Promise<QuizDetail>
 */
export const updateQuiz = async (quizId: string, payload: UpdateQuizPayload): Promise<QuizDetail> => {
  try {
    const session = await getSession()
    const token = session?.accessToken

    const response = await axios.put<UpdateQuizResponse>(`${API_BASE_URL}/api/v1/quizzes/${quizId}`, payload, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      }
    })

    if (response.data.success && response.data.data) {
      return response.data.data
    }

    throw new Error(response.data.message || 'Failed to update quiz')
  } catch (error) {
    console.error('Error updating quiz:', error)
    throw error
  }
}
