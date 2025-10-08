import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

export default function Exercises() {
  return (
    <Box className='p-4'>
      <Typography variant='h6' className='mb-2'>
        Bài tập trên lớp
      </Typography>
      <Typography color='text.secondary'>
        Hiện tại chưa có bài tập nào. Bạn có thể tạo bài tập mới từ trang quản lý lớp.
      </Typography>
    </Box>
  )
}
