'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// MUI Imports
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Grid from '@mui/material/Grid2'
import InputAdornment from '@mui/material/InputAdornment'
import Button from '@mui/material/Button'

// Third-party Imports
import classnames from 'classnames'
import { toast } from 'react-toastify'

// React Hook Form Imports
import { Controller, useForm } from 'react-hook-form'

// Type Imports
import type { SystemMode } from '@core/types'

// Component Imports
import Logo from '@components/layout/shared/Logo'
import CustomTextField from '@core/components/mui/TextField'
import CustomInputLabel from '@/components/form/CustomInputLabel'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'
import { useSettings } from '@core/hooks/useSettings'

// No API imports needed for fetch

type FormValues = {
  email: string
  password: string
  full_name: string
  phone_number: string
  department: string
  university: string
  agree_to_terms: boolean
}

// Styled Custom Components
const RegisterIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  blockSize: 'auto',
  maxBlockSize: 600,
  maxInlineSize: '100%',
  margin: theme.spacing(12),
  [theme.breakpoints.down(1536)]: {
    maxBlockSize: 550
  },
  [theme.breakpoints.down('lg')]: {
    maxBlockSize: 450
  }
}))

const MaskImg = styled('img')({
  blockSize: 'auto',
  maxBlockSize: 345,
  inlineSize: '100%',
  position: 'absolute',
  insetBlockEnd: 0,
  zIndex: -1
})

