export interface CreateQuizFormData {
  name: string
  description: string
  total_time: number
  question_ids: string[]
}

export interface CreateQuizRequest {
  name: string
  description: string
  total_time: number
  question_ids: string[]
}
