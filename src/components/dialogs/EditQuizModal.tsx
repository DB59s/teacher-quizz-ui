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
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'

// Third-party Imports
import { toast } from 'react-toastify'
import { Plus, Trash2 } from 'lucide-react'

// Service Imports
import { getQuizDetail, updateQuiz, type QuizDetail, type Question } from '@/services/quiz.service'
import { fetchApi } from '@/libs/fetchApi'

// Component Imports
import PageLoading from '@/theme/PageLoading'

type EditQuizModalProps = {
  open: boolean
  onClose: () => void
  quizId: string | null
  onUpdateSuccess?: () => void
}

type AvailableQuestion = {
  id: string
  content: string
  level: number
  type: string
}

const EditQuizModal = ({ open, onClose, quizId, onUpdateSuccess }: EditQuizModalProps) => {
  const [quizDetail, setQuizDetail] = useState<QuizDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form states
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([])

  // Available questions for adding
  const [availableQuestions, setAvailableQuestions] = useState<AvailableQuestion[]>([])
  const [loadingQuestions, setLoadingQuestions] = useState(false)
  const [showAddQuestionDialog, setShowAddQuestionDialog] = useState(false)

  useEffect(() => {
    if (open && quizId) {
      fetchQuizDetail()
      fetchAvailableQuestions()
    } else {
      // Reset state when modal closes
      setQuizDetail(null)
      setError(null)
      setName('')
      setDescription('')
      setSelectedQuestionIds([])
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
      setName(data.name)
      setDescription(data.description)
      setSelectedQuestionIds(data.questions.map(q => q.id))
    } catch (err) {
      setError('Không thể tải chi tiết quiz. Vui lòng thử lại.')
      console.error('Error fetching quiz detail:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchAvailableQuestions = async () => {
    setLoadingQuestions(true)

    try {
      const response = await fetchApi(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/questions`, {
        method: 'GET'
      })

      if (!response.ok) throw new Error('Failed to fetch questions')

      const json = await response.json()

      setAvailableQuestions(json?.data || [])
    } catch (error) {
      console.error('Error fetching available questions:', error)
    } finally {
      setLoadingQuestions(false)
    }
  }

  const handleAddQuestion = (questionId: string) => {
    if (!selectedQuestionIds.includes(questionId)) {
      setSelectedQuestionIds([...selectedQuestionIds, questionId])
      setShowAddQuestionDialog(false)
      toast.success('Đã thêm câu hỏi', { position: 'bottom-right', autoClose: 2000 })
    }
  }

  const handleRemoveQuestion = (questionId: string) => {
    setSelectedQuestionIds(selectedQuestionIds.filter(id => id !== questionId))
    toast.success('Đã xóa câu hỏi', { position: 'bottom-right', autoClose: 2000 })
  }

  const handleSave = async () => {
    if (!quizId || !name.trim()) {
      toast.error('Vui lòng nhập tên quiz', { position: 'bottom-right' })

      return
    }

    setSaving(true)

    try {
      await updateQuiz(quizId, {
        name: name.trim(),
        description: description.trim(),
        question_ids: selectedQuestionIds
      })

      toast.success('Cập nhật quiz thành công!', {
        position: 'bottom-right',
        autoClose: 3000
      })

      if (onUpdateSuccess) {
        onUpdateSuccess()
      }

      // Refresh quiz detail
      await fetchQuizDetail()
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra khi cập nhật quiz', {
        position: 'bottom-right',
        autoClose: 3000
      })
    } finally {
      setSaving(false)
    }
  }

  const getQuestionById = (questionId: string): Question | undefined => {
    return quizDetail?.questions.find(q => q.id === questionId)
  }

  const getAvailableQuestionsToAdd = () => {
    return availableQuestions.filter(q => !selectedQuestionIds.includes(q.id))
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle>Chỉnh sửa Quiz</DialogTitle>
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
          <Box className='space-y-4'>
            {/* Quiz Info */}
            <Box>
              <TextField
                fullWidth
                label='Tên quiz'
                value={name}
                onChange={e => setName(e.target.value)}
                className='mb-3 mt-2'
              />
              <TextField
                fullWidth
                multiline
                rows={3}
                label='Mô tả'
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </Box>

            <Divider />

            {/* Questions Section */}
            <Box>
              <Box className='flex items-center justify-between mb-3'>
                <Typography variant='h6'>Danh sách câu hỏi ({selectedQuestionIds.length})</Typography>
                <Button
                  variant='outlined'
                  size='small'
                  startIcon={<Plus size={18} />}
                  onClick={() => setShowAddQuestionDialog(true)}
                >
                  Thêm câu hỏi
                </Button>
              </Box>

              {selectedQuestionIds.length > 0 ? (
                <Box className='max-h-[400px] overflow-y-auto space-y-2'>
                  {selectedQuestionIds.map((questionId, index) => {
                    const question = getQuestionById(questionId)
                    const availableQuestion = availableQuestions.find(q => q.id === questionId)

                    return (
                      <Card key={questionId}>
                        <CardContent>
                          <Box className='flex items-start justify-between'>
                            <Box className='flex-1'>
                              <Box className='flex items-center gap-2 mb-2'>
                                <Chip label={`Câu ${index + 1}`} size='small' color='primary' />
                                {question && (
                                  <>
                                    <Chip label={`Độ khó: ${question.level}`} size='small' variant='outlined' />
                                    <Chip
                                      label={`Loại: ${question.type === '1' ? 'Trắc nghiệm' : 'Tự luận'}`}
                                      size='small'
                                      variant='outlined'
                                    />
                                  </>
                                )}
                                {availableQuestion && !question && (
                                  <Chip label={`Độ khó: ${availableQuestion.level}`} size='small' variant='outlined' />
                                )}
                              </Box>
                              <Typography variant='body1'>
                                {question?.content || availableQuestion?.content || 'Đang tải...'}
                              </Typography>
                            </Box>
                            <IconButton
                              size='small'
                              color='error'
                              onClick={() => handleRemoveQuestion(questionId)}
                              className='ml-2'
                            >
                              <Trash2 size={18} />
                            </IconButton>
                          </Box>
                        </CardContent>
                      </Card>
                    )
                  })}
                </Box>
              ) : (
                <Typography color='text.secondary' className='text-center py-4'>
                  Chưa có câu hỏi nào. Nhấn &quot;Thêm câu hỏi&quot; để thêm.
                </Typography>
              )}
            </Box>

            {/* Add Question Section */}
            {showAddQuestionDialog && (
              <Box className='mt-4 p-4 border rounded'>
                <Box className='flex items-center justify-between mb-3'>
                  <Typography variant='h6'>Chọn câu hỏi để thêm</Typography>
                  <Button size='small' onClick={() => setShowAddQuestionDialog(false)}>
                    Đóng
                  </Button>
                </Box>
                <PageLoading show={loadingQuestions} />
                {getAvailableQuestionsToAdd().length > 0 ? (
                  <Box className='max-h-[300px] overflow-y-auto space-y-2'>
                    {getAvailableQuestionsToAdd().map(question => (
                      <Card
                        key={question.id}
                        className='cursor-pointer hover:bg-action-hover'
                        onClick={() => handleAddQuestion(question.id)}
                      >
                        <CardContent>
                          <Box className='flex items-start justify-between'>
                            <Box className='flex-1'>
                              <Box className='flex items-center gap-2 mb-2'>
                                <Chip label={`Độ khó: ${question.level}`} size='small' variant='outlined' />
                                <Chip
                                  label={`Loại: ${question.type === '1' ? 'Trắc nghiệm' : 'Tự luận'}`}
                                  size='small'
                                  variant='outlined'
                                />
                              </Box>
                              <Typography variant='body1'>{question.content}</Typography>
                            </Box>
                            <Button size='small' variant='outlined' className='ml-2'>
                              Thêm
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                ) : (
                  <Typography color='text.secondary' className='text-center py-4'>
                    Không còn câu hỏi nào để thêm
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saving}>
          Hủy
        </Button>
        <Button variant='contained' onClick={handleSave} disabled={saving || loading}>
          {saving ? 'Đang lưu...' : 'Lưu'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditQuizModal
