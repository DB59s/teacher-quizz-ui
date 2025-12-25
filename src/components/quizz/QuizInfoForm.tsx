'use client'

import { useFormContext, Controller } from 'react-hook-form'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'

import CustomInputLabel from '@/components/form/CustomInputLabel'
import CustomTextField from '@/@core/components/mui/TextField'

import type { CreateQuizFormData } from '@/types/quiz'

export default function QuizInfoForm() {
  const {
    control,
    formState: { errors }
  } = useFormContext<CreateQuizFormData>()

  return (
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
            <Controller
              name='name'
              control={control}
              rules={{
                required: 'Vui lòng nhập tiêu đề quiz'
              }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  placeholder='Nhập tiêu đề'
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <CustomInputLabel required>Mô tả</CustomInputLabel>
            <Controller
              name='description'
              control={control}
              rules={{
                required: 'Vui lòng nhập mô tả quiz'
              }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  rows={4}
                  multiline
                  placeholder='Nhập mô tả'
                  error={!!errors.description}
                  helperText={errors.description?.message}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <CustomInputLabel required>Thời gian làm bài (phút)</CustomInputLabel>
            <Controller
              name='total_time'
              control={control}
              rules={{
                required: 'Vui lòng nhập thời gian làm bài',
                min: {
                  value: 1,
                  message: 'Thời gian làm bài phải lớn hơn 0'
                }
              }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  type='number'
                  fullWidth
                  placeholder='Nhập thời gian làm bài'
                  error={!!errors.total_time}
                  helperText={errors.total_time?.message}
                  onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                />
              )}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}
