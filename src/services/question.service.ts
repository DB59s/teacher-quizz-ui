import axios from 'axios'

import { getSession } from 'next-auth/react'

const API_BASE_URL = 'https://api.vuquangduy.io.vn'

export interface Answer {
  id: string
  content: string
  is_true: boolean
}

export interface QuestionDetail {
  id: string
  content: string
  level: number
  type: string
  teacher_id: string
  created_at: string
  updated_at: string
  answers: Answer[]
  subject_ids: string[]
}

export interface QuestionDetailResponse {
  success?: boolean
  message?: string
  data?: QuestionDetail
}

/**
 * Lấy chi tiết câu hỏi theo ID (Client-side)
 * @param questionId - ID của câu hỏi
 * @returns Promise<QuestionDetail>
 */
export const getQuestionDetail = async (questionId: string): Promise<QuestionDetail> => {
  try {
    const session = await getSession()
    const token = session?.accessToken

    const response = await axios.get<QuestionDetailResponse | QuestionDetail>(
      `${API_BASE_URL}/api/v1/questions/${questionId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        }
      }
    )

    // Handle response with wrapper { success: true, data: {...} }
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      const wrappedResponse = response.data as QuestionDetailResponse

      if (wrappedResponse.data) {
        return wrappedResponse.data
      }
    }

    // Handle direct response (response is QuestionDetail directly)
    if (response.data && typeof response.data === 'object' && 'id' in response.data) {
      return response.data as QuestionDetail
    }

    throw new Error('Failed to fetch question detail: Invalid response format')
  } catch (error: any) {
    console.error('Error fetching question detail:', error)
    if (error.response) {
      console.error('Response status:', error.response.status)
      console.error('Response data:', error.response.data)
      throw new Error(error.response.data?.message || 'Failed to fetch question detail')
    }

    throw error
  }
}
