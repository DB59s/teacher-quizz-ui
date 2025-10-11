import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid2'

export default function Newsfeed(data: any) {
  const { name, teacher, description, class_code } = data.data

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardMedia component='img' height={200} image={'https://www.gstatic.com/classroom/themes/img_backtoschool.jpg'} alt={`${name} banner`} />
          <CardContent>
            <Stack direction='row' justifyContent='space-between' alignItems='center' spacing={2}>
              <Box>
                <Typography variant='h5' className='font-semibold'>
                  Giáo viên: {teacher}
                </Typography>
                <Typography color='text.secondary' className='mt-1'>
                  {description}
                </Typography>
              </Box>
              <Stack direction='row' spacing={1}>
                <Chip label={`Mã lớp: ${class_code}`} color='primary' variant='outlined' />
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
      <Grid container size={{ xs: 3 }} spacing={3}>
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant='h5' className='font-semibold'>
                Mã lớp
              </Typography>
              <Typography color='text-primary' variant='h4' className=''>
                {class_code}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant='h5' className='font-semibold'>
                Sắp đến hạn
              </Typography>
              <Typography color='text-primary' variant='h6' className=''>
                Không có bài tập nào sắp đến hạn
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid container size={{ xs: 9 }} spacing={3}>
        
      </Grid>
    </Grid>
  )
}
