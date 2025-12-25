'use client'

import { useEffect, useState } from 'react'

import { Controller, type Control, type FieldErrors } from 'react-hook-form'

import Autocomplete from '@mui/material/Autocomplete'
import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'
import ListItemText from '@mui/material/ListItemText'

import CustomTextField from '@/@core/components/mui/TextField'
import CustomInputLabel from '@/components/form/CustomInputLabel'
import { apiClient } from '@/libs/axios-client'

type Subject = {
  id: string
  name: string
}

type SubjectAutocompleteProps = {
  control: Control<any>
  name: string
  errors?: FieldErrors<any>
  required?: boolean
  label?: string
  placeholder?: string
}

export default function SubjectAutocomplete({
  control,
  name,
  errors,
  required = false,
  label = 'Môn học liên quan',
  placeholder = 'Tìm kiếm và chọn môn học...'
}: SubjectAutocompleteProps) {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loadingSubjects, setLoadingSubjects] = useState(false)
  const [errorSubjects, setErrorSubjects] = useState('')

  useEffect(() => {
    setLoadingSubjects(true)
    apiClient.get('/api/v1/subjects?page=1&limit=100')
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

  return (
    <div className='flex flex-col'>
      <CustomInputLabel required={required}>{label}</CustomInputLabel>
      <Controller
        name={name}
        control={control}
        rules={{
          validate: v => !required || (v && v.length > 0) || 'Chọn ít nhất một môn học'
        }}
        render={({ field }) => (
          <Autocomplete
            multiple
            options={subjects}
            getOptionLabel={option => option.name}
            value={subjects.filter(sub => field.value?.includes(sub.id))}
            onChange={(_, newValue) => {
              field.onChange(newValue.map((sub: Subject) => sub.id))
            }}
            onBlur={field.onBlur}
            loading={loadingSubjects}
            renderInput={params => (
              <CustomTextField
                {...params}
                placeholder={placeholder}
                error={!!errors?.[name]}
                helperText={errors?.[name]?.message as string}
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => {
                const { key, ...tagProps } = getTagProps({ index })

                return <Chip key={key ?? option.id} label={option.name} {...tagProps} size='small' />
              })
            }
            renderOption={(props, option, { selected }) => {
              const { key, ...optionProps } = props

              return (
                <li key={key} {...optionProps}>
                  <Checkbox checked={selected} />
                  <ListItemText primary={option.name} />
                </li>
              )
            }}
            filterOptions={(options, { inputValue }) => {
              return options.filter(option => option.name.toLowerCase().includes(inputValue.toLowerCase()))
            }}
            noOptionsText='Không tìm thấy môn học nào'
            loadingText='Đang tải danh sách môn học...'
            sx={{
              '& .MuiAutocomplete-tag': {
                margin: '2px'
              }
            }}
          />
        )}
      />
      {errorSubjects && <span style={{ color: 'red', fontSize: '0.75rem', marginTop: '4px' }}>{errorSubjects}</span>}
    </div>
  )
}
