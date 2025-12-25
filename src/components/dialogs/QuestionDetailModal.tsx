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
import { getQuestionDetail, type QuestionDetail, type Answer } from '@/services/question.service'
import { apiClient } from '@/libs/axios-client'

// Component Imports
import PageLoading from '@/theme/PageLoading'

// Utils Imports
import { formatDateVN } from '@/utils/dateFormat'

type QuestionDetailModalProps = {
  open: boolean
  onClose: () => void
  questionId: string | null
}

const QuestionDetailModal = ({ open, onClose, questionId }: QuestionDetailModalProps) => {
  const [questionDetail, setQuestionDetail] = useState<QuestionDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([])

  useEffect(() => {
    if (open && questionId) {
      fetchQuestionDetail()
    } else {
      // Reset state when modal closes
      setQuestionDetail(null)
      setError(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, questionId])

  useEffect(() => {
    // Fetch subjects list when modal opens
    if (open) {
      apiClient.get('/api/v1/subjects?page=1&limit=100')
        .then(res => {
          setSubjects(res.data?.data || [])
        })
        .catch(err => {
          console.error('Error fetching subjects:', err)
        })
    }
  }, [open])

  const fetchQuestionDetail = async () => {
    if (!questionId) return

    setLoading(true)
    setError(null)

    try {
      const data = await getQuestionDetail(questionId)

      setQuestionDetail(data)
    } catch (err) {
      setError('Không thể tải chi tiết câu hỏi. Vui lòng thử lại.')
      console.error('Error fetching question detail:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle>Chi tiết câu hỏi</DialogTitle>
      <DialogContent>
        <PageLoading show={loading} />
        {error && (
          <Box className='p-4 text-center'>
            <Typography color='error'>{error}</Typography>
            <Button variant='outlined' onClick={fetchQuestionDetail} className='mt-2'>
              Thử lại
            </Button>
          </Box>
        )}
        {!loading && !error && questionDetail && (
          <Box>
            <Card className='mb-4'>
              <CardContent>
                <Box className='flex items-center gap-2 mb-3'>
                  <Chip label={`Độ khó: ${questionDetail.level}`} size='small' color='primary' />
                  <Chip label={`Loại: ${questionDetail.type}`} size='small' variant='outlined' />
                </Box>
                <Typography variant='h6' className='mb-3'>
                  {questionDetail.content}
                </Typography>
                <Divider className='mb-3' />
                <Box className='flex gap-4 mt-3'>
                  <Typography variant='caption' color='text.secondary'>
                    Tạo ngày: {formatDateVN(questionDetail.created_at, true)}
                  </Typography>
                  <Typography variant='caption' color='text.secondary'>
                    Cập nhật: {formatDateVN(questionDetail.updated_at, true)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            <Divider className='my-4' />

            <Typography variant='h6' className='mb-3'>
              Đáp án ({questionDetail.answers.length})
            </Typography>

            {questionDetail.answers.length > 0 ? (
              <Box className='space-y-2'>
                {questionDetail.answers.map((answer: Answer, answerIndex: number) => (
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
                      <Typography variant='body1'>
                        {String.fromCharCode(65 + answerIndex)}. {answer.content}
                      </Typography>
                      {answer.is_true && <Chip label='Đúng' size='small' color='success' sx={{ ml: 'auto' }} />}
                    </Box>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography color='text.secondary' className='text-center py-4'>
                Câu hỏi này chưa có đáp án nào
              </Typography>
            )}

            {questionDetail.subject_ids && questionDetail.subject_ids.length > 0 && (
              <>
                <Divider className='my-4' />
                <Typography variant='h6' className='mb-3'>
                  Môn học liên quan
                </Typography>
                <Box className='flex flex-wrap gap-2'>
                  {questionDetail.subject_ids.map((subjectId: string) => {
                    const subject = subjects.find(sub => sub.id === subjectId)

                    return (
                      <Chip
                        key={subjectId}
                        label={subject?.name || subjectId}
                        size='small'
                        variant='outlined'
                        color='primary'
                      />
                    )
                  })}
                </Box>
              </>
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

export default QuestionDetailModal