const Register = ({ mode }: { mode: SystemMode }) => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Vars
  const darkImg = '/images/pages/auth-mask-dark.png'
  const lightImg = '/images/pages/auth-mask-light.png'
  const darkIllustration = '/images/illustrations/auth/v2-register-dark.png'
  const lightIllustration = '/images/illustrations/auth/v2-register-light.png'
  const borderedDarkIllustration = '/images/illustrations/auth/v2-register-dark-border.png'
  const borderedLightIllustration = '/images/illustrations/auth/v2-register-light-border.png'

  // Hooks

  const router = useRouter()
  const { settings } = useSettings()
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const authBackground = useImageVariant(mode, lightImg, darkImg)

  const characterIllustration = useImageVariant(
    mode,
    lightIllustration,
    darkIllustration,
    borderedLightIllustration,
    borderedDarkIllustration
  )

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const {
    handleSubmit,
    control,
    setError,
    clearErrors,
    formState: { errors }
  } = useForm<FormValues>({
    defaultValues: {
      email: '',
      full_name: '',
      password: '',
      phone_number: '',
      department: '',
      university: '',
      agree_to_terms: false
    },
    mode: 'onBlur'
  })

  const onSubmit = async (data: FormValues) => {
    clearErrors()
    setIsLoading(true)

    const payload = {
      email: data.email,
      full_name: data.full_name,
      password: data.password,
      phone_number: data.phone_number,
      department: data.department,
      university: data.university
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (response.ok && data.success) {
        router.push('/login')

        toast.success('Đăng ký thành công!', {
          position: 'bottom-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true
        })
      } else {
        if (data.error === 'Email already exists') {
          setError('email', {
            message: 'Email already exists'
          })
        } else {
          toast.error(data.message || 'Registration failed!', {
            position: 'bottom-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true
          })
        }
      }
    } catch (error: any) {
      toast.error('Network error. Please try again.', {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='flex bs-full justify-center'>
      <div
        className={classnames(
          'flex bs-full items-center justify-center flex-1 min-bs-[100dvh] relative p-6 max-md:hidden',
          {
            'border-ie': settings.skin === 'bordered'
          }
        )}
      >
        <RegisterIllustration src={characterIllustration} alt='character-illustration' />
        {!hidden && <MaskImg alt='mask' src={authBackground} />}
      </div>
      <div className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[700px]'>
        <Link
          href={'/login'}
          className='absolute block-start-5 sm:block-start-[33px] inline-start-6 sm:inline-start-[38px]'
        >
          <Logo />
        </Link>
        <div className='flex flex-col gap-6 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-8 sm:mbs-11 md:mbs-0'>
          <div className='flex flex-col gap-1'>
            <Typography variant='h4'>Tạo tài khoản</Typography>
          </div>
          <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)} className='flex flex-col'>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <CustomInputLabel>Họ và tên</CustomInputLabel>
                <Controller
                  name='full_name'
                  control={control}
                  rules={{
                    validate: value => {
                      if (!value) {
                        return 'Vui lòng nhập họ và tên'
                      }
                    }
                  }}
                  render={({ field }) => (
                    <CustomTextField
                      fullWidth
                      required
                      placeholder='Nhập họ và tên'
                      {...field}
                      {...(errors.full_name && {
                        error: true,
                        helperText: errors.full_name.message
                      })}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 6 }}>
                <CustomInputLabel>Email</CustomInputLabel>
                <Controller
                  name='email'
                  control={control}
                  rules={{
                    validate: value => {
                      if (!value) {
                        return 'Vui lòng nhập email'
                      }
                    }
                  }}
                  render={({ field }) => (
                    <CustomTextField
                      fullWidth
                      required
                      placeholder='Nhập email'
                      {...field}
                      onChange={e => {
                        field.onChange(e.target.value)
                      }}
                      {...(errors.email && {
                        error: true,
                        helperText: errors.email.message
                      })}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 6 }}>
                <CustomInputLabel>Số điện thoại</CustomInputLabel>
                <Controller
                  name='phone_number'
                  control={control}
                  rules={{
                    validate: value => {
                      if (!value) {
                        return 'Vui lòng nhập số điện thoại'
                      }
                    }
                  }}
                  render={({ field }) => (
                    <CustomTextField
                      fullWidth
                      required
                      placeholder='Nhập số điện thoại'
                      {...field}
                      onChange={e => {
                        field.onChange(e.target.value)
                      }}
                      {...(errors.phone_number && {
                        error: true,
                        helperText: errors.phone_number.message
                      })}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <CustomInputLabel>Mật khẩu</CustomInputLabel>
                <Controller
                  name='password'
                  control={control}
                  rules={{
                    validate: value => {
                      if (!value) {
                        return 'Vui lòng nhập mật khẩu'
                      }

                      if (value.length < 8) {
                        return 'Mật khẩu phải có ít nhất 8 ký tự'
                      }

                      return true
                    }
                  }}
                  render={({ field }) => (
                    <CustomTextField
                      fullWidth
                      required
                      {...field}
                      placeholder='Nhập mật khẩu'
                      id='outlined-adornment-password'
                      type={isPasswordShown ? 'text' : 'password'}
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment position='end'>
                              <IconButton
                                edge='end'
                                onClick={handleClickShowPassword}
                                onMouseDown={e => e.preventDefault()}
                                aria-label='toggle password visibility'
                              >
                                <i className={isPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                              </IconButton>
                            </InputAdornment>
                          )
                        }
                      }}
                      {...(errors.password && {
                        error: true,
                        helperText: errors.password.message
                      })}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <CustomInputLabel>Khoa</CustomInputLabel>
                <Controller
                  name='department'
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      fullWidth
                      required
                      placeholder='Nhập khoa'
                      {...field}
                      onChange={e => {
                        field.onChange(e.target.value)
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <CustomInputLabel>Trường</CustomInputLabel>
                <Controller
                  name='university'
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      fullWidth
                      required
                      placeholder='Nhập trường'
                      {...field}
                      onChange={e => {
                        field.onChange(e.target.value)
                      }}
                    />
                  )}
                />
              </Grid>
              <span>Tôi đồng ý với <span className='text-primary'>chính sách bảo mật & điều khoản</span></span>
              <Button fullWidth variant='contained' type='submit' disabled={isLoading}>
                {isLoading ? 'Signing Up...' : 'Sign Up'}
              </Button>
              <div className='flex justify-'></div>
              <div className='flex justify-center items-center flex-wrap gap-2'>
                <Typography>Bạn đã có tài khoản?</Typography>
                <Typography component={Link} href={'/login'} color='primary.main'>
                  Đăng nhập
                </Typography>
              </div>
            </Grid>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register
