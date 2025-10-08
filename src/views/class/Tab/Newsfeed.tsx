import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'

export default function Newsfeed(data: any) {

  const { name, banner, teacher, description, class_code } = data.data;

  return (
    <Card>
      <CardMedia component='img' height={200} image={banner} alt={`${name} banner`} />
      <CardContent>
        <Stack direction='row' justifyContent='space-between' alignItems='center' spacing={2}>
          <Box>
            <Typography variant='h6' className='font-semibold'>
              Giáo viên: {teacher}
            </Typography>
            <Typography color='text.secondary' className='mt-1'>
              {description}
            </Typography>
          </Box>
          <Stack direction='row' spacing={1}>
            <Chip label={`Mã lớp: ${class_code}`} color='primary' variant='outlined' />
            <Button variant='contained' size='small'>
              Tham gia
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
}
