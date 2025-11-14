'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { useForm, FormProvider } from 'react-hook-form'

import Grid from '@mui/material/Grid2'

import QuizInfoForm from '@/components/quizz/QuizInfoForm'
import QuizQuestionForm from '@/components/quizz/QuizQuestionForm'
import QuizActions from '@/components/quizz/QuizActions'

import type { CreateQuizFormData } from '@/types/quiz'

export default function CreateQuizzForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const methods = useForm<CreateQuizFormData>({
    defaultValues: {
      name: '',
      description: '',
      total_time: 0,
      question_ids: []
    },
    mode: 'onChange'
  })

  const handleSuccess = () => {
    router.push('/quizz')
  }

  return (
    <FormProvider {...methods}>
      <form>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Grid container spacing={6}>
              <Grid size={{ xs: 12 }}>
                <QuizInfoForm />
              </Grid>
            </Grid>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <Grid container spacing={6}>
              <Grid size={{ xs: 12 }}>
                <QuizQuestionForm />
              </Grid>
            </Grid>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <QuizActions onSuccess={handleSuccess} isLoading={isLoading} setIsLoading={setIsLoading} />
          </Grid>
        </Grid>
      </form>
    </FormProvider>
  )
}
