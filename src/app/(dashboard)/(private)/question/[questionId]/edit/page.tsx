'use client'

import { use } from 'react'

import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'

import EditQuestionForm from '@/views/question/EditQuestionForm'


export default function QuestionEditPage({ params }: { params: Promise<{ questionId: string }> }) {
  const { questionId } = use(params)

  return (
    <>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <Typography variant='h4' className='font-semibold'>
            Chỉnh sửa câu hỏi
          </Typography>
        </Grid>
        <Grid size={{ xs: 12 }} className='flex flex-col gap-6'>
          <EditQuestionForm questionId={questionId} />
        </Grid>
      </Grid>
    </>
  )
}
