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
import Checkbox from '@mui/material/Checkbox'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import { useForm, Controller, useFieldArray } from 'react-hook-form'

import { toast } from 'react-toastify'

// Component Imports
import CustomTextField from '@/@core/components/mui/TextField'
import CustomInputLabel from '../form/CustomInputLabel'
import DialogCloseButton from '../dialogs/DialogCloseButton'
import { fetchApi } from '@/libs/fetchApi'

export default function ModalCreateQuestion({ type, open, setOpen, questionId }: ModalCreateQuestionProps) {
  const {
    control,
    handleSubmit,
    reset,
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

  const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([])
  const [loadingSubjects, setLoadingSubjects] = useState(false)
  const [errorSubjects, setErrorSubjects] = useState('')
  const [loadingQuestion, setLoadingQuestion] = useState(false)
  const [subjectSelectOpen, setSubjectSelectOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const isQuestionPath = /question/.test(pathname || '')

  useEffect(() => {
    setLoadingSubjects(true)
    fetchApi(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/subjects?page=1&limit=100`, { method: 'GET' })
      .then(res => {
        if (!res.ok) throw new Error('Không lấy được danh sách môn học')

        return res.json()
      })
      .then(json => {
        setSubjects(json?.data || [])
      })
      .catch(err => {
        setErrorSubjects(err.message || 'Lỗi không xác định')
      })
      .finally(() => {
        setLoadingSubjects(false)
      })
  }, [])

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
      const res = await fetchApi(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/questions/${questionId}`, {
        method: 'GET'
      })

      if (!res.ok) throw new Error('Không lấy được thông tin câu hỏi')

      const data = await res.json()
      const question = data as any

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
        const response = await fetchApi(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/questions/${questionId}`, {
          method: 'PATCH',
          body: JSON.stringify(values)
        })

        if (!response.ok) throw new Error('Cập nhật câu hỏi thất bại')
        toast.success('Cập nhật câu hỏi thành công!', { position: 'bottom-right', autoClose: 5000 })
      } else {
        // Create new question
        const response = await fetchApi(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/questions`, {
          method: 'POST',
          body: JSON.stringify(values)
        })

        if (!response.ok) throw new Error('Tạo câu hỏi thất bại')
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
                      open={subjectSelectOpen}
                      onOpen={() => setSubjectSelectOpen(true)}
                      onClose={() => setSubjectSelectOpen(false)}
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
                      <Divider />
                      <MenuItem
                        onClick={() => setSubjectSelectOpen(false)}
                        sx={{
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          color: 'primary.main'
                        }}
                      >
                        Đóng
                      </MenuItem>
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
                        />
                      )}
                    />
                    <Controller
                      name={`answers.${idx}.is_true` as const}
                      control={control}
                      render={({ field }) => (
                        <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
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
