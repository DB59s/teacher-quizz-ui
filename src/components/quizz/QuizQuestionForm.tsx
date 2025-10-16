'use client'

import { useFormContext } from 'react-hook-form'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

import QuestionSelector from '@/components/quizz/QuestionSelector'

import type { CreateQuizFormData } from '@/types/quiz'

export default function QuizQuestionForm() {
  const { watch, setValue } = useFormContext<CreateQuizFormData>()

  const selectedQuestions = watch('question_ids') || []

  const handleSelectionChange = (selectedIds: string[]) => {
    setValue('question_ids', selectedIds, { shouldValidate: true })
  }

  return (
    <Card>
      <CardHeader
        title='Danh sách câu hỏi'
        className='text-grey-dark-600'
        sx={{ '& .MuiCardHeader-action': { alignSelf: 'center' } }}
      />
      <CardContent>
        <div className='mb-4'>
          <Typography variant='body2' color='text.secondary' className='mb-2'>
            Đã chọn {selectedQuestions.length} câu hỏi
          </Typography>
        </div>

        <QuestionSelector selectedQuestions={selectedQuestions} onSelectionChange={handleSelectionChange} />
      </CardContent>
    </Card>
  )
}
