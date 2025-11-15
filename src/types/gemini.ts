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
    total: number
    questions: GeminiQuestion[]
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
