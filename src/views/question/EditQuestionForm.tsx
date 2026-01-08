import { useCallback, useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid2'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Checkbox from '@mui/material/Checkbox'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { toast } from 'react-toastify'

import { apiClient } from '@/libs/axios-client'
import { useUpdateQuestion } from '@/hooks/mutations/useQuestionMutations'
import CustomTextField from '@/@core/components/mui/TextField'
import CustomInputLabel from '@/components/form/CustomInputLabel'
import PageLoading from '@/theme/PageLoading'

// Types
type QuestionResponse = {
  id: string
  content: string
  level: number
  type: string
  teacher_id: string
  created_at: string
  updated_at: string
  answers: {
    id: string
    content: string
    is_true: boolean
  }[]
  subject_ids: string[]
}

type EditQuestionFormValues = {
  content: string
  level: number
  type: number
  subject_ids: string[]
  answers: {
    content: string
    is_true: boolean
  }[]
}

export default function EditQuestionForm({ questionId }: { questionId: string }) {
  const [questionData, setQuestionData] = useState<QuestionResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([])
  const [loadingSubjects, setLoadingSubjects] = useState(false)
  const [errorSubjects, setErrorSubjects] = useState('')
  const router = useRouter()

  // Use TanStack Query mutation hook
  const updateQuestionMutation = useUpdateQuestion()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<EditQuestionFormValues>({
    defaultValues: {
      content: '',
      level: 1,
      type: 1,
      subject_ids: [],
      answers: [{ content: '', is_true: false }]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'answers'
  })

  // Fetch câu hỏi
  const fetchQuestion = useCallback(async () => {
    try {
      setLoading(true)

      const res = await apiClient.get(`/api/v1/questions/${questionId}`)

      const data = res.data

      setQuestionData(data || null)

      // Fill form với data
      if (data) {
        const question = data as QuestionResponse

        // Reset toàn bộ form với dữ liệu mới
        reset({
          content: question.content,
          level: question.level,
          type: parseInt(question.type),
          subject_ids: question.subject_ids,
          answers: question.answers.map(ans => ({
            content: ans.content,
            is_true: ans.is_true
          }))
        })
      } else {
      }
    } catch (error) {
      console.error('Error in fetchQuestion:', error)
      toast.error('Không thể tải thông tin câu hỏi')
    } finally {
      setLoading(false)
    }
  }, [questionId, reset])

  // Fetch danh sách môn học
  useEffect(() => {
    setLoadingSubjects(true)
    apiClient
      .get('/api/v1/subjects?page=1&limit=100')
      .then(res => {
        setSubjects(res.data?.data || [])
      })
      .catch(err => {
        setErrorSubjects(err.message || 'Lỗi không xác định')
      })
      .finally(() => {
        setLoadingSubjects(false)
      })
  }, [])

  useEffect(() => {
    fetchQuestion()
  }, [fetchQuestion])

  // Submit form
  const onSubmit = async (values: EditQuestionFormValues) => {
    try {
      setLoading(true)

      // Use mutation hook with automatic query invalidation
      await updateQuestionMutation.mutateAsync({
        questionId,
        payload: values
      })

      router.push('/question')
    } catch (error) {
      // Error handling is done by the mutation hook
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  // Hiển thị loading khi đang fetch hoặc chưa có data
  if (loading || !questionData) {
    return <PageLoading show={true} />
  }

  return (
    <Card className='p-6'>
      <Typography variant='h5' className='mb-6 font-semibold'>
        Chỉnh sửa câu hỏi
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12 }} className='flex flex-col'>
            <CustomInputLabel required>Nội dung câu hỏi</CustomInputLabel>
            <Controller
              name='content'
              control={control}
              rules={{ required: 'Nội dung là bắt buộc' }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  placeholder='Nhập nội dung câu hỏi'
                  error={!!errors.content}
                  helperText={errors.content?.message}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12 }} className='flex flex-col'>
            <CustomInputLabel required>Mức độ</CustomInputLabel>
            <Controller
              name='level'
              control={control}
              rules={{ required: 'Mức độ là bắt buộc', min: { value: 1, message: 'Tối thiểu là 1' } }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  type='number'
                  placeholder='Nhập mức độ'
                  error={!!errors.level}
                  helperText={errors.level?.message}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12 }} className='flex flex-col'>
            <CustomInputLabel required>Loại câu hỏi</CustomInputLabel>
            <Controller
              name='type'
              control={control}
              rules={{ required: 'Loại là bắt buộc' }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  type='number'
                  placeholder='Nhập loại câu hỏi'
                  error={!!errors.type}
                  helperText={errors.type?.message}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12 }} className='flex flex-col'>
            <CustomInputLabel required>Môn học liên quan</CustomInputLabel>
            <Controller
              name='subject_ids'
              control={control}
              rules={{
                validate: v => (v && v.length > 0) || 'Chọn ít nhất một môn học'
              }}
              render={({ field }) => (
                <Select
                  {...field}
                  multiple
                  value={field.value}
                  onChange={e => field.onChange(e.target.value)}
                  renderValue={selected =>
                    subjects
                      .filter(sub => selected.includes(sub.id))
                      .map(sub => sub.name)
                      .join(', ')
                  }
                  error={!!errors.subject_ids}
                >
                  {subjects.map(sub => (
                    <MenuItem key={sub.id} value={sub.id}>
                      <Checkbox checked={field.value.includes(sub.id)} />
                      <ListItemText primary={sub.name} />
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {loadingSubjects && <span>Đang tải danh sách môn học...</span>}
            {errorSubjects && <span style={{ color: 'red' }}>{errorSubjects}</span>}
            {errors.subject_ids && <span style={{ color: 'red' }}>{errors.subject_ids.message}</span>}
          </Grid>

          <Grid size={{ xs: 12 }} className='flex flex-col gap-2'>
            <CustomInputLabel required>Đáp án</CustomInputLabel>
            {fields.map((item, idx) => (
              <Grid key={item.id} className='flex items-center gap-2'>
                <Controller
                  name={`answers.${idx}.content` as const}
                  control={control}
                  rules={{ required: 'Nội dung đáp án là bắt buộc' }}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      placeholder={`Đáp án ${idx + 1}`}
                      error={!!errors.answers?.[idx]?.content}
                      helperText={errors.answers?.[idx]?.content?.message}
                      fullWidth
                    />
                  )}
                />
                <Controller
                  name={`answers.${idx}.is_true` as const}
                  control={control}
                  render={({ field }) => (
                    <label style={{ display: 'flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}>
                      <input
                        type='checkbox'
                        name={field.name}
                        ref={field.ref}
                        checked={field.value}
                        onChange={e => field.onChange(e.target.checked)}
                        onBlur={field.onBlur}
                        disabled={field.disabled}
                      />
                      Đúng
                    </label>
                  )}
                />
                {fields.length > 2 && (
                  <Button size='small' color='error' onClick={() => remove(idx)}>
                    Xóa
                  </Button>
                )}
              </Grid>
            ))}
            <Button size='small' onClick={() => append({ content: '', is_true: false })} className='self-start'>
              Thêm đáp án
            </Button>
          </Grid>

          <Grid size={{ xs: 12 }} className='flex justify-center gap-4 mt-6'>
            <Button variant='contained' type='submit' disabled={loading}>
              {loading ? 'Đang lưu...' : 'Cập nhật'}
            </Button>
            <Button variant='outlined' color='secondary' onClick={() => router.push('/question')} disabled={loading}>
              Hủy
            </Button>
          </Grid>
        </Grid>
      </form>
    </Card>
  )
}
