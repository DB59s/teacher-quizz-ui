import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { queryKeys } from '@/libs/query-keys'
import { apiClient } from '@/libs/axios-client'

/**
 * Mutation hook to delete a question
 * @returns Mutation with optimistic update and cache invalidation
 */
export function useDeleteQuestion() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (questionId: string) => {
      await apiClient.delete(`/api/v1/questions/${questionId}`)
    },
    onMutate: async (questionId: string) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.questions.lists() })

      // Snapshot previous value
      const previousQuestions = queryClient.getQueryData(queryKeys.questions.lists())

      // Optimistically remove question from all list queries
      queryClient.setQueriesData({ queryKey: queryKeys.questions.lists() }, (old: any) => {
        if (!old?.questions) return old

        return {
          ...old,
          questions: old.questions.filter((q: any) => q.id !== questionId)
        }
      })

      return { previousQuestions }
    },
    onError: (err, questionId, context) => {
      // Rollback on error
      if (context?.previousQuestions) {
        queryClient.setQueryData(queryKeys.questions.lists(), context.previousQuestions)
      }

      toast.error('Xóa câu hỏi thất bại!', {
        position: 'bottom-right',
        autoClose: 3000
      })
    },
    onSuccess: () => {
      toast.success('Xóa câu hỏi thành công!', {
        position: 'bottom-right',
        autoClose: 3000
      })
    },
    onSettled: () => {
      // Refetch to ensure data consistency
      queryClient.invalidateQueries({ queryKey: queryKeys.questions.lists() })
    }
  })
}

/**
 * Mutation hook to create a new question
 * @returns Mutation with cache invalidation
 */
export function useCreateQuestion() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: any) => {
      const response = await apiClient.post('/api/v1/questions', payload)

      return response.data
    },
    onSuccess: () => {
      toast.success('Tạo câu hỏi thành công!', {
        position: 'bottom-right',
        autoClose: 3000
      })

      // Invalidate all question lists to trigger refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.questions.lists() })

      // Dispatch custom event for backward compatibility
      window.dispatchEvent(new Event('refreshQuestions'))
    },
    onError: error => {
      toast.error('Tạo câu hỏi thất bại!', {
        position: 'bottom-right',
        autoClose: 3000
      })
      console.error('Create question error:', error)
    }
  })
}

/**
 * Mutation hook to update an existing question
 * @returns Mutation with cache invalidation
 */
export function useUpdateQuestion() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ questionId, payload }: { questionId: string; payload: any }) => {
      const response = await apiClient.put(`/api/v1/questions/${questionId}`, payload)

      return response.data
    },
    onSuccess: (data, variables) => {
      toast.success('Cập nhật câu hỏi thành công!', {
        position: 'bottom-right',
        autoClose: 3000
      })

      // Invalidate question detail
      queryClient.invalidateQueries({ queryKey: queryKeys.questions.detail(variables.questionId) })

      // Invalidate all question lists
      queryClient.invalidateQueries({ queryKey: queryKeys.questions.lists() })

      // Dispatch custom event for backward compatibility
      window.dispatchEvent(new Event('refreshQuestions'))
    },
    onError: error => {
      toast.error('Cập nhật câu hỏi thất bại!', {
        position: 'bottom-right',
        autoClose: 3000
      })
      console.error('Update question error:', error)
    }
  })
}
