'use client'

import type { ChangeEvent } from 'react'
import { useCallback, useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'

import clsx from 'clsx'
import { Edit2, Eye, Trash } from 'iconsax-react'
import { BookOpen, FileText, BarChart } from 'lucide-react'
import { toast } from 'react-toastify'

import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid2'

import { apiClient } from '@/libs/axios-client'
import PageLoading from '@/theme/PageLoading'
import CustomIconButton from '@/@core/components/mui/IconButton'
import TableRCPaginationCustom from '@/components/table/TableRCPaginationCustom'
import QuizDetailModal from '@/components/dialogs/QuizDetailModal'
import EditQuizModal from '@/components/dialogs/EditQuizModal'

// import { deleteQuiz } from '@/services/quiz.service'

import { deleteClassQuiz, getClassQuizDetail, updateClassQuiz } from '@/services/classQuizzes.service'
import useClassQuizzes from '@/hooks/useClassQuizzes'
import { getQuizStatistics, type QuizStatistics } from '@/services/submission.service'

type Quiz = {
  id: string
  name: string
  description: string
  teacher_id: string
  created_at: string
  updated_at: string
}

type ClassQuiz = {
  id: string
  quiz_id: string
  class_id: string
  start_time: string
  end_time: string
  quiz: Quiz
  created_at: string
  updated_at: string
}

type PaginationData = {
  currentPage: number
  itemsPerPage: number
  totalItems: number
  totalPages: number
}

export default function Exercises({ data }: any) {
  const class_id = data?._id
  const router = useRouter()

  // Hook to get class quizzes
  const { quizIds: addedQuizIds, refetch: refetchClassQuizzes } = useClassQuizzes(class_id)

  // States for available quizzes
  const [availableQuizzes, setAvailableQuizzes] = useState<Quiz[]>([])
  const [loadingQuizzes, setLoadingQuizzes] = useState(false)
  const [showQuizDialog, setShowQuizDialog] = useState(false)

  // Filter out quizzes that are already added to the class
  const filteredAvailableQuizzes = availableQuizzes.filter(quiz => !addedQuizIds.includes(quiz.id))

  // States for class quizzes table
  const [classQuizzes, setClassQuizzes] = useState<ClassQuiz[]>([])
  const [loadingClassQuizzes, setLoadingClassQuizzes] = useState(false)
  const [paginationData, setPaginationData] = useState<PaginationData | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // States for quiz selection and confirmation
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')

  // States for quiz detail modal
  const [showQuizDetailModal, setShowQuizDetailModal] = useState(false)
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null)
  const [loadingClassQuizDetail, setLoadingClassQuizDetail] = useState(false)

  // States for edit class quiz modal
  const [showEditQuizModal, setShowEditQuizModal] = useState(false)
  const [showTimeDialog, setShowTimeDialog] = useState(false)
  const [editingClassQuiz, setEditingClassQuiz] = useState<ClassQuiz | null>(null)
  const [editStartTime, setEditStartTime] = useState('')
  const [editEndTime, setEditEndTime] = useState('')
  const [updatingClassQuizTime, setUpdatingClassQuizTime] = useState(false)

  // States for delete confirmation
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [quizToDelete, setQuizToDelete] = useState<ClassQuiz | null>(null)
  const [deleting, setDeleting] = useState(false)

  // Fetch available quizzes from teacher
  const fetchAvailableQuizzes = useCallback(async () => {
    setLoadingQuizzes(true)

    try {
      const { data } = await apiClient.get('/api/v1/quizzes')

      setAvailableQuizzes(data?.data || [])
    } catch (error) {
      console.error('Error fetching available quizzes:', error)
    } finally {
      setLoadingQuizzes(false)
    }
  }, [])

  // Fetch class quizzes with pagination
  const fetchClassQuizzes = useCallback(async () => {
    if (!class_id) return

    setLoadingClassQuizzes(true)

    try {
      const queryString = new URLSearchParams()

      queryString.append('page', currentPage.toString())
      queryString.append('limit', itemsPerPage.toString())

      const { data } = await apiClient.get(`/api/v1/class-quizzes/class/${class_id}?${queryString.toString()}`)

      setClassQuizzes(data?.data || [])
      setPaginationData(data?.pagination || null)
    } catch (error) {
      console.error('Error fetching class quizzes:', error)
    } finally {
      setLoadingClassQuizzes(false)
    }
  }, [class_id, currentPage, itemsPerPage])

  // Add quiz to class
  const handleAddQuizToClass = async () => {
    if (!selectedQuiz || !startTime || !endTime) return

    try {
      await apiClient.post('/api/v1/class-quizzes', {
        quiz_id: selectedQuiz.id,
        class_id: class_id,
        start_time: startTime,
        end_time: endTime
      })

      // Refresh class quizzes list
      fetchClassQuizzes()
      refetchClassQuizzes()

      // Reset states and close dialogs
      setSelectedQuiz(null)
      setStartTime('')
      setEndTime('')
      setShowConfirmDialog(false)
      setShowQuizDialog(false)
    } catch (error) {
      console.error('Error adding quiz to class:', error)
    }
  }

  // Handle quiz selection
  const handleQuizSelect = (quiz: Quiz) => {
    setSelectedQuiz(quiz)
    setShowQuizDialog(false)
    setShowConfirmDialog(true)

    // Set default times (current time and 2 hours later)
    const now = new Date()
    const later = new Date(now.getTime() + 2 * 60 * 60 * 1000)

    setStartTime(now.toISOString().slice(0, 16))
    setEndTime(later.toISOString().slice(0, 16))
  }

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleLimitChange = (e: ChangeEvent<HTMLInputElement>) => {
    setItemsPerPage(parseInt(e.target.value))
    setCurrentPage(1)
  }

  // Fetch class quiz details
  const handleViewClassQuiz = async (classQuizId: string, quizId: string) => {
    setLoadingClassQuizDetail(true)
    setSelectedQuizId(quizId)

    try {
      await getClassQuizDetail(classQuizId)

      setShowQuizDetailModal(true)
    } catch (error: any) {
      console.error('Error fetching class quiz details:', error)
      toast.error(error.message || 'Không thể tải chi tiết class quiz', {
        position: 'bottom-right',
        autoClose: 3000
      })
    } finally {
      setLoadingClassQuizDetail(false)
    }
  }

  // Handle edit class quiz - open modal
  const handleEditClassQuiz = (classQuiz: ClassQuiz) => {
    setEditingClassQuiz(classQuiz)
    setEditStartTime(new Date(classQuiz.start_time).toISOString().slice(0, 16))
    setEditEndTime(new Date(classQuiz.end_time).toISOString().slice(0, 16))
    setShowEditQuizModal(true)
    setShowTimeDialog(false)
  }

  const handleCloseEditModal = () => {
    if (updatingClassQuizTime) return
    setShowEditQuizModal(false)
    setShowTimeDialog(false)
    setEditingClassQuiz(null)
    setEditStartTime('')
    setEditEndTime('')
    setUpdatingClassQuizTime(false)
  }

  const handleOpenTimeDialog = () => {
    if (!editingClassQuiz) return
    setShowTimeDialog(true)
  }

  const handleUpdateQuizTime = async () => {
    if (!editingClassQuiz || !editStartTime || !editEndTime) {
      toast.error('Vui lòng nhập đầy đủ thời gian', { position: 'bottom-right' })

      return
    }

    const startDate = new Date(editStartTime)
    const endDate = new Date(editEndTime)

    if (endDate <= startDate) {
      toast.error('Thời gian kết thúc phải sau thời gian bắt đầu', { position: 'bottom-right' })

      return
    }

    setUpdatingClassQuizTime(true)

    try {
      const startTimeISO = startDate.toISOString()
      const endTimeISO = endDate.toISOString()

      await updateClassQuiz(editingClassQuiz.id, {
        start_time: startTimeISO,
        end_time: endTimeISO
      })

      toast.success('Cập nhật thời gian thành công', {
        position: 'bottom-right',
        autoClose: 3000
      })

      setEditingClassQuiz(prev =>
        prev
          ? {
              ...prev,
              start_time: startTimeISO,
              end_time: endTimeISO
            }
          : prev
      )

      fetchClassQuizzes()
      refetchClassQuizzes()
      setShowTimeDialog(false)
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra khi cập nhật thời gian', {
        position: 'bottom-right',
        autoClose: 3000
      })
    } finally {
      setUpdatingClassQuizTime(false)
    }
  }

  // Handle update success callback
  const handleUpdateSuccess = () => {
    fetchClassQuizzes()
    refetchClassQuizzes()
  }

  // Handle delete quiz
  const handleDeleteClick = (classQuiz: ClassQuiz) => {
    setQuizToDelete(classQuiz)
    setShowDeleteDialog(true)
  }

  const handleConfirmDelete = async () => {
    if (!quizToDelete) return

    setDeleting(true)

    try {
      await deleteClassQuiz(quizToDelete.id)
      toast.success('Xóa thành công', {
        position: 'bottom-right',
        autoClose: 3000
      })

      // Refresh class quizzes list
      fetchClassQuizzes()
      refetchClassQuizzes()

      // Close dialog and reset state
      setShowDeleteDialog(false)
      setQuizToDelete(null)
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra khi xóa quiz', {
        position: 'bottom-right',
        autoClose: 3000
      })
    } finally {
      setDeleting(false)
    }
  }

  // Load data on component mount
  useEffect(() => {
    if (class_id) {
      fetchClassQuizzes()
    }
  }, [class_id, fetchClassQuizzes])

  // States for statistics
  const [showStatsDialog, setShowStatsDialog] = useState(false)
  const [statistics, setStatistics] = useState<QuizStatistics | null>(null)
  const [loadingStats, setLoadingStats] = useState(false)

  // Handle view statistics
  const handleViewStats = async (classQuizId: string) => {
    setShowStatsDialog(true)
    setLoadingStats(true)

    try {
      const stats = await getQuizStatistics(classQuizId)

      setStatistics(stats)
    } catch (error) {
      console.error('Error fetching statistics:', error)

      toast.error('Không thể tải thống kê', { position: 'bottom-right' })
    } finally {
      setLoadingStats(false)
    }
  }

  const TABLE_HEAD = [
    { name: 'STT', position: 'center', sortable: false },
    { name: 'Hành động', position: 'center', sortable: false },
    { name: 'Tên Quiz', position: 'center', sortable: false },
    { name: 'Thời gian bắt đầu', position: 'center', sortable: false },
    { name: 'Thời gian kết thúc', position: 'center', sortable: false },
    { name: 'Ngày tạo', position: 'center', sortable: false },
    { name: 'Hành động', position: 'center', sortable: false }
  ]

  return (
    <Box className='p-4'>
      <div className='flex justify-between items-center mb-4'>
        <Typography variant='h6'>Bài tập trên lớp</Typography>
        <Button
          variant='contained'
          onClick={() => {
            refetchClassQuizzes()
            fetchAvailableQuizzes()
            setShowQuizDialog(true)
          }}
        >
          Thêm Quiz
        </Button>
      </div>

      {/* Class Quizzes Table */}
      <Card>
        <PageLoading show={loadingClassQuizzes} />

        <div className='overflow-x-auto w-full'>
          <table className='w-full min-w-max table-auto text-left text-sm border-spacing-0'>
            <thead>
              <tr>
                {TABLE_HEAD.map((head, index) => (
                  <th
                    key={`${index}_${head.name}`}
                    className={clsx('px-3 py-4 uppercase', head.sortable && 'cursor-pointer')}
                  >
                    <div
                      className={`items-center gap-1 text-sm font-medium leading-none text-grey-500 text-${head.position} flex justify-center`}
                    >
                      <span>{head.name}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {classQuizzes && classQuizzes.length > 0 ? (
                classQuizzes.map((classQuiz, index) => {
                  const key = classQuiz.id || `class-quiz-${index}`

                  return (
                    <tr key={key} className='border-t border-grey-200 hover:bg-grey-100'>
                      <td className='px-3 py-4 text-center'>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td className='action px-3 py-3'>
                        <div className='flex items-center justify-center gap-2'>
                          <CustomIconButton
                            size='small'
                            onClick={() => handleViewClassQuiz(classQuiz.id, classQuiz.quiz_id)}
                            disabled={loadingClassQuizDetail}
                          >
                            <Eye size={18} color='#000' />
                          </CustomIconButton>
                          <CustomIconButton size='small' color='primary' onClick={() => handleEditClassQuiz(classQuiz)}>
                            <Edit2 size={18} color='#000' />
                          </CustomIconButton>
                          <CustomIconButton size='small' onClick={() => handleDeleteClick(classQuiz)}>
                            <Trash size={18} color='#ED0909' />
                          </CustomIconButton>
                        </div>
                      </td>
                      <td className='px-3 py-4 text-center'>{classQuiz.quiz?.name || 'N/A'}</td>
                      <td className='px-3 py-4 text-center'>
                        {new Date(classQuiz.start_time).toLocaleString('vi-VN')}
                      </td>
                      <td className='px-3 py-4 text-center'>{new Date(classQuiz.end_time).toLocaleString('vi-VN')}</td>
                      <td className='px-3 py-4 text-center'>
                        {new Date(classQuiz.quiz?.created_at).toLocaleDateString('vi-VN')}
                      </td>
                      <td className='px-3 py-4 text-center'>
                        <div className='flex items-center justify-center gap-2'>
                          <Button
                            size='small'
                            variant='outlined'
                            startIcon={<FileText size={16} />}
                            onClick={() => router.push(`/class/${class_id}/submissions/${classQuiz.id}`)}
                          >
                            Bài nộp
                          </Button>
                          <Button
                            size='small'
                            variant='outlined'
                            color='secondary'
                            startIcon={<BarChart size={16} />}
                            onClick={() => handleViewStats(classQuiz.id)}
                          >
                            Thống kê
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={TABLE_HEAD.length}>
                    <div className='flex h-28 select-none items-center justify-center flex-col gap-2'>
                      <BookOpen size={48} className='text-grey-200' />
                      <span className='text-4.5xl text-grey-100'>Không có bài tập nào</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Always show pagination */}
        <TableRCPaginationCustom
          pagination={{
            page: paginationData?.currentPage || currentPage,
            limit: paginationData?.itemsPerPage || itemsPerPage,
            totalItems: paginationData?.totalItems || 0
          }}
          onChangePage={handlePageChange}
          onLimitChange={handleLimitChange}
          showLimitSelector={true}
        />
      </Card>

      {/* Quiz Selection Dialog */}
      <Dialog open={showQuizDialog} onClose={() => setShowQuizDialog(false)} maxWidth='md' fullWidth>
        <DialogTitle>Chọn Quiz để thêm vào lớp</DialogTitle>
        <DialogContent>
          <PageLoading show={loadingQuizzes} />
          {filteredAvailableQuizzes.length > 0 ? (
            <div className='space-y-2'>
              {filteredAvailableQuizzes.map(quiz => (
                <Card
                  key={quiz.id}
                  className='p-4 cursor-pointer hover:bg-grey-50'
                  onClick={() => handleQuizSelect(quiz)}
                >
                  <Typography variant='h6'>{quiz.name}</Typography>
                  <Typography variant='body2' color='text.secondary'>
                    {quiz.description}
                  </Typography>
                  <Typography variant='caption' color='text.secondary'>
                    Tạo ngày: {new Date(quiz.created_at).toLocaleDateString('vi-VN')}
                  </Typography>
                </Card>
              ))}
            </div>
          ) : (
            <Typography>
              {availableQuizzes.length === 0 ? 'Chưa có quiz nào được tạo.' : 'Tất cả quiz đã được thêm vào lớp này.'}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowQuizDialog(false)}>Hủy</Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onClose={() => setShowConfirmDialog(false)} maxWidth='sm' fullWidth>
        <DialogTitle>Xác nhận thêm Quiz</DialogTitle>
        <DialogContent>
          {selectedQuiz && (
            <div className='space-y-4'>
              <Typography>
                <strong>Quiz:</strong> {selectedQuiz.name}
              </Typography>
              <Typography>
                <strong>Mô tả:</strong> {selectedQuiz.description}
              </Typography>

              <TextField
                fullWidth
                label='Thời gian bắt đầu'
                type='datetime-local'
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                fullWidth
                label='Thời gian kết thúc'
                type='datetime-local'
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirmDialog(false)}>Hủy</Button>
          <Button variant='contained' onClick={handleAddQuizToClass} disabled={!startTime || !endTime}>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      {/* Quiz Detail Modal */}
      <QuizDetailModal
        open={showQuizDetailModal}
        onClose={() => {
          setShowQuizDetailModal(false)
          setSelectedQuizId(null)
        }}
        quizId={selectedQuizId}
      />

      {/* Edit Quiz Modal */}
      <EditQuizModal
        open={showEditQuizModal}
        onClose={handleCloseEditModal}
        quizId={editingClassQuiz?.quiz_id ?? null}
        onUpdateSuccess={handleUpdateSuccess}
        additionalQuestionActions={
          editingClassQuiz ? (
            <Button variant='outlined' size='small' onClick={handleOpenTimeDialog} disabled={updatingClassQuizTime}>
              Cập nhật thời gian
            </Button>
          ) : null
        }
      />

      {/* Time Update Dialog */}
      <Dialog
        open={showTimeDialog}
        onClose={() => !updatingClassQuizTime && setShowTimeDialog(false)}
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle>Cập nhật thời gian quiz trong lớp</DialogTitle>
        <DialogContent>
          <Box className='space-y-4 mt-2'>
            <TextField
              fullWidth
              label='Thời gian bắt đầu'
              type='datetime-local'
              value={editStartTime}
              onChange={e => setEditStartTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
              disabled={updatingClassQuizTime}
            />

            <TextField
              fullWidth
              label='Thời gian kết thúc'
              type='datetime-local'
              value={editEndTime}
              onChange={e => setEditEndTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
              disabled={updatingClassQuizTime}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowTimeDialog(false)} disabled={updatingClassQuizTime}>
            Hủy
          </Button>
          <Button
            variant='contained'
            onClick={handleUpdateQuizTime}
            disabled={updatingClassQuizTime || !editStartTime || !editEndTime}
          >
            {updatingClassQuizTime ? 'Đang cập nhật...' : 'Lưu'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onClose={() => !deleting && setShowDeleteDialog(false)} maxWidth='sm' fullWidth>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa quiz <strong>{quizToDelete?.quiz?.name}</strong> khỏi lớp học này không?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)} disabled={deleting}>
            Hủy
          </Button>
          <Button variant='contained' color='error' onClick={handleConfirmDelete} disabled={deleting}>
            {deleting ? 'Đang xóa...' : 'Xóa'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Statistics Dialog */}
      <Dialog open={showStatsDialog} onClose={() => setShowStatsDialog(false)} maxWidth='md' fullWidth>
        <DialogTitle>Thống kê Quiz</DialogTitle>
        <DialogContent>
          <PageLoading show={loadingStats} />
          {statistics && (
            <Box className='space-y-4'>
              {/* General Statistics */}
              <Card variant='outlined'>
                <CardContent>
                  <Typography variant='h6' className='mb-3'>
                    Thống kê chung
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 6, md: 3 }}>
                      <Typography variant='body2' color='text.secondary'>
                        Tổng bài nộp
                      </Typography>
                      <Typography variant='h6'>{statistics.general_statistics.total_submissions}</Typography>
                    </Grid>
                    <Grid size={{ xs: 6, md: 3 }}>
                      <Typography variant='body2' color='text.secondary'>
                        Điểm TB
                      </Typography>
                      <Typography variant='h6'>{statistics.general_statistics.average_score.toFixed(2)}</Typography>
                    </Grid>
                    <Grid size={{ xs: 6, md: 3 }}>
                      <Typography variant='body2' color='text.secondary'>
                        Điểm cao nhất
                      </Typography>
                      <Typography variant='h6'>{statistics.general_statistics.max_score}</Typography>
                    </Grid>
                    <Grid size={{ xs: 6, md: 3 }}>
                      <Typography variant='body2' color='text.secondary'>
                        Điểm thấp nhất
                      </Typography>
                      <Typography variant='h6'>{statistics.general_statistics.min_score}</Typography>
                    </Grid>
                  </Grid>

                  <Divider className='my-3' />

                  <Typography variant='subtitle2' className='mb-2'>
                    Phân bố điểm
                  </Typography>
                  <Box className='space-y-2'>
                    {statistics.general_statistics.score_distribution.map(dist => (
                      <Box key={dist.range} className='flex items-center justify-between'>
                        <Typography variant='body2'>{dist.range} điểm</Typography>
                        <Chip label={`${dist.count} học sinh`} size='small' />
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>

              {/* Question Statistics */}
              <Typography variant='h6' className='mt-4'>
                Thống kê từng câu hỏi
              </Typography>
              {statistics.question_statistics.map((question, index) => (
                <Card key={question.question_id} variant='outlined'>
                  <CardContent>
                    <Typography variant='subtitle1' className='mb-2'>
                      Câu {index + 1}: {question.content}
                    </Typography>
                    <Typography variant='body2' color='text.secondary' className='mb-2'>
                      Tỷ lệ trả lời đúng: {question.percent_correct.toFixed(1)}%
                    </Typography>
                    <Box className='space-y-1'>
                      {question.answer_distribution.map(answer => (
                        <Box
                          key={answer.answer_id}
                          className='flex items-center justify-between p-2 rounded'
                          sx={{
                            bgcolor: answer.is_correct ? 'success.light' : 'action.hover',
                            border: 1,
                            borderColor: answer.is_correct ? 'success.main' : 'divider'
                          }}
                        >
                          <Typography variant='body2'>
                            {answer.content} {answer.is_correct && '✓'}
                          </Typography>
                          <Chip label={`${answer.selected_count} lượt chọn`} size='small' />
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowStatsDialog(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
