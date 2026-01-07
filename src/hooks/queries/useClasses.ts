import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/libs/query-keys'
import { apiClient } from '@/libs/axios-client'
import { getClassStudents } from '@/services/class.service'

interface ClassDetail {
  id: string
  name: string
  description: string
  status: string
  teacher_id: string
  created_at: string
  updated_at: string
  [key: string]: any
}

interface ClassDetailResponse {
  success?: boolean
  data?: ClassDetail
}

/**
 * Hook to fetch class detail by ID
 * @param classId - Class ID to fetch
 * @returns Query result with class detail
 */
export function useClassDetail(classId: string | null) {
  return useQuery({
    queryKey: queryKeys.classes.detail(classId || ''),
    queryFn: async () => {
      const response = await apiClient.get<ClassDetailResponse>(`/api/v1/classes/details/${classId}`)

      return response.data?.data || null
    },
    enabled: !!classId, // Only run query if classId is provided
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000 // 10 minutes
  })
}

/**
 * Hook to fetch students in a class
 * @param classId - Class ID to fetch students for
 * @returns Query result with students list
 */
export function useClassStudents(classId: string | null) {
  return useQuery({
    queryKey: queryKeys.classes.students(classId || ''),
    queryFn: () => getClassStudents(classId || ''),
    enabled: !!classId,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000 // 5 minutes
  })
}

interface ClassesListParams {
  page?: number
  limit?: number
}

interface ClassesResponse {
  success?: boolean
  data: any[]
  pagination?: {
    page: number
    limit: number
    totalItems: number
    totalPages: number
  }
}

/**
 * Hook to fetch list of teacher's classes
 * @param params - Pagination parameters
 * @returns Query result with classes list
 */
export function useClasses(params: ClassesListParams = {}) {
  const { page = 1, limit = 10 } = params

  return useQuery({
    queryKey: queryKeys.classes.list({ page, limit }),
    queryFn: async () => {
      const queryString = new URLSearchParams()

      if (page) queryString.append('page', page.toString())
      if (limit) queryString.append('limit', limit.toString())

      const apiUrl = `/api/v1/classes/teachers${queryString.toString() ? `?${queryString.toString()}` : ''}`
      const response = await apiClient.get<ClassesResponse>(apiUrl)

      return {
        classes: response.data?.data || [],
        pagination: response.data?.pagination || null
      }
    },
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000 // 5 minutes
  })
}
