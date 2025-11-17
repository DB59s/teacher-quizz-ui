import axios from 'axios'
import { getSession } from 'next-auth/react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.vuquangduy.io.vn'

// Types for Submissions List
export interface Student {
  student_id: string
  full_name: string
  student_code: string
}

export interface Submission {
  submission_id: string | null
  student: Student
  status: 'not_submitted' | 'graded' | 'pending'
  score: number | null
  submission_time: string | null
}

export interface SubmissionsListResponse {
  success: boolean
  message: string
  data: Submission[]
  pagination: {
    current_page: number
    items_per_page: number
    total_items: number
    total_pages: number
  }
}

// Types for Submission Detail
export interface Answer {
  answer_id: string
  content: string
  is_correct: boolean
  student_selected: boolean
}

export interface DetailedResult {
  question_id: string
  content: string
  answers: Answer[]
}

export interface SubmissionDetail {
  submission_id: string
  student_id: string
  quiz_name: string
  score: number
  n_total_true: number
  total_questions: number
  submission_time: string
  detailed_results: DetailedResult[]
}

export interface SubmissionDetailResponse {
  success: boolean
  message: string
  data: SubmissionDetail
}

// Types for Statistics
export interface ScoreDistribution {
  range: string
  count: number
}

export interface GeneralStatistics {
  total_submissions: number
  average_score: number
  max_score: number
  min_score: number
  score_distribution: ScoreDistribution[]
}

export interface AnswerDistribution {
  answer_id: string
  content: string
  is_correct: boolean
  selected_count: number
}

export interface QuestionStatistic {
  question_id: string
  content: string
  percent_correct: number
  answer_distribution: AnswerDistribution[]
}

export interface QuizStatistics {
  general_statistics: GeneralStatistics
  question_statistics: QuestionStatistic[]
}

export interface StatisticsResponse {
  success: boolean
  message: string
  data: QuizStatistics
}

/**
 * Get submissions list for a class quiz
 * @param classQuizId - ID of the class quiz
 * @param page - Page number (default: 1)
 * @param limit - Items per page (default: 10)
 */
export async function getClassQuizSubmissions(
  classQuizId: string,
  page: number = 1,
  limit: number = 10
): Promise<SubmissionsListResponse> {
  try {
    const session = await getSession()
    const token = session?.accessToken

    const response = await axios.get<SubmissionsListResponse>(
      `${API_BASE_URL}/api/v1/submissions/class-quiz/${classQuizId}`,
      {
        params: { page, limit },
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        }
      }
    )

    return response.data
  } catch (error) {
    console.error('Error fetching class quiz submissions:', error)
    throw error
  }
}

/**
 * Get submission detail for teacher
 * @param submissionId - ID of the submission
 */
export async function getSubmissionDetail(submissionId: string): Promise<SubmissionDetail> {
  try {
    const session = await getSession()
    const token = session?.accessToken

    const response = await axios.get<SubmissionDetailResponse>(
      `${API_BASE_URL}/api/v1/submissions/${submissionId}/teacher`,
      {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        }
      }
    )

    return response.data.data
  } catch (error) {
    console.error('Error fetching submission detail:', error)
    throw error
  }
}

/**
 * Get quiz statistics for a class quiz
 * @param classQuizId - ID of the class quiz
 */
export async function getQuizStatistics(classQuizId: string): Promise<QuizStatistics> {
  try {
    const session = await getSession()
    const token = session?.accessToken

    const response = await axios.get<StatisticsResponse>(
      `${API_BASE_URL}/api/v1/submissions/class-quiz/${classQuizId}/statistics`,
      {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        }
      }
    )

    return response.data.data
  } catch (error) {
    console.error('Error fetching quiz statistics:', error)
    throw error
  }
}
