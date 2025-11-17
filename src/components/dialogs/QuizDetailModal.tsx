'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'

// Service Imports
import { getQuizDetail, type QuizDetail, type Question } from '@/services/quiz.service'

// Component Imports
import PageLoading from '@/theme/PageLoading'

// Utils Imports
import { formatDateVN } from '@/utils/dateFormat'

type QuizDetailModalProps = {
  open: boolean
  onClose: () => void
  quizId: string | null
}

const QuizDetailModal = ({ open, onClose, quizId }: QuizDetailModalProps) => {
  const [quizDetail, setQuizDetail] = useState<QuizDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open && quizId) {
      fetchQuizDetail()
    } else {
      // Reset state when modal closes
      setQuizDetail(null)
      setError(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, quizId])

  const fetchQuizDetail = async () => {
    if (!quizId) return

    setLoading(true)
    setError(null)

    try {
      const data = await getQuizDetail(quizId)

      setQuizDetail(data)
    } catch (err) {
      setError('Không thể tải chi tiết quiz. Vui lòng thử lại.')
      console.error('Error fetching quiz detail:', err)
    } finally {
      setLoading(false)
    }
  }

  const renderQuestion = (question: Question, index: number) => {
    return (
      <Card key={question.id} className='mb-4'>
        <CardContent>
          <Box className='flex items-start gap-2 mb-3'>
            <Chip label={`Câu ${index + 1}`} size='small' color='primary' />
            <Chip label={`Độ khó: ${question.level}`} size='small' variant='outlined' />
          </Box>
          <Typography variant='h6' className='mb-3'>
            {question.content}
          </Typography>
          <Divider className='mb-3' />
          <Typography variant='subtitle2' className='mb-2'>
            Đáp án:
          </Typography>
          <Box className='space-y-2'>
            {question.answers.map(answer => {
              const isMultipleChoice = String(question.type) === '2'
              const inputType = isMultipleChoice ? 'checkbox' : 'radio'

              return (
                <Box
                  key={answer.id}
                  sx={{
                    p: 2,
                    borderRadius: 1,
                    border: 1,
                    borderColor: answer.is_true ? 'success.main' : 'divider',
                    bgcolor: answer.is_true ? 'success.light' : 'action.hover'
                  }}
                >
                  <Box className='flex items-center gap-2'>
                    <input
                      type={inputType}
                      checked={answer.is_true}
                      disabled
                      readOnly
                      style={{ cursor: 'not-allowed' }}
                    />
                    <Typography variant='body1'>{answer.content}</Typography>
                    {answer.is_true && <Chip label='Đúng' size='small' color='success' sx={{ ml: 'auto' }} />}
                  </Box>
                </Box>
              )
            })}
          </Box>
        </CardContent>
      </Card>
    )
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle>Chi tiết Quiz</DialogTitle>
      <DialogContent>
        <PageLoading show={loading} />
        {error && (
          <Box className='p-4 text-center'>
            <Typography color='error'>{error}</Typography>
            <Button variant='outlined' onClick={fetchQuizDetail} className='mt-2'>
              Thử lại
            </Button>
          </Box>
        )}
        {!loading && !error && quizDetail && (
          <Box>
            <Card className='mb-4'>
              <CardContent>
                <Typography variant='h6' className='mb-2'>
                  {quizDetail.name}
                </Typography>
                <Typography variant='body2' color='text.secondary' className='mb-2'>
                  {quizDetail.description}
                </Typography>
                <Box className='flex gap-4 mt-3'>
                  <Typography variant='caption' color='text.secondary'>
                    Tạo ngày: {formatDateVN(quizDetail.created_at, true)}
                  </Typography>
                  <Typography variant='caption' color='text.secondary'>
                    Cập nhật: {formatDateVN(quizDetail.updated_at, true)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            <Divider className='my-4' />

            <Typography variant='h6' className='mb-3'>
              Danh sách câu hỏi ({quizDetail.questions.length})
            </Typography>

            {quizDetail.questions.length > 0 ? (
              <Box className='max-h-[500px] overflow-y-auto'>
                {quizDetail.questions.map((question, index) => renderQuestion(question, index))}
              </Box>
            ) : (
              <Typography color='text.secondary' className='text-center py-4'>
                Quiz này chưa có câu hỏi nào
              </Typography>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  )
}

export default QuizDetailModal
