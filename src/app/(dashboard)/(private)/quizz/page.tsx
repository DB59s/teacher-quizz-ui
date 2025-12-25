import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'

import { Button } from '@mui/material'

import QuizzTable from '@/views/quizz/QuizzTable'

export default function QuizzPage() {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <div className='flex justify-between items-center'>
          <Typography variant='h4' className='font-semibold'>
            Danh sách quizz
          </Typography>
          <div className='flex gap-3'>
            <Button
              variant='outlined'
              color='primary'
              href='/quizz/generate'
              startIcon={<i className='tabler-sparkles' />}
            >
              Generate Quiz
            </Button>
            <Button variant='contained' href='/quizz/create' startIcon={<i className='tabler-plus' />}>
              Tạo quizz mới
            </Button>
          </div>
        </div>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <QuizzTable />
      </Grid>
    </Grid>
  )
}
