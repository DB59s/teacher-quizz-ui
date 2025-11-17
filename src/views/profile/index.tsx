'use client'

import { useCallback, useEffect, useState } from 'react'

import Card from '@mui/material/Card'

import { Controller, FormProvider, useForm } from 'react-hook-form'

import Grid from '@mui/material/Grid2'

import { apiClient } from '@/libs/axios-client'
import FormComponent from '@/components/Form'
import CustomInputLabel from '@/components/form/CustomInputLabel'
import TextField from '@/@core/components/mui/TextField'

type User = {
  department: string
  email: string
  full_name: string
  phone_number: string
  university: string
}

export default function Profile() {
  const [, setUserProfile] = useState(null)

  const methods = useForm<User>({
    defaultValues: {
      department: '',
      email: '',
      full_name: '',
      phone_number: '',
      university: ''
    }
  })

  const { control, reset } = methods

  const fetchUserProfile = useCallback(async () => {
    try {
      const response = await apiClient.get('/api/v1/users/me')

      const profileData = response.data?.data

      setUserProfile(profileData)

      // Tự động fill dữ liệu vào form
      if (profileData) {
        reset({
          department: profileData.department || '',
          email: profileData.email || '',
          full_name: profileData.full_name || '',
          phone_number: profileData.phone_number || '',
          university: profileData.university || ''
        })
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }, [reset])

  useEffect(() => {
    fetchUserProfile()
  }, [fetchUserProfile])

  return (
    <Card className='p-6'>
      <FormProvider {...methods}>
        <FormComponent onSubmit={() => {}}>
          <Grid container spacing={6}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomInputLabel>Họ và tên</CustomInputLabel>
              <Controller
                name='full_name'
                control={control}
                render={({ field }) => <TextField {...field} variant='outlined' fullWidth disabled />}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomInputLabel>Email</CustomInputLabel>
              <Controller
                name='email'
                control={control}
                render={({ field }) => <TextField {...field} variant='outlined' fullWidth disabled />}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomInputLabel>Khoa/Phòng ban</CustomInputLabel>
              <Controller
                name='department'
                control={control}
                render={({ field }) => <TextField {...field} variant='outlined' fullWidth disabled />}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomInputLabel>Trường đại học</CustomInputLabel>
              <Controller
                name='university'
                control={control}
                render={({ field }) => <TextField {...field} variant='outlined' fullWidth disabled />}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomInputLabel>Số điện thoại</CustomInputLabel>
              <Controller
                name='phone_number'
                control={control}
                render={({ field }) => <TextField {...field} variant='outlined' fullWidth disabled />}
              />
            </Grid>
          </Grid>
        </FormComponent>
      </FormProvider>
    </Card>
  )
}
