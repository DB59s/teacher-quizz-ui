import { getServerSession } from 'next-auth'

import { authOptions } from '@/libs/auth'
import { fetchApi } from '@/libs/fetchApi'
import { apiClient } from '@/libs/axios-client'

export interface UserProfileResponse {
  success: boolean
  message: string
  data: {
    _id: string
    account_id: string
    email: string
    full_name: string
    department: string
    university: string
    phone_number: string
    profile_completed: boolean
    created_at: string
    updated_at: string
    __v: number
  }
}

/**
 * Lấy thông tin profile của user hiện tại (Server-side)
 */
export const getUserProfileServer = async (): Promise<UserProfileResponse['data']> => {
  const session = await getServerSession(authOptions)

  if (!session?.accessToken) {
    throw new Error('No access token available')
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.accessToken}`
    }
  })

  if (!response.ok) {
    throw new Error('Failed to fetch user profile')
  }

  const data: UserProfileResponse = await response.json()

  if (data.success && data.data) {
    return data.data
  }

  throw new Error('Invalid response format')
}

/**
 * Lấy thông tin profile của user hiện tại (Client-side)
 */
export const getUserProfile = async (): Promise<UserProfileResponse['data']> => {
  const response = await fetchApi(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/me`, {
    method: 'GET'
  })

  if (!response.ok) {
    throw new Error('Failed to fetch user profile')
  }

  const data: UserProfileResponse = await response.json()

  if (data.success && data.data) {
    return data.data
  }

  throw new Error('Invalid response format')
}

export type UpdateUserProfileData = {
  full_name?: string
  department?: string
  university?: string
  phone_number?: string
}

/**
 * Cập nhật thông tin profile của user hiện tại (Client-side)
 */
export const updateUserProfile = async (data: UpdateUserProfileData): Promise<UserProfileResponse['data']> => {
  const response = await apiClient.patch<UserProfileResponse>('https://api.vuquangduy.io.vn/api/v1/users/me', data)

  const responseData = response.data

  if (responseData && responseData.success && responseData.data) {
    return responseData.data
  }

  throw new Error('Failed to update user profile')
}
