import { useState, useEffect } from 'react'

import { apiClient } from '@/libs/axios-client'

type QuestionDetail = {
  id: string
  level: number
  type: string
}

type QuestionDetailsMap = {
  [questionId: string]: QuestionDetail
}

/**
 * Hook to fetch question details (level, type) for multiple questions
 * @param questionIds - Array of question IDs to fetch
 * @returns Object with question details mapped by ID and loading state
 */
export function useQuestionDetails(questionIds: string[]) {
  const [questionDetails, setQuestionDetails] = useState<QuestionDetailsMap>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (questionIds.length === 0) return

    const fetchQuestionDetails = async () => {
      setLoading(true)
      
      try {
        // Fetch all questions in parallel
        const promises = questionIds.map(async questionId => {
          try {
            const { data } = await apiClient.get(`/api/v1/questions/${questionId}`)

            return {
              id: questionId,
              level: data.level,
              type: data.type
            }
          } catch (error) {
            console.error(`Error fetching question ${questionId}:`, error)

            return null
          }
        })

        const results = await Promise.all(promises)

        // Map results by question ID
        const detailsMap: QuestionDetailsMap = {}

        results.forEach(result => {
          if (result) {
            detailsMap[result.id] = result
          }
        })

        setQuestionDetails(detailsMap)
      } catch (error) {
        console.error('Error fetching question details:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchQuestionDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionIds.join(',')])

  return { questionDetails, loading }
}

/**
 * Get level label from level number
 */
export function getLevelLabel(level: number): string {
  switch (level) {
    case 1:
      return 'Rất dễ'
    case 2:
      return 'Dễ'
    case 3:
      return 'Trung bình'
    case 4:
      return 'Khó'
    case 5:
      return 'Rất khó'
    default:
      return `Mức ${level}`
  }
}

/**
 * Get type label from type string/number
 */
export function getTypeLabel(type: string | number): string {
  const typeStr = String(type)

  switch (typeStr) {
    case '1':
      return '1 đáp án'
    case '2':
      return 'Nhiều đáp án'
    default:
      return 'Không xác định'
  }
}
