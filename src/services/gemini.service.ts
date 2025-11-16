import axios from 'axios'
import { getSession } from 'next-auth/react'

import type { GeminiGenerateResponse, QuizStatusResponse, CreateQuizFromAIPayload, Subject } from '@/types/gemini'

const API_BASE_URL = 'https://api.vuquangduy.io.vn'

/**
 * Upload PDF and start quiz generation (returns job_id)
 */
export const generateQuizFromPDF = async (file: File): Promise<GeminiGenerateResponse> => {
  try {
    const session = await getSession()
    const token = session?.accessToken

    const formData = new FormData()

    formData.append('file', file)

    const response = await axios.post<GeminiGenerateResponse>(`${API_BASE_URL}/api/v1/gemini/generate-quiz`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(token && { Authorization: `Bearer ${token}` })
      }
    })

    if (response.data.success) {
      return response.data
    }

    throw new Error(response.data.message || 'Failed to start quiz generation')
  } catch (error: any) {
    console.error('Error uploading PDF:', error)

    if (error.response) {
      throw new Error(error.response.data?.message || 'Failed to upload PDF')
    }

    throw error
  }
}

/**
 * Check quiz generation status by job_id
 */
export const checkQuizStatus = async (jobId: string): Promise<QuizStatusResponse> => {
  try {
    const session = await getSession()
    const token = session?.accessToken

    const response = await axios.get<QuizStatusResponse>(
      `${API_BASE_URL}/api/v1/gemini/quiz-status/${jobId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        }
      }
    )

    if (response.data.success) {
      return response.data
    }

    throw new Error(response.data.message || 'Failed to check quiz status')
  } catch (error: any) {
    console.error('Error checking quiz status:', error)

    if (error.response) {
      throw new Error(error.response.data?.message || 'Failed to check quiz status')
    }

    throw error
  }
}

/**
 * Get all subjects for teacher
 */
export const getAllSubjects = async (): Promise<Subject[]> => {
  try {
    const session = await getSession()
    const token = session?.accessToken

    const response = await axios.get(`${API_BASE_URL}/api/v1/subjects`, {
      params: {
        page: 1,
        limit: 100
      },
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      }
    })

    return response.data?.data || []
  } catch (error: any) {
    console.error('Error fetching subjects:', error)

    if (error.response) {
      throw new Error(error.response.data?.message || 'Failed to fetch subjects')
    }

    throw error
  }
}

/**
 * Create quiz from AI generated questions
 */
export const createQuizFromAI = async (payload: CreateQuizFromAIPayload): Promise<any> => {
  try {
    const session = await getSession()
    const token = session?.accessToken

    const response = await axios.post(`${API_BASE_URL}/api/v1/quizzes/from-ai`, payload, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      }
    })

    if (response.data.success) {
      return response.data
    }

    throw new Error(response.data.message || 'Failed to create quiz')
  } catch (error: any) {
    console.error('Error creating quiz from AI:', error)

    if (error.response) {
      throw new Error(error.response.data?.message || 'Failed to create quiz')
    }

    throw error
  }
}
