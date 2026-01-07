import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/libs/query-keys'
import { apiClient } from '@/libs/axios-client'
import type { QuizDetail } from '@/services/quiz.service'

interface QuizzesListParams {
  page?: number
  limit?: number
}

interface QuizzesResponse {
  success: boolean
  data: any[]
  pagination: {
    page: number
    limit: number
    totalItems: number
    totalPages: number
  }
}

/**
 * Hook to fetch paginated list of quizzes
 * @param params - Pagination parameters
 * @returns Query result with quizzes list and pagination data
 */
export function useQuizzes(params: QuizzesListParams = {}) {
  const { page = 1, limit = 10 } = params

  return useQuery({
    queryKey: queryKeys.quizzes.list({ page, limit }),
    queryFn: async () => {
      const queryString = new URLSearchParams()

      if (page) queryString.append('page', page.toString())
      if (limit) queryString.append('limit', limit.toString())

      const apiUrl = `/api/v1/quizzes${queryString.toString() ? `?${queryString.toString()}` : ''}`
      const response = await apiClient.get<QuizzesResponse>(apiUrl)

      return {
        quizzes: response.data?.data || [],
        pagination: response.data?.pagination || null
      }
    },
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: previousData => previousData // Keep previous data while fetching
  })
}

interface QuizDetailResponse {
  success: boolean
  message: string
  data: QuizDetail
}

/**
 * Hook to fetch quiz detail by ID
 * @param quizId - Quiz ID to fetch
 * @returns Query result with quiz detail including questions
 */
export function useQuizDetail(quizId: string | null) {
  return useQuery({
    queryKey: queryKeys.quizzes.detail(quizId || ''),
    queryFn: async () => {
      const response = await apiClient.get<QuizDetailResponse>(`/api/v1/quizzes/${quizId}`)

      if (response.data.success && response.data.data) {
        return response.data.data
      }

      throw new Error('Failed to fetch quiz detail')
    },
    enabled: !!quizId, // Only run query if quizId is provided
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000 // 10 minutes
  })
}
