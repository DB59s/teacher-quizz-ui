'use client'

import { useEffect, useState } from 'react'

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

import { getSubmissionDetail, type SubmissionDetail } from '@/services/submission.service'
import PageLoading from '@/theme/PageLoading'
import { formatDateVN } from '@/utils/dateFormat'
import { useQuestionDetails, getLevelLabel, getTypeLabel } from '@/hooks/useQuestionDetails'

type SubmissionDetailModalProps = {
  open: boolean
  onClose: () => void
  submissionId: string | null
}

const SubmissionDetailModal = ({ open, onClose, submissionId }: SubmissionDetailModalProps) => {
  const [submissionDetail, setSubmissionDetail] = useState<SubmissionDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get question IDs from submission detail
  const questionIds = submissionDetail?.detailed_results.map(result => result.question_id) || []

  // Fetch question details (level, type)
  const { questionDetails } = useQuestionDetails(questionIds)

  useEffect(() => {
    if (open && submissionId) {
      fetchSubmissionDetail()
    } else {
      setSubmissionDetail(null)
      setError(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, submissionId])

  const fetchSubmissionDetail = async () => {
    if (!submissionId) return

    setLoading(true)
    setError(null)

    try {
      const data = await getSubmissionDetail(submissionId)
      
      setSubmissionDetail(data)
      
    } catch (err) {
      setError('Không thể tải chi tiết bài nộp. Vui lòng thử lại.')
      console.error('Error fetching submission detail:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle>Chi tiết bài nộp</DialogTitle>
      <DialogContent>
        <PageLoading show={loading} />
        {error && (
          <Box className='p-4 text-center'>
            <Typography color='error'>{error}</Typography>
            <Button variant='outlined' onClick={fetchSubmissionDetail} className='mt-2'>
              Thử lại
            </Button>
          </Box>
        )}
        {!loading && !error && submissionDetail && (
          <Box>
            <Card className='mb-4'>
              <CardContent>
                <Typography variant='h6' className='mb-2'>
                  {submissionDetail.quiz_name}
                </Typography>
                <Box className='flex gap-4 flex-wrap'>
                  <Box>
                    <Typography variant='caption' color='text.secondary'>
                      Điểm số
                    </Typography>
                    <Typography variant='h5' color='primary'>
                      {submissionDetail.score}/{submissionDetail.total_questions}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant='caption' color='text.secondary'>
                      Số câu đúng
                    </Typography>
                    <Typography variant='h5' color='success.main'>
                      {submissionDetail.n_total_true}/{submissionDetail.total_questions}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant='caption' color='text.secondary'>
                      Thời gian nộp
                    </Typography>
                    <Typography variant='body1'>{formatDateVN(submissionDetail.submission_time, true)}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            <Divider className='my-4' />

            <Typography variant='h6' className='mb-3'>
              Chi tiết từng câu hỏi
            </Typography>

            {submissionDetail.detailed_results.length > 0 ? (
              <Box className='max-h-[500px] overflow-y-auto space-y-3'>
                {submissionDetail.detailed_results.map((result, index) => {
                  const questionDetail = questionDetails[result.question_id]

                  return (
                    <Card key={result.question_id} variant='outlined'>
                      <CardContent>
                        <Box className='flex items-start gap-2 mb-3'>
                          <Chip label={`Câu ${index + 1}`} size='small' color='primary' />
                          {questionDetail && (
                            <>
                              <Chip
                                label={`Độ khó: ${getLevelLabel(questionDetail.level)}`}
                                size='small'
                                variant='outlined'
                              />
                              <Chip
                                label={getTypeLabel(questionDetail.type)}
                                size='small'
                                variant='outlined'
                                color='secondary'
                              />
                            </>
                          )}
                        </Box>
                        <Typography variant='body1' className='mb-3 font-medium'>
                          {result.content}
                        </Typography>
                        <Divider className='mb-3' />
                        <Typography variant='subtitle2' className='mb-2'>
                          Đáp án:
                        </Typography>
                        <Box className='space-y-2'>
                          {result.answers.map(answer => {
                            const isCorrect = answer.is_correct
                            const isSelected = answer.student_selected

                            return (
                              <Box
                                key={answer.answer_id}
                                sx={{
                                  p: 2,
                                  borderRadius: 1,
                                  border: 1,
                                  borderColor: isCorrect ? 'success.main' : isSelected ? 'error.main' : 'divider',
                                  bgcolor: isCorrect ? 'success.light' : isSelected ? 'error.light' : 'action.hover'
                                }}
                              >
                                <Box className='flex items-center gap-2'>
                                  <input
                                    type='checkbox'
                                    checked={isSelected}
                                    disabled
                                    readOnly
                                    style={{ cursor: 'not-allowed' }}
                                  />
                                  <Typography variant='body1' className='flex-1'>
                                    {answer.content}
                                  </Typography>
                                  {isCorrect && <Chip label='Đáp án đúng' size='small' color='success' />}
                                  {isSelected && !isCorrect && <Chip label='Đã chọn sai' size='small' color='error' />}
                                </Box>
                              </Box>
                            )
                          })}
                        </Box>
                      </CardContent>
                    </Card>
                  )
                })}
              </Box>
            ) : (
              <Typography color='text.secondary' className='text-center py-4'>
                Không có dữ liệu chi tiết
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

export default SubmissionDetailModal
