'use client'

import { Controller, useFieldArray, useWatch } from 'react-hook-form'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid2'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Radio from '@mui/material/Radio'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

interface QuestionCardProps {
  control: any
  index: number
  onRemove: () => void
  errors: any
}

const QUESTION_TYPES = [
  { value: '1', label: 'Một đáp án đúng' },
  { value: '2', label: 'Nhiều đáp án đúng' }
]

const QUESTION_LEVELS = [
  { value: 1, label: '1', color: 'success' },
  { value: 2, label: '2', color: 'info' },
  { value: 3, label: '3', color: 'warning' },
  { value: 4, label: '4', color: 'error' }
]

export default function QuestionCard({ control, index, onRemove, errors }: QuestionCardProps) {
  const {
    fields: answerFields,
    append,
    remove,
    update
  } = useFieldArray({
    control,
    name: `questions.${index}.answers`
  })

  const questionType = useWatch({
    control,
    name: `questions.${index}.type`
  })

  const questionError = errors?.questions?.[index]

  // Handle radio button selection for single answer questions
  const handleRadioChange = (selectedIndex: number) => {
    answerFields.forEach((_, idx) => {
      update(idx, {
        ...answerFields[idx],
        is_true: idx === selectedIndex
      })
    })
  }

  return (
    <Card variant='outlined'>
      <CardContent>
        <Grid container spacing={4}>
          {/* Question Header */}
          <Grid size={{ xs: 12 }}>
            <Box className='flex items-start justify-between gap-4'>
              <Box className='flex items-center gap-2'>
                <Chip label={`Câu ${index + 1}`} color='primary' size='small' />
                <Controller
                  name={`questions.${index}.level`}
                  control={control}
                  render={({ field }) => {
                    const level = QUESTION_LEVELS.find(l => l.value === field.value)

                    return (
                      <Chip
                        label={`Độ khó: ${level?.label || '1'}`}
                        color={(level?.color as any) || 'success'}
                        size='small'
                        variant='outlined'
                      />
                    )
                  }}
                />
              </Box>
              <IconButton size='small' color='error' onClick={onRemove}>
                <i className='tabler-trash' />
              </IconButton>
            </Box>
          </Grid>

          {/* Question Content */}
          <Grid size={{ xs: 12 }}>
            <Controller
              name={`questions.${index}.content`}
              control={control}
              rules={{ required: 'Nội dung câu hỏi là bắt buộc' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  multiline
                  rows={2}
                  label='Nội dung câu hỏi'
                  placeholder='Nhập nội dung câu hỏi'
                  error={!!questionError?.content}
                  helperText={questionError?.content?.message}
                />
              )}
            />
          </Grid>

          {/* Question Type & Level */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name={`questions.${index}.type`}
              control={control}
              render={({ field }) => (
                <TextField {...field} select fullWidth label='Loại câu hỏi' size='small'>
                  {QUESTION_TYPES.map(type => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name={`questions.${index}.level`}
              control={control}
              render={({ field }) => (
                <TextField {...field} select fullWidth label='Độ khó' size='small'>
                  {QUESTION_LEVELS.map(level => (
                    <MenuItem key={level.value} value={level.value}>
                      {level.label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Divider />
          </Grid>

          {/* Answers */}
          <Grid size={{ xs: 12 }}>
            <Box className='flex items-center justify-between mb-3'>
              <Typography variant='subtitle2' className='font-semibold'>
                Đáp án
              </Typography>
              <IconButton size='small' color='primary' onClick={() => append({ content: '', is_true: false })}>
                <i className='tabler-plus' />
              </IconButton>
            </Box>

            <Box className='flex flex-col gap-3'>
              {answerFields.map((answer, answerIndex) => (
                <Box key={answer.id} className='flex items-start gap-2'>
                  <Controller
                    name={`questions.${index}.answers.${answerIndex}.is_true`}
                    control={control}
                    render={({ field }) =>
                      questionType === '1' ? (
                        <Radio
                          checked={field.value}
                          onChange={() => handleRadioChange(answerIndex)}
                          color='success'
                          sx={{ mt: 1 }}
                        />
                      ) : (
                        <Checkbox {...field} checked={field.value} color='success' sx={{ mt: 1 }} />
                      )
                    }
                  />

                  <Controller
                    name={`questions.${index}.answers.${answerIndex}.content`}
                    control={control}
                    rules={{ required: 'Nội dung đáp án là bắt buộc' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        size='small'
                        placeholder={`Đáp án ${answerIndex + 1}`}
                        error={!!questionError?.answers?.[answerIndex]?.content}
                        helperText={questionError?.answers?.[answerIndex]?.content?.message}
                      />
                    )}
                  />

                  {answerFields.length > 2 && (
                    <IconButton size='small' color='error' onClick={() => remove(answerIndex)}>
                      <i className='tabler-x' />
                    </IconButton>
                  )}
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}
