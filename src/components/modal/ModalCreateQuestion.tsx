type CreateQuestionFormValues = {
  content: string
  level: number
  type: number
  subject_ids: string[]
  answers: {
    content: string
    is_true: boolean
  }[]
}

type ModalCreateQuestionProps = {
  type: 'create' | 'edit'
  open: boolean
  setOpen: (open: boolean) => void
  questionId?: string | null
}

// React Imports
import { useEffect, useState } from 'react'

import { useRouter, usePathname } from 'next/navigation'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Grid from '@mui/material/Grid2'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import { useForm, Controller, useFieldArray } from 'react-hook-form'

import { toast } from 'react-toastify'

// Component Imports
import CustomTextField from '@/@core/components/mui/TextField'
import CustomInputLabel from '../form/CustomInputLabel'
import DialogCloseButton from '../dialogs/DialogCloseButton'
import SubjectAutocomplete from '../form/SubjectAutocomplete'
import { apiClient } from '@/libs/axios-client'

export default function ModalCreateQuestion({ type, open, setOpen, questionId }: ModalCreateQuestionProps) {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors }
  } = useForm<CreateQuestionFormValues>({
    defaultValues: {
      content: '',
      level: 1,
      type: 1,
      subject_ids: [],
      answers: [{ content: '', is_true: false }]
    }
  })

  const questionType = watch('type')

  const [loadingQuestion, setLoadingQuestion] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const isQuestionPath = /question/.test(pathname || '')

  // Fetch question data when editing
  useEffect(() => {
    if (open && type === 'edit' && questionId) {
      fetchQuestionData()
    } else if (open && type === 'create') {
      // Reset form when opening create modal
      reset({
        content: '',
        level: 1,
        type: 1,
        subject_ids: [],
        answers: [{ content: '', is_true: false }]
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, type, questionId])

  const fetchQuestionData = async () => {
    if (!questionId) return

    setLoadingQuestion(true)

    try {
      const res = await apiClient.get(`/api/v1/questions/${questionId}`)

      const question = res.data as any

      // Fill form with question data
      reset({
        content: question.content || '',
        level: question.level || 1,
        type: parseInt(question.type) || 1,
        subject_ids: question.subject_ids || [],
        answers:
          question.answers && question.answers.length > 0
            ? question.answers.map((ans: any) => ({
                content: ans.content || '',
                is_true: ans.is_true || false
              }))
            : [{ content: '', is_true: false }]
      })
    } catch (error) {
      console.error('Error fetching question:', error)
      toast.error('Không thể tải thông tin câu hỏi')
    } finally {
      setLoadingQuestion(false)
    }
  }

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'answers'
  })

  const onSubmit = async (values: CreateQuestionFormValues) => {
    setOpen(false)

    try {
      if (type === 'edit' && questionId) {
        // Update existing question
        await apiClient.patch(`/api/v1/questions/${questionId}`, values)
        toast.success('Cập nhật câu hỏi thành công!', { position: 'bottom-right', autoClose: 5000 })
      } else {
        // Create new question
        await apiClient.post('/api/v1/questions', values)
        toast.success('Tạo câu hỏi thành công!', { position: 'bottom-right', autoClose: 5000 })
      }

      reset()

      if (isQuestionPath) {
        window.dispatchEvent(new CustomEvent('refreshQuestions'))
      } else {
        router.push('/question')
      }
    } catch (error) {
      toast.error(type === 'edit' ? 'Có lỗi xảy ra khi cập nhật câu hỏi' : 'Có lỗi xảy ra khi tạo câu hỏi')
      console.error(error)
    }
  }

  return (
    <Dialog
      open={open}
      maxWidth='md'
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          overflow: 'visible'
        }
      }}
    >
      <DialogCloseButton onClick={() => setOpen(false)} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>
      <DialogTitle variant='h4' className='text-center'>
        {type === 'create' ? 'Tạo câu hỏi mới' : 'Chỉnh sửa câu hỏi'}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent
          sx={{
            overflowY: 'auto',
            overflowX: 'visible',
            maxHeight: '80vh',
            padding: '24px'
          }}
        >
          {loadingQuestion ? (
            <div className='flex justify-center items-center py-8'>
              <Typography>Đang tải thông tin câu hỏi...</Typography>
            </div>
          ) : (
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
                  rules={{ required: 'Mức độ là bắt buộc' }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      value={field.value}
                      onChange={e => field.onChange(e.target.value)}
                      error={!!errors.level}
                      displayEmpty
                    >
                      <MenuItem value={1}>Mức 1 - Dễ</MenuItem>
                      <MenuItem value={2}>Mức 2 - Trung bình</MenuItem>
                      <MenuItem value={3}>Mức 3 - Khó</MenuItem>
                      <MenuItem value={4}>Mức 4 - Rất khó</MenuItem>
                    </Select>
                  )}
                />
                {errors.level && (
                  <span style={{ color: 'red', fontSize: '0.75rem', marginTop: '4px' }}>{errors.level.message}</span>
                )}
              </Grid>
              <Grid size={{ xs: 12 }} className='flex flex-col'>
                <CustomInputLabel required>Loại câu hỏi</CustomInputLabel>
                <Controller
                  name='type'
                  control={control}
                  rules={{ required: 'Loại là bắt buộc' }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      value={field.value}
                      onChange={e => field.onChange(e.target.value)}
                      error={!!errors.type}
                      displayEmpty
                    >
                      <MenuItem value={1}>1 đáp án</MenuItem>
                      <MenuItem value={2}>Nhiều đáp án</MenuItem>
                    </Select>
                  )}
                />
                {errors.type && (
                  <span style={{ color: 'red', fontSize: '0.75rem', marginTop: '4px' }}>{errors.type.message}</span>
                )}
              </Grid>
              <Grid size={{ xs: 12 }}>
                <SubjectAutocomplete
                  control={control}
                  name='subject_ids'
                  errors={errors}
                  required
                  label='Môn học liên quan'
                />
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
                        />
                      )}
                    />
                    <Controller
                      name={`answers.${idx}.is_true` as const}
                      control={control}
                      render={({ field }) => (
                        <label style={{ display: 'flex', alignItems: 'center', gap: 4, minWidth: '80px' }}>
                          {questionType === 1 ? (
                            <input
                              type='radio'
                              name='correct_answer'
                              checked={field.value}
                              onChange={() => {
                                // Uncheck all other answers
                                fields.forEach((_, i) => {
                                  setValue(`answers.${i}.is_true`, i === idx)
                                })
                              }}
                            />
                          ) : (
                            <input
                              type='checkbox'
                              name={field.name}
                              ref={field.ref}
                              checked={field.value}
                              onChange={e => field.onChange(e.target.checked)}
                              onBlur={field.onBlur}
                              disabled={field.disabled}
                            />
                          )}
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
                <Button size='small' onClick={() => append({ content: '', is_true: false })}>
                  Thêm đáp án
                </Button>
              </Grid>
            </Grid>
          )}
          <DialogActions className='justify-center'>
            <Button variant='contained' type='submit' disabled={loadingQuestion}>
              {type === 'create' ? 'Tạo' : 'Lưu'}
            </Button>
            <Button
              variant='tonal'
              type='reset'
              color='secondary'
              onClick={() => {
                reset()
                setOpen(false)
              }}
              disabled={loadingQuestion}
            >
              Huỷ
            </Button>
          </DialogActions>
        </DialogContent>
      </form>
    </Dialog>
  )
}
