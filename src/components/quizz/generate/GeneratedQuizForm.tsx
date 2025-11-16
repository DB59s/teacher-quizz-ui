'use client'

import { useState, useEffect } from 'react'

import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { toast } from 'react-toastify'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid2'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import QuestionCard from './QuestionCard'

import { getAllSubjects, createQuizFromAI } from '@/services/gemini.service'
import type { GeminiQuestion, Subject } from '@/types/gemini'

interface GeneratedQuizFormProps {
  questions: GeminiQuestion[]
  onSuccess: () => void
  onReset: () => void
}

interface FormData {
  name_quiz: string
  des_quiz: string
  total_time: number
  subject_id_question: string
  questions: GeminiQuestion[]
}

export default function GeneratedQuizForm({ questions, onSuccess, onReset }: GeneratedQuizFormProps) {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      name_quiz: '',
      des_quiz: '',
      total_time: 900,
      subject_id_question: '',
      questions: questions
    }
  })

  const { fields, remove } = useFieldArray({
    control,
    name: 'questions'
  })

  useEffect(() => {
    fetchSubjects()
  }, [])

  const fetchSubjects = async () => {
    try {
      const data = await getAllSubjects()

      setSubjects(data)
    } catch (error: any) {
      toast.error('Không thể tải danh sách môn học')
    } finally {
      setIsLoadingSubjects(false)
    }
  }

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)

    try {
      // Convert total_time to number before sending
      const payload = {
        ...data,
        total_time: Number(data.total_time)
      }

      await createQuizFromAI(payload)

      onSuccess()
    } catch (error: any) {
      toast.error(error.message || 'Không thể tạo quiz')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={6}>
        {/* Header Actions */}
        <Grid size={{ xs: 12 }}>
          <Box className='flex items-center justify-between'>
            <Typography variant='h5' className='font-semibold'>
              Chỉnh sửa Quiz
            </Typography>
            <Button
              variant='outlined'
              color='secondary'
              onClick={onReset}
              startIcon={<i className='tabler-arrow-left' />}
            >
              Upload lại
            </Button>
          </Box>
        </Grid>

        {/* Quiz Info */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name='name_quiz'
            control={control}
            rules={{ required: 'Tên quiz là bắt buộc' }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label='Tên Quiz'
                placeholder='Nhập tên quiz'
                error={!!errors.name_quiz}
                helperText={errors.name_quiz?.message}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name='subject_id_question'
            control={control}
            rules={{ required: 'Môn học là bắt buộc' }}
            render={({ field }) => (
              <TextField
                {...field}
                select
                fullWidth
                label='Môn học'
                error={!!errors.subject_id_question}
                helperText={errors.subject_id_question?.message}
                disabled={isLoadingSubjects}
              >
                {isLoadingSubjects ? (
                  <MenuItem disabled>
                    <CircularProgress size={20} />
                  </MenuItem>
                ) : (
                  subjects.map(subject => (
                    <MenuItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </MenuItem>
                  ))
                )}
              </TextField>
            )}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Controller
            name='des_quiz'
            control={control}
            rules={{ required: 'Mô tả quiz là bắt buộc' }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                multiline
                rows={3}
                label='Mô tả Quiz'
                placeholder='Nhập mô tả quiz'
                error={!!errors.des_quiz}
                helperText={errors.des_quiz?.message}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name='total_time'
            control={control}
            rules={{
              required: 'Thời gian làm bài là bắt buộc',
              min: { value: 60, message: 'Thời gian tối thiểu là 60 giây' }
            }}
            render={({ field }) => (
              <TextField
                {...field}
                onChange={e => field.onChange(Number(e.target.value))}
                fullWidth
                type='number'
                label='Thời gian làm bài (giây)'
                placeholder='900'
                error={!!errors.total_time}
                helperText={errors.total_time?.message || `${Math.floor((field.value || 0) / 60)} phút`}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Divider />
        </Grid>

        {/* Questions List */}
        <Grid size={{ xs: 12 }}>
          <Box className='flex items-center justify-between mb-4'>
            <Typography variant='h6' className='font-semibold'>
              Danh sách câu hỏi ({fields.length})
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Chỉnh sửa hoặc xóa câu hỏi không phù hợp
            </Typography>
          </Box>

          {fields.length === 0 ? (
            <Box className='text-center py-8'>
              <Typography variant='body1' color='text.secondary'>
                Không có câu hỏi nào
              </Typography>
            </Box>
          ) : (
            <Box className='flex flex-col gap-4'>
              {fields.map((field, index) => (
                <QuestionCard
                  key={field.id}
                  control={control}
                  index={index}
                  onRemove={() => remove(index)}
                  errors={errors}
                />
              ))}
            </Box>
          )}
        </Grid>

        {/* Submit Actions */}
        <Grid size={{ xs: 12 }}>
          <Divider className='mb-6' />
          <Box className='flex justify-end gap-4'>
            <Button variant='outlined' color='secondary' onClick={onReset} disabled={isSubmitting}>
              Hủy
            </Button>
            <Button
              type='submit'
              variant='contained'
              color='primary'
              disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={20} /> : <i className='tabler-check' />}
            >
              {isSubmitting ? 'Đang tạo...' : 'Tạo Quiz'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </form>
  )
}
