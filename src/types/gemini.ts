export interface GeminiAnswer {
  content: string
  is_true: boolean
}

export interface GeminiQuestion {
  content: string
  level: number
  type: string
  answers: GeminiAnswer[]
}

export interface GeminiGenerateResponse {
  success: boolean
  message: string
  data: {
    job_id: string
    status: 'processing' | 'completed' | 'failed'
    check_status_url: string
  }
}

export interface QuizStatusResponse {
  success: boolean
  message: string
  data: {
    job_id: string
    status: 'processing' | 'completed' | 'failed'
    progress: string
    total_questions?: number
    processed_questions?: number
    current_chunk?: number
    total_chunks?: number
    created_at: string
    started_at?: string
    completed_at?: string
    error?: string
    total?: number
    questions?: GeminiQuestion[]
  }
}

export interface Subject {
  id: string
  name: string
  description?: string
}

export interface CreateQuizFromAIPayload {
  name_quiz: string
  des_quiz: string
  total_time: number
  subject_id_question: string
  questions: GeminiQuestion[]
}
