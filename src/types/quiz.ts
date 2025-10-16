export interface CreateQuizFormData {
  name: string
  description: string
  duration: number
  question_ids: string[]
}

export interface CreateQuizRequest {
  name: string
  description: string
  question_ids: string[]
}
