// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Grid from '@mui/material/Grid2'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'

import { useForm, Controller } from 'react-hook-form'

import { toast } from 'react-toastify'

// Component Imports
import DialogCloseButton from '../dialogs/DialogCloseButton'
import CustomTextField from '@/@core/components/mui/TextField'
import CustomInputLabel from '../form/CustomInputLabel'
import { fetchApi } from '@/libs/fetchApi'
import useClass from '@/hooks/useClass'

type CreateClassFormValues = {
  name: string
  description: string
  max_students: number
}

type ModalCreateClassProps = {
  open: boolean
  setOpen: (open: boolean) => void
}

export default function ModalCreateClass({ open, setOpen }: ModalCreateClassProps) {
  const { refreshClasses } = useClass()
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CreateClassFormValues>({
    defaultValues: {
      name: '',
      description: '',
      max_students: 0
    }
  })

  const onSubmit = async (values: CreateClassFormValues) => {
    const payload = {
      ...values,
      max_students: Number(values.max_students)
    }

    setOpen(false)

    try {
      const response = await fetchApi(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/classes`, {
        method: 'POST',
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error('Failed to create class')
      }

      reset()

      // Refresh danh sách lớp học
      await refreshClasses()

      toast.success('Tạo lớp học thành công!', {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true
      })
    } catch (error) {
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
        Tạo lớp học mới
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
              <CustomInputLabel required>Tên lớp học</CustomInputLabel>
              <Controller
                name='name'
                control={control}
                rules={{ required: 'Tên lớp học là bắt buộc' }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    placeholder='Nhập tên lớp học'
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12 }} className='flex flex-col'>
              <CustomInputLabel required>Mô tả</CustomInputLabel>
              <Controller
                name='description'
                control={control}
                rules={{ required: 'Mô tả là bắt buộc' }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    placeholder='Nhập mô tả'
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12 }} className='flex flex-col'>
              <CustomInputLabel required>Số lượng học sinh tối đa</CustomInputLabel>
              <Controller
                name='max_students'
                control={control}
                rules={{
                  required: 'Số lượng học sinh tối đa là bắt buộc',
                  min: { value: 1, message: 'Phải lớn hơn 0' }
                }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    type='number'
                    placeholder='Nhập số lượng học sinh tối đa'
                    error={!!errors.max_students}
                    helperText={errors.max_students?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
          <DialogActions className='justify-center'>
            <Button variant='contained' type='submit'>
              Tạo
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
