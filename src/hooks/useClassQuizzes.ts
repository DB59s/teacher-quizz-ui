import { useEffect, useState, useCallback } from 'react'

import { apiClient } from '@/libs/axios-client'

type ClassQuiz = {
  id: string
  quiz_id: string
  class_id: string
  start_time: string
  end_time: string
  created_at: string
  updated_at: string
}

type UseClassQuizzesReturn = {
  classQuizzes: ClassQuiz[]
  quizIds: string[]
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

/**
 * Hook to fetch class quizzes for a specific class
 * @param classId - The ID of the class
 * @returns Object containing classQuizzes, quizIds (array of quiz IDs), loading, error, and refetch function
 */
export default function useClassQuizzes(classId: string | null | undefined): UseClassQuizzesReturn {
  const [classQuizzes, setClassQuizzes] = useState<ClassQuiz[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchClassQuizzes = useCallback(async () => {
    if (!classId) {
      setClassQuizzes([])
      setError(null)

      return
    }

    setLoading(true)
    setError(null)

    try {
      // Fetch all class quizzes without pagination to get complete list
      const { data } = await apiClient.get(
        `/api/v1/class-quizzes/class/${classId}?page=1&limit=1000`
      )

      const quizzes = data?.data || []

      setClassQuizzes(quizzes)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred')

      setError(error)
      console.error('Error fetching class quizzes:', err)
    } finally {
      setLoading(false)
    }
  }, [classId])

  useEffect(() => {
    fetchClassQuizzes()
  }, [fetchClassQuizzes])

  // Extract quiz IDs from class quizzes
  const quizIds = classQuizzes.map(cq => cq.quiz_id)

  return {
    classQuizzes,
    quizIds,
    loading,
    error,
    refetch: fetchClassQuizzes
  }
}
