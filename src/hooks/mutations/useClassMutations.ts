import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { queryKeys } from '@/libs/query-keys'
import {
  approveStudent,
  rejectStudent,
  removeStudentFromClass,
  updateClass,
  deleteClass,
  type UpdateClassPayload
} from '@/services/class.service'

/**
 * Mutation hook to approve a student registration
 */
export function useApproveStudent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: approveStudent,
    onSuccess: () => {
      toast.success('Phê duyệt học sinh thành công!', {
        position: 'bottom-right',
        autoClose: 3000
      })

      // Invalidate class students to show updated status
      queryClient.invalidateQueries({ queryKey: queryKeys.classes.all })
    },
    onError: error => {
      toast.error('Phê duyệt học sinh thất bại!', {
        position: 'bottom-right',
        autoClose: 3000
      })
      console.error('Approve student error:', error)
    }
  })
}

/**
 * Mutation hook to reject a student registration
 */
export function useRejectStudent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: rejectStudent,
    onSuccess: () => {
      toast.success('Từ chối học sinh thành công!', {
        position: 'bottom-right',
        autoClose: 3000
      })

      // Invalidate class students
      queryClient.invalidateQueries({ queryKey: queryKeys.classes.all })
    },
    onError: error => {
      toast.error('Từ chối học sinh thất bại!', {
        position: 'bottom-right',
        autoClose: 3000
      })
      console.error('Reject student error:', error)
    }
  })
}

/**
 * Mutation hook to remove a student from class
 */
export function useRemoveStudent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: removeStudentFromClass,
    onSuccess: () => {
      toast.success('Xóa học sinh khỏi lớp thành công!', {
        position: 'bottom-right',
        autoClose: 3000
      })

      // Invalidate class students
      queryClient.invalidateQueries({ queryKey: queryKeys.classes.all })
    },
    onError: error => {
      toast.error('Xóa học sinh thất bại!', {
        position: 'bottom-right',
        autoClose: 3000
      })
      console.error('Remove student error:', error)
    }
  })
}

/**
 * Mutation hook to update class details
 */
export function useUpdateClass() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ classId, payload }: { classId: string; payload: UpdateClassPayload }) =>
      updateClass(classId, payload),
    onSuccess: (_, variables) => {
      toast.success('Cập nhật lớp học thành công!', {
        position: 'bottom-right',
        autoClose: 3000
      })

      // Invalidate class detail
      queryClient.invalidateQueries({ queryKey: queryKeys.classes.detail(variables.classId) })

      // Invalidate class lists
      queryClient.invalidateQueries({ queryKey: queryKeys.classes.lists() })
    },
    onError: error => {
      toast.error('Cập nhật lớp học thất bại!', {
        position: 'bottom-right',
        autoClose: 3000
      })
      console.error('Update class error:', error)
    }
  })
}

/**
 * Mutation hook to delete a class
 */
export function useDeleteClass() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteClass,
    onSuccess: () => {
      toast.success('Xóa lớp học thành công!', {
        position: 'bottom-right',
        autoClose: 3000
      })

      // Invalidate all class queries
      queryClient.invalidateQueries({ queryKey: queryKeys.classes.all })
    },
    onError: error => {
      toast.error('Xóa lớp học thất bại!', {
        position: 'bottom-right',
        autoClose: 3000
      })
      console.error('Delete class error:', error)
    }
  })
}
