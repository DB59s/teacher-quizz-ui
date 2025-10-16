import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'

import CreateQuizzForm from '@/views/quizz/CreateQuizzForm'

export default function CreateQuizzPage() {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <Typography variant='h4' className='font-semibold'>
          Tạo mới quizz
        </Typography>
      </Grid>
      <Grid size={{ xs: 12 }}>
          <CreateQuizzForm type={'create'} />
        </Grid>
    </Grid>
  )
}
