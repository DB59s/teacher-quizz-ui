import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { queryKeys } from '@/libs/query-keys'
import { deleteQuiz, updateQuiz, type UpdateQuizPayload } from '@/services/quiz.service'

/**
 * Mutation hook to delete a quiz
 * @returns Mutation with optimistic update and cache invalidation
 */
export function useDeleteQuiz() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteQuiz,
    onMutate: async (quizId: string) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.quizzes.lists() })

      // Snapshot previous value
      const previousQuizzes = queryClient.getQueryData(queryKeys.quizzes.lists())

      // Optimistically update to remove quiz from all list queries
      queryClient.setQueriesData({ queryKey: queryKeys.quizzes.lists() }, (old: any) => {
        if (!old?.quizzes) return old

        return {
          ...old,
          quizzes: old.quizzes.filter((quiz: any) => quiz.id !== quizId && quiz._id !== quizId)
        }
      })

      return { previousQuizzes }
    },
    onError: (err, quizId, context) => {
      // Rollback on error
      if (context?.previousQuizzes) {
        queryClient.setQueryData(queryKeys.quizzes.lists(), context.previousQuizzes)
      }

      toast.error('Xóa quiz thất bại!', {
        position: 'bottom-right',
        autoClose: 3000
      })
    },
    onSuccess: () => {
      toast.success('Xóa quiz thành công!', {
        position: 'bottom-right',
        autoClose: 3000
      })
    },
    onSettled: () => {
      // Refetch to ensure data consistency
      queryClient.invalidateQueries({ queryKey: queryKeys.quizzes.lists() })
    }
  })
}

/**
 * Mutation hook to update a quiz
 * @returns Mutation with cache invalidation
 */
export function useUpdateQuiz() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ quizId, payload }: { quizId: string; payload: UpdateQuizPayload }) => updateQuiz(quizId, payload),
    onSuccess: (data, variables) => {
      toast.success('Cập nhật quiz thành công!', {
        position: 'bottom-right',
        autoClose: 3000
      })

      // Invalidate and refetch quiz detail
      queryClient.invalidateQueries({ queryKey: queryKeys.quizzes.detail(variables.quizId) })

      // Invalidate quiz lists
      queryClient.invalidateQueries({ queryKey: queryKeys.quizzes.lists() })
    },
    onError: error => {
      toast.error('Cập nhật quiz thất bại!', {
        position: 'bottom-right',
        autoClose: 3000
      })
      console.error('Update quiz error:', error)
    }
  })
}
