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
import { useForm, Controller, useFieldArray } from 'react-hook-form'

import { toast } from 'react-toastify'

// Component Imports
import CustomTextField from '@/@core/components/mui/TextField'
import CustomInputLabel from '../form/CustomInputLabel'
import DialogCloseButton from '../dialogs/DialogCloseButton'
import { fetchApi } from '@/libs/fetchApi'

export default function ModalCreateQuestion({ type, open, setOpen }: ModalCreateQuestionProps) {
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

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'answers'
  })

  const onSubmit = async (values: CreateQuestionFormValues) => {
    setOpen(false)

    try {
      const response = await fetchApi(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/questions`, {
        method: 'POST',
        body: JSON.stringify(values)
      })

      if (!response.ok) throw new Error('Tạo câu hỏi thất bại')
      toast.success('Tạo câu hỏi thành công!', { position: 'bottom-right', autoClose: 5000 })
      reset()

      if (isQuestionPath) {
        window.dispatchEvent(new CustomEvent('refreshQuestions'))
      } else {
        router.push('/question')
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tạo câu hỏi')
      console.error(error)
    }
  }

  return (
    <Dialog
      open={open}
      maxWidth='sm'
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
            maxHeight: '60vh'
          }}
        >
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
          <DialogActions className='justify-center'>
            <Button variant='contained' type='submit'>
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
            >
              Huỷ
            </Button>
          </DialogActions>
        </DialogContent>
      </form>
    </Dialog>
  )
}
