import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/libs/query-keys'
import { getTeacherDashboard } from '@/services/dashboard.service'

/**
 * Hook to fetch teacher dashboard data
 * @returns Query result with dashboard KPI and charts
 */
export function useTeacherDashboard() {
  return useQuery({
    queryKey: queryKeys.dashboard.teacher(),
    queryFn: getTeacherDashboard,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    retry: 2 // Retry twice on failure
  })
}
