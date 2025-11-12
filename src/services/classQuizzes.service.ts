import axios from 'axios'
import { getSession } from 'next-auth/react'

const API_BASE_URL = 'https://api.vuquangduy.io.vn'

export interface DeleteClassQuizResponse {
  success: boolean
  message: string
}

/**
 * Xóa class-quiz theo ID (Client-side)
 * @param classQuizId - ID của class-quiz cần xóa
 * @returns Promise<void>
 */
export const deleteClassQuiz = async (classQuizId: string): Promise<void> => {
  try {
    const session = await getSession()
    const token = session?.accessToken

    const response = await axios.delete<DeleteClassQuizResponse>(
      `${API_BASE_URL}/api/v1/class-quizzes/${classQuizId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        }
      }
    )

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to delete class quiz')
    }
  } catch (error) {
    console.error('Error deleting class quiz:', error)
    throw error
  }
}
