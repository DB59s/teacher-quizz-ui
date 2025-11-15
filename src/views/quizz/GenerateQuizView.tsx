'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { toast } from 'react-toastify'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

import UploadPDFSection from '@/components/quizz/generate/UploadPDFSection'
import GeneratedQuizForm from '@/components/quizz/generate/GeneratedQuizForm'

import { generateQuizFromPDF } from '@/services/gemini.service'
import type { GeminiQuestion } from '@/types/gemini'

export default function GenerateQuizView() {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedQuestions, setGeneratedQuestions] = useState<GeminiQuestion[]>([])
  const [showForm, setShowForm] = useState(false)

  const handleFileUpload = async (file: File) => {
    setIsGenerating(true)
    const toastId = toast.loading('Đang phân tích file PDF và tạo câu hỏi...')

    try {
      const response = await generateQuizFromPDF(file)

      if (response.success && response.data.questions) {
        setGeneratedQuestions(response.data.questions)
        setShowForm(true)
        toast.update(toastId, {
          render: `Đã tạo ${response.data.total} câu hỏi thành công! 🎉`,
          type: 'success',
          isLoading: false,
          autoClose: 3000
        })
      }
    } catch (error: any) {
      toast.update(toastId, {
        render: error.message || 'Không thể tạo quiz từ file PDF',
        type: 'error',
        isLoading: false,
        autoClose: 5000
      })
      console.error('Error:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSuccess = () => {
    toast.success('Tạo quiz thành công!')
    router.push('/quizz')
  }

  const handleReset = () => {
    setShowForm(false)
    setGeneratedQuestions([])
  }

  return (
    <Card>
      <CardContent>
        {!showForm ? (
          <UploadPDFSection onFileUpload={handleFileUpload} isGenerating={isGenerating} />
        ) : (
          <GeneratedQuizForm questions={generatedQuestions} onSuccess={handleSuccess} onReset={handleReset} />
        )}
      </CardContent>
    </Card>
  )
}
