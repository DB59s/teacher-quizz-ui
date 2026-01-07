import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/libs/query-keys'
import { apiClient } from '@/libs/axios-client'
import type { QuestionDetail } from '@/services/question.service'

interface QuestionsListParams {
  page?: number
  limit?: number
  search?: string
  level?: string
  subject_id?: string
}

interface QuestionsResponse {
  success?: boolean
  data: any[]
  pagination: {
    page: number
    limit: number
    totalItems: number
    totalPages: number
  }
}

/**
 * Hook to fetch paginated and filtered list of questions
 * @param params - Pagination and filter parameters
 * @returns Query result with questions list and pagination data
 */
export function useQuestions(params: QuestionsListParams = {}) {
  const { page = 1, limit = 10, search, level, subject_id } = params

  return useQuery({
    queryKey: queryKeys.questions.list({ page, limit, search, level, subject_id }),
    queryFn: async () => {
      const queryString = new URLSearchParams()

      if (page) queryString.append('page', page.toString())
      if (limit) queryString.append('limit', limit.toString())
      if (search) queryString.append('search', search)
      if (level) queryString.append('level', level)
      if (subject_id) queryString.append('subject_id', subject_id)

      const apiUrl = `/api/v1/questions${queryString.toString() ? `?${queryString.toString()}` : ''}`
      const response = await apiClient.get<QuestionsResponse>(apiUrl)

      return {
        questions: response.data?.data || [],
        pagination: response.data?.pagination || null
      }
    },
    staleTime: 30 * 1000, // 30 seconds (questions might change frequently)
    gcTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: previousData => previousData // Keep previous data while fetching
  })
}

interface QuestionDetailResponse {
  success?: boolean
  message?: string
  data?: QuestionDetail
}

/**
 * Hook to fetch question detail by ID
 * @param questionId - Question ID to fetch
 * @returns Query result with question detail including answers
 */
export function useQuestionDetail(questionId: string | null) {
  return useQuery({
    queryKey: queryKeys.questions.detail(questionId || ''),
    queryFn: async () => {
      const response = await apiClient.get<QuestionDetailResponse | QuestionDetail>(`/api/v1/questions/${questionId}`)

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
    },
    enabled: !!questionId, // Only run query if questionId is provided
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000 // 10 minutes
  })
}
