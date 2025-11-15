import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'

import GenerateQuizView from '@/views/quizz/GenerateQuizView'

export default function GenerateQuizPage() {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <Typography variant='h4' className='font-semibold'>
          Tạo Quiz từ AI
        </Typography>
        <Typography variant='body2' color='text.secondary' className='mt-2'>
          Upload file PDF và để AI tự động tạo câu hỏi cho bạn
        </Typography>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <GenerateQuizView />
      </Grid>
    </Grid>
  )
}
