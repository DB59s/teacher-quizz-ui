import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { getUserProfile, updateUserProfile, type UpdateUserProfileData } from '@/services/user.service'
import { toast } from 'react-toastify'

/**
 * Query key for user profile
 */
export const userProfileKeys = {
  profile: ['user', 'profile'] as const
}

/**
 * Hook to fetch current user's profile
 * @returns Query result with user profile data
 */
export function useUserProfile() {
  return useQuery({
    queryKey: userProfileKeys.profile,
    queryFn: getUserProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes - profile data rarely changes
    gcTime: 10 * 60 * 1000 // 10 minutes
  })
}

/**
 * Mutation hook to update user profile
 * @returns Mutation for updating profile with cache invalidation
 */
export function useUpdateUserProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateUserProfileData) => updateUserProfile(data),
    onSuccess: () => {
      toast.success('Cập nhật thông tin thành công!', {
        position: 'bottom-right',
        autoClose: 3000
      })

      // Invalidate user profile to trigger refetch
      queryClient.invalidateQueries({ queryKey: userProfileKeys.profile })
    },
    onError: error => {
      toast.error('Cập nhật thông tin thất bại!', {
        position: 'bottom-right',
        autoClose: 3000
      })
      console.error('Update user profile error:', error)
    }
  })
}
