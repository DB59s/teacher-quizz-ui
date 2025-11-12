'use client'

import type { ChangeEvent } from 'react'
import { useCallback, useEffect, useState } from 'react'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import MenuItem from '@mui/material/MenuItem'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

import clsx from 'clsx'
import { Edit2, Eye, Trash } from 'iconsax-react'
import { toast } from 'react-toastify'

import { fetchApi } from '@/libs/fetchApi'
import PageLoading from '@/theme/PageLoading'
import CustomIconButton from '@/@core/components/mui/IconButton'
import CustomTextField from '@/@core/components/mui/TextField'
import TableRCPaginationCustom from '@/components/table/TableRCPaginationCustom'
import QuizDetailModal from '@/components/dialogs/QuizDetailModal'
import EditQuizModal from '@/components/dialogs/EditQuizModal'
// import { deleteQuiz } from '@/services/quiz.service'
import { deleteClassQuiz } from '@/services/classQuizzes.service'
import useClassQuizzes from '@/hooks/useClassQuizzes'

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

  // States for edit quiz modal
  const [showEditQuizModal, setShowEditQuizModal] = useState(false)
  const [selectedEditQuizId, setSelectedEditQuizId] = useState<string | null>(null)

  // States for delete confirmation
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [quizToDelete, setQuizToDelete] = useState<ClassQuiz | null>(null)
  const [deleting, setDeleting] = useState(false)

  // Fetch available quizzes from teacher
  const fetchAvailableQuizzes = useCallback(async () => {
    setLoadingQuizzes(true)

    try {
      const response = await fetchApi(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/quizzes`, {
        method: 'GET'
      })

      if (!response.ok) throw new Error('Failed to fetch quizzes')
      const json = await response.json()

      setAvailableQuizzes(json?.data || [])
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

      const response = await fetchApi(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/class-quizzes/class/${class_id}?${queryString.toString()}`,
        {
          method: 'GET'
        }
      )

      if (!response.ok) throw new Error('Failed to fetch class quizzes')
      const json = await response.json()

      setClassQuizzes(json?.data || [])
      setPaginationData(json?.pagination || null)
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
      const response = await fetchApi(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/class-quizzes`, {
        method: 'POST',
        body: JSON.stringify({
          quiz_id: selectedQuiz.id,
          class_id: class_id,
          start_time: startTime,
          end_time: endTime
        })
      })

      if (!response.ok) throw new Error('Failed to add quiz to class')

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

  const TABLE_HEAD = [
    { name: 'STT', position: 'center', sortable: false },
    { name: 'Hành động', position: 'center', sortable: false },
    { name: 'Tên Quiz', position: 'center', sortable: false },
    { name: 'Thời gian bắt đầu', position: 'center', sortable: false },
    { name: 'Thời gian kết thúc', position: 'center', sortable: false },
    { name: 'Ngày tạo', position: 'center', sortable: false }
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

        <div className='flex flex-col lg:flex-row flex-wrap justify-between gap-3 p-6'>
          <div className='flex flex-wrap items-center max-sm:flex-col gap-3 max-sm:is-full is-auto'>
            <CustomTextField
              select
              value={itemsPerPage.toString()}
              onChange={handleLimitChange}
              className='flex-auto is-[70px]'
            >
              <MenuItem value='10'>10</MenuItem>
              <MenuItem value='25'>25</MenuItem>
              <MenuItem value='50'>50</MenuItem>
            </CustomTextField>
          </div>
        </div>

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
              {classQuizzes.map((classQuiz, index) => {
                const key = classQuiz.id || `class-quiz-${index}`

                return (
                  <tr key={key} className='border-t border-grey-200 hover:bg-grey-100'>
                    <td className='px-3 py-4 text-center'>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td className='action px-3 py-3'>
                      <div className='flex items-center justify-center gap-2'>
                        <CustomIconButton
                          size='small'
                          onClick={() => {
                            setSelectedQuizId(classQuiz.quiz_id)
                            setShowQuizDetailModal(true)
                          }}
                        >
                          <Eye size={18} color='#000' />
                        </CustomIconButton>
                        <CustomIconButton
                          size='small'
                          color='primary'
                          onClick={() => {
                            setSelectedEditQuizId(classQuiz.quiz_id)
                            setShowEditQuizModal(true)
                          }}
                        >
                          <Edit2 size={18} color='#000' />
                        </CustomIconButton>
                        <CustomIconButton size='small' onClick={() => handleDeleteClick(classQuiz)}>
                          <Trash size={18} color='#ED0909' />
                        </CustomIconButton>
                      </div>
                    </td>
                    <td className='px-3 py-4 text-center'>{classQuiz.quiz?.name || 'N/A'}</td>
                    <td className='px-3 py-4 text-center'>{new Date(classQuiz.start_time).toLocaleString('vi-VN')}</td>
                    <td className='px-3 py-4 text-center'>{new Date(classQuiz.end_time).toLocaleString('vi-VN')}</td>
                    <td className='px-3 py-4 text-center'>
                      {new Date(classQuiz.quiz?.created_at).toLocaleDateString('vi-VN')}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {paginationData && (
          <TableRCPaginationCustom
            pagination={{
              page: paginationData.currentPage,
              limit: paginationData.itemsPerPage,
              totalItems: paginationData.totalItems
            }}
            onChangePage={handlePageChange}
          />
        )}
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

              <CustomTextField
                fullWidth
                label='Thời gian bắt đầu'
                type='datetime-local'
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />

              <CustomTextField
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
        onClose={() => {
          setShowEditQuizModal(false)
          setSelectedEditQuizId(null)
        }}
        quizId={selectedEditQuizId}
        onUpdateSuccess={() => {
          fetchClassQuizzes()
        }}
      />

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
    </Box>
  )
}
