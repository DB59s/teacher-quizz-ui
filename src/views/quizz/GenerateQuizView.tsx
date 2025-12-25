'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { toast } from 'react-toastify'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

import UploadPDFSection from '@/components/quizz/generate/UploadPDFSection'
import GeneratedQuizForm from '@/components/quizz/generate/GeneratedQuizForm'

import { generateQuizFromPDF, checkQuizStatus } from '@/services/gemini.service'
import type { GeminiQuestion } from '@/types/gemini'

export default function GenerateQuizView() {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedQuestions, setGeneratedQuestions] = useState<GeminiQuestion[]>([])
  const [showForm, setShowForm] = useState(false)

  const handleFileUpload = async (file: File) => {
    setIsGenerating(true)
    const toastId = toast.loading('Đang upload file PDF...')

    try {
      // Step 1: Upload PDF and get job_id
      const uploadResponse = await generateQuizFromPDF(file)

      if (uploadResponse.success && uploadResponse.data.job_id) {
        const jobId = uploadResponse.data.job_id

        // Update toast: upload success, now processing
        toast.update(toastId, {
          render: 'Upload thành công! Đang phân tích và tạo câu hỏi...',
          isLoading: true
        })

        // Step 2: Poll status every 2-3 seconds
        const pollInterval = setInterval(async () => {
          try {
            const statusResponse = await checkQuizStatus(jobId)

            if (statusResponse.data.status === 'completed' && statusResponse.data.questions) {
              // Completed successfully
              clearInterval(pollInterval)
              setGeneratedQuestions(statusResponse.data.questions)
              setShowForm(true)
              setIsGenerating(false)

              toast.update(toastId, {
                render: `Đã tạo ${statusResponse.data.total} câu hỏi thành công! 🎉`,
                type: 'success',
                isLoading: false,
                autoClose: 3000
              })
            } else if (statusResponse.data.status === 'failed') {
              // Failed
              clearInterval(pollInterval)
              setIsGenerating(false)

              toast.update(toastId, {
                render: statusResponse.data.error || 'Không thể tạo quiz từ file PDF',
                type: 'error',
                isLoading: false,
                autoClose: 5000
              })
            } else {
              // Still processing - update progress message
              const progressText =
                statusResponse.data.processed_questions && statusResponse.data.total_questions
                  ? `Đang xử lý: ${statusResponse.data.processed_questions}/${statusResponse.data.total_questions} câu hỏi...`
                  : 'Đang phân tích và tạo câu hỏi...'

              toast.update(toastId, {
                render: progressText,
                isLoading: true
              })
            }
          } catch (pollError: any) {
            console.error('Error polling status:', pollError)
            clearInterval(pollInterval)
            setIsGenerating(false)

            toast.update(toastId, {
              render: 'Lỗi khi kiểm tra trạng thái xử lý',
              type: 'error',
              isLoading: false,
              autoClose: 5000
            })
          }
        }, 2500) // Poll every 2.5 seconds
      }
    } catch (error: any) {
      setIsGenerating(false)
      toast.update(toastId, {
        render: error.message || 'Không thể upload file PDF',
        type: 'error',
        isLoading: false,
        autoClose: 5000
      })
      console.error('Error:', error)
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
