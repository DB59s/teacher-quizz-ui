import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { queryKeys } from '@/libs/query-keys'
import { apiClient } from '@/libs/axios-client'

interface CreateClassQuizPayload {
  quiz_id: string
  class_id: string
  start_time: string
  end_time: string
}

/**
 * Mutation hook to create a new class quiz
 * @returns Mutation with cache invalidation
 */
export function useCreateClassQuiz() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateClassQuizPayload) => {
      const response = await apiClient.post('/api/v1/class-quizzes', payload)

      return response.data
    },
    onSuccess: () => {
      toast.success('Thêm quiz vào lớp thành công!', {
        position: 'bottom-right',
        autoClose: 3000
      })

      // Invalidate all class-related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.classes.all })

      // Invalidate quiz lists to update available quizzes
      queryClient.invalidateQueries({ queryKey: queryKeys.quizzes.all })
    },
    onError: error => {
      toast.error('Thêm quiz vào lớp thất bại!', {
        position: 'bottom-right',
        autoClose: 3000
      })
      console.error('Create class quiz error:', error)
    }
  })
}
