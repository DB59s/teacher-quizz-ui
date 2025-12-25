import axios from 'axios'
import { getSession } from 'next-auth/react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export interface DeleteClassQuizResponse {
  success: boolean
  message: string
}

export interface ClassQuizDetail {
  id: string
  quiz_id: string
  class_id: string
  start_time: string
  end_time: string
  quiz: {
    id: string
    name: string
    description: string
    teacher_id: string
    created_at: string
    updated_at: string
  }
  status?: string
}

export interface GetClassQuizResponse {
  success: boolean
  message: string
  data: ClassQuizDetail
}

export interface UpdateClassQuizRequest {
  start_time: string
  end_time: string
}

export interface UpdateClassQuizResponse {
  success: boolean
  message: string
  data: {
    id: string
    quiz_id: string
    class_id: string
    start_time: string
    end_time: string
    quiz_name: string
    quiz_description: string
  }
}

/**
 * Lấy chi tiết class-quiz theo ID (Client-side)
 * @param classQuizId - ID của class-quiz cần lấy
 * @returns Promise<ClassQuizDetail>
 */
export const getClassQuizDetail = async (classQuizId: string): Promise<ClassQuizDetail> => {
  try {
    const session = await getSession()
    const token = session?.accessToken

    const response = await axios.get<GetClassQuizResponse>(`${API_BASE_URL}/api/v1/class-quizzes/${classQuizId}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      }
    })

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to get class quiz detail')
    }

    return response.data.data
  } catch (error) {
    console.error('Error getting class quiz detail:', error)
    throw error
  }
}

/**
 * Cập nhật class-quiz theo ID (Client-side)
 * @param classQuizId - ID của class-quiz cần cập nhật
 * @param data - Dữ liệu cập nhật (start_time, end_time)
 * @returns Promise<UpdateClassQuizResponse['data']>
 */
export const updateClassQuiz = async (
  classQuizId: string,
  data: UpdateClassQuizRequest
): Promise<UpdateClassQuizResponse['data']> => {
  try {
    const session = await getSession()
    const token = session?.accessToken

    const response = await axios.put<UpdateClassQuizResponse>(
      `${API_BASE_URL}/api/v1/class-quizzes/${classQuizId}`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        }
      }
    )

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to update class quiz')
    }

    return response.data.data
  } catch (error) {
    console.error('Error updating class quiz:', error)
    throw error
  }
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
