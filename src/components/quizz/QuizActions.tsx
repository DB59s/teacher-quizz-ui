'use client'

import { useFormContext } from 'react-hook-form'
import { toast } from 'react-toastify'

import Button from '@mui/material/Button'
import Box from '@mui/material/Box'

import { fetchApi } from '@/libs/fetchApi'

import type { CreateQuizFormData, CreateQuizRequest } from '@/types/quiz'

interface QuizActionsProps {
  onSuccess?: () => void
  isLoading?: boolean
  setIsLoading?: (loading: boolean) => void
}

export default function QuizActions({ onSuccess, isLoading, setIsLoading }: QuizActionsProps) {
  const {
    handleSubmit,
    formState: { isValid }
  } = useFormContext<CreateQuizFormData>()

  const onSubmit = async (data: CreateQuizFormData) => {
    if (!data.question_ids || data.question_ids.length === 0) {
      toast.error('Vui lòng chọn ít nhất một câu hỏi', {
        position: 'bottom-right'
      })

      return
    }

    setIsLoading?.(true)

    const payload: CreateQuizRequest = {
      name: data.name,
      description: data.description,
      question_ids: data.question_ids
    }

    try {
      const response = await fetchApi(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/quizzes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const errorData = await response.json()

        throw new Error(errorData.message || 'Tạo quiz thất bại')
      }

      toast.success('Tạo quiz thành công!', {
        position: 'bottom-right'
      })

      onSuccess?.()
    } catch (error: any) {
      console.error('Error creating quiz:', error)
      toast.error(error.message || 'Có lỗi xảy ra khi tạo quiz', {
        position: 'bottom-right'
      })
    } finally {
      setIsLoading?.(false)
    }
  }

  return (
    <Box className='flex justify-end gap-4 mt-6'>
      <Button variant='outlined' disabled={isLoading}>
        Hủy
      </Button>

      <Button variant='contained' onClick={handleSubmit(onSubmit)} disabled={isLoading || !isValid}>
        {isLoading ? 'Đang tạo...' : 'Tạo Quiz'}
      </Button>
    </Box>
  )
}
