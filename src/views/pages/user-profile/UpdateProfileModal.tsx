'use client'

// React Imports
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid2'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'

// Component Imports
import CustomTextField from '@/@core/components/mui/TextField'
import CustomInputLabel from '@/components/form/CustomInputLabel'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'
import { getUserProfile, updateUserProfile } from '@/services/user.service'

type UpdateProfileFormValues = {
  full_name: string
  department: string
  university: string
  phone_number: string
}

type UpdateProfileModalProps = {
  open: boolean
  setOpen: (open: boolean) => void
}

const UpdateProfileModal = ({ open, setOpen }: UpdateProfileModalProps) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<UpdateProfileFormValues>({
    defaultValues: {
      full_name: '',
      department: '',
      university: '',
      phone_number: ''
    }
  })

  // Fetch user profile data when modal opens
  useEffect(() => {
    if (open) {
      setLoadingData(true)
      getUserProfile()
        .then(userData => {
          reset({
            full_name: userData.full_name || '',
            department: userData.department || '',
            university: userData.university || '',
            phone_number: userData.phone_number || ''
          })
        })
        .catch(err => {
          console.error('Error fetching user profile:', err)
          toast.error('Không thể tải thông tin người dùng')
        })
        .finally(() => {
          setLoadingData(false)
        })
    }
  }, [open, reset])

  const onSubmit = async (data: UpdateProfileFormValues) => {
    setLoading(true)
    try {
      await updateUserProfile(data)
      toast.success('Cập nhật thông tin thành công!')
      setOpen(false)
      // Refresh the page to show updated data
      router.refresh()
    } catch (error: any) {
      console.error('Error updating profile:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi cập nhật thông tin'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading && !loadingData) {
      setOpen(false)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth='md'
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          width: '100%',
          maxWidth: '600px'
        }
      }}
    >
      <DialogCloseButton onClick={handleClose} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>
      <DialogTitle variant='h4' className='text-center'>
        Cập nhật thông tin cá nhân
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent
          sx={{
            pb: theme => `${theme.spacing(6)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => `${theme.spacing(8)} !important`
          }}
        >
          <Grid container spacing={6}>
            <Grid size={12}>
              <CustomInputLabel htmlFor='full_name' required>
                Họ và tên
              </CustomInputLabel>
              <Controller
                name='full_name'
                control={control}
                rules={{ required: 'Vui lòng nhập họ và tên' }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    id='full_name'
                    placeholder='Nhập họ và tên'
                    error={!!errors.full_name}
                    helperText={errors.full_name?.message}
                    disabled={loading || loadingData}
                  />
                )}
              />
            </Grid>

            <Grid size={12}>
              <CustomInputLabel htmlFor='department' required>
                Khoa/Phòng ban
              </CustomInputLabel>
              <Controller
                name='department'
                control={control}
                rules={{ required: 'Vui lòng nhập khoa/phòng ban' }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    id='department'
                    placeholder='Nhập khoa/phòng ban'
                    error={!!errors.department}
                    helperText={errors.department?.message}
                    disabled={loading || loadingData}
                  />
                )}
              />
            </Grid>

            <Grid size={12}>
              <CustomInputLabel htmlFor='university'>Trường đại học</CustomInputLabel>
              <Controller
                name='university'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    id='university'
                    placeholder='Nhập tên trường đại học'
                    error={!!errors.university}
                    helperText={errors.university?.message}
                    disabled={loading || loadingData}
                  />
                )}
              />
            </Grid>

            <Grid size={12}>
              <CustomInputLabel htmlFor='phone_number'>Số điện thoại</CustomInputLabel>
              <Controller
                name='phone_number'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    id='phone_number'
                    placeholder='Nhập số điện thoại'
                    error={!!errors.phone_number}
                    helperText={errors.phone_number?.message}
                    disabled={loading || loadingData}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className='justify-center gap-3 pb-6'>
          <Button variant='outlined' color='secondary' onClick={handleClose} disabled={loading || loadingData}>
            Hủy
          </Button>
          <Button variant='contained' type='submit' disabled={loading || loadingData}>
            {loading ? 'Đang cập nhật...' : 'Xác nhận'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default UpdateProfileModal
