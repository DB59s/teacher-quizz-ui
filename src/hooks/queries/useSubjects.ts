import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/libs/query-keys'
import { apiClient } from '@/libs/axios-client'

interface SubjectsListParams {
  page?: number
  limit?: number
}

interface SubjectsResponse {
  success?: boolean
  data: Array<{
    id: string
    name: string
  }>
  pagination?: {
    page: number
    limit: number
    totalItems: number
    totalPages: number
  }
}

/**
 * Hook to fetch list of subjects
 * Subjects are cached for a long time since they rarely change
 * @param params - Pagination parameters (default: page=1, limit=100)
 * @returns Query result with subjects list
 */
export function useSubjects(params: SubjectsListParams = { page: 1, limit: 100 }) {
  const { page = 1, limit = 100 } = params

  return useQuery({
    queryKey: queryKeys.subjects.list({ page, limit }),
    queryFn: async () => {
      const queryString = new URLSearchParams()

      if (page) queryString.append('page', page.toString())
      if (limit) queryString.append('limit', limit.toString())

      const apiUrl = `/api/v1/subjects${queryString.toString() ? `?${queryString.toString()}` : ''}`
      const response = await apiClient.get<SubjectsResponse>(apiUrl)

      return {
        subjects: response.data?.data || [],
        pagination: response.data?.pagination || null
      }
    },
    staleTime: 60 * 60 * 1000, // 1 hour (subjects rarely change)
    gcTime: 2 * 60 * 60 * 1000 // 2 hours
  })
}
