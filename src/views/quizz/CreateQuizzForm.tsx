'use client'

import CardHeader from '@mui/material/CardHeader'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid2'
import CardContent from '@mui/material/CardContent'

import CustomInputLabel from '@/components/form/CustomInputLabel'
import CustomTextField from '@/@core/components/mui/TextField'
import EditorBasic from '@/components/form/EditorBasic'

export default function CreateQuizzForm() {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12, md: 4 }}>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12 }}>
            <Card>
              <CardHeader
                title='Thông tin chung'
                className='text-grey-dark-600'
                sx={{ '& .MuiCardHeader-action': { alignSelf: 'center' } }}
              />
              <CardContent>
                <Grid container spacing={6}>
                  <Grid size={{ xs: 12 }}>
                    <CustomInputLabel required>Tiêu đề</CustomInputLabel>
                    <CustomTextField fullWidth placeholder='Nhập tiêu đề' />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <CustomInputLabel required>Mô tả</CustomInputLabel>
                    <EditorBasic disabled={false} />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
      <Grid size={{ xs: 12, md: 8 }}>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12 }}>
            <Card>
              <CardHeader
                title='Danh sách câu hỏi'
                className='text-grey-dark-600'
                sx={{ '& .MuiCardHeader-action': { alignSelf: 'center' } }}
              />
              <CardContent>
                
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}
