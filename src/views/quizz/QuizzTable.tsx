'use client'

import type { ChangeEvent } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { useSearchParams } from 'next/navigation'

import Card from '@mui/material/Card'

// import MenuItem from '@mui/material/MenuItem'

import clsx from 'clsx'

import { Edit2, Eye, Trash } from 'iconsax-react'
import { Inbox } from 'lucide-react'
import { toast } from 'react-toastify'

import { useQueryParams } from '@/hooks/useQueryParams'
import useTableHead from '@/hooks/useTableHead'
import { fetchApi } from '@/libs/fetchApi'
import PageLoading from '@/theme/PageLoading'
import CustomIconButton from '@/@core/components/mui/IconButton'
import TableRCPaginationCustom from '@/components/table/TableRCPaginationCustom'
import ModalConfirmDeleteQuizz from '@/components/modal/ModalConfirmDeleteQuizz'
import QuizDetailModal from '@/components/dialogs/QuizDetailModal'
import EditQuizModal from '@/components/dialogs/EditQuizModal'
import { formatDateVN } from '@/utils/dateFormat'

type PaginationData = {
  page: number
  limit: number
  totalItems: number
} | null

export default function QuizzTable() {
  const TABLE_HEAD = useTableHead()
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(false)
  const { updateQueryParams } = useQueryParams()
  const [paginationData, setPaginationData] = useState<PaginationData>(null)
  const searchParams = useSearchParams()

  // States for delete confirmation modal
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [quizToDelete, setQuizToDelete] = useState<{ id: string; name: string; description?: string } | null>(null)

  // States for quiz detail modal
  const [showQuizDetailModal, setShowQuizDetailModal] = useState(false)
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null)

  // States for edit quiz modal
  const [showEditQuizModal, setShowEditQuizModal] = useState(false)
  const [selectedEditQuizId, setSelectedEditQuizId] = useState<string | null>(null)

  // Lấy search params từ URL
  const currentSearchParams = useMemo(
    () => ({
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '10'
    }),
    [searchParams]
  )

  const fetchQuizzes = useCallback(async () => {
    setLoading(true)

    try {
      const queryString = new URLSearchParams()

      if (currentSearchParams.page) queryString.append('page', currentSearchParams.page)
      if (currentSearchParams.limit) queryString.append('limit', currentSearchParams.limit)

      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/quizzes${queryString.toString() ? `?${queryString.toString()}` : ''}`

      const response = await fetchApi(apiUrl, {
        method: 'GET'
      })

      if (!response.ok) throw new Error('Failed to fetch quizzes')
      const json = await response.json()

      setQuizzes(json?.data || [])

      // Set pagination data
      const paginationWithCorrectPage = {
        ...json?.pagination,
        page: parseInt(currentSearchParams.page || '1'),
        limit: parseInt(currentSearchParams.limit || '10')
      }

      setPaginationData(paginationWithCorrectPage || null)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [currentSearchParams.page, currentSearchParams.limit])

  useEffect(() => {
    fetchQuizzes()
  }, [fetchQuizzes])

  const handleLimitChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newLimit = e.target.value
    const newParams = { ...currentSearchParams, limit: newLimit, page: '1' }

    updateQueryParams(newParams)
  }

  const handlePageChange = (page: number) => {
    const newParams = { ...currentSearchParams, page: page.toString() }

    updateQueryParams(newParams)
  }

  const handleDeleteQuiz = (quiz: any) => () => {
    setQuizToDelete({
      id: quiz.id || quiz._id,
      name: quiz.name,
      description: quiz.description
    })
    setShowDeleteDialog(true)
  }

  const handleDeleteSuccess = () => {
    toast.success('Xóa quiz thành công!', {
      position: 'bottom-right',
      autoClose: 3000
    })

    // Reset states
    setQuizToDelete(null)
    setShowDeleteDialog(false)

    // Refresh quizzes list
    fetchQuizzes()
  }

  return (
    <Card>
      <PageLoading show={loading} />
      <div className='overflow-x-auto w-full'>
        <table className='w-full min-w-max table-auto text-left text-sm border-spacing-0'>
          <thead>
            <tr>
              {TABLE_HEAD()?.map((head: any, index: number) => (
                <th
                  key={`${index}_${head.name}`}
                  style={{ width: head?.maxWidth }}
                  className={clsx('px-3 py-4 uppercase', head?.sortable && 'cursor-pointer')}
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
            {quizzes && quizzes.length > 0 ? (
              quizzes.map((quiz: any, index: number) => {
                const key = quiz.id || quiz._id || `quiz-${index}`
                const currentPage = parseInt(currentSearchParams.page || '1')
                const limit = parseInt(currentSearchParams.limit || '10')
                const stt = (currentPage - 1) * limit + index + 1

                return (
                  <tr key={key} className='border-t border-grey-200 hover:bg-grey-100'>
                    <td className='px-3 py-4 text-center'>{stt}</td>
                    <td className='action px-3 py-3'>
                      <div className='flex items-center justify-center gap-2'>
                        <CustomIconButton
                          size='small'
                          onClick={() => {
                            setSelectedQuizId(quiz.id || quiz._id)
                            setShowQuizDetailModal(true)
                          }}
                        >
                          <Eye size={18} color='#000' />
                        </CustomIconButton>

                        <CustomIconButton
                          size='small'
                          color='primary'
                          onClick={() => {
                            setSelectedEditQuizId(quiz.id || quiz._id)
                            setShowEditQuizModal(true)
                          }}
                        >
                          <Edit2 size={18} color='#000' />
                        </CustomIconButton>

                        <CustomIconButton size='small' onClick={handleDeleteQuiz(quiz)}>
                          <Trash size={18} color='#ED0909' />
                        </CustomIconButton>
                      </div>
                    </td>
                    <td className='px-3 py-4 text-center'>{quiz.name}</td>
                    <td className='px-3 py-4 text-center'>{quiz.total_question || 0}</td>
                    <td className='px-3 py-4 text-center'>
                      {quiz.total_time ? Math.round(quiz.total_time / 60) : 0} phút
                    </td>
                    <td className='px-3 py-4 text-center'>{formatDateVN(quiz.created_at)}</td>
                    <td className='px-3 py-4 text-center'>{formatDateVN(quiz.updated_at)}</td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={100}>
                  <div className='flex h-28 select-none items-center justify-center flex-col gap-2'>
                    <Inbox size={48} className='text-grey-200' />
                    <span className='text-4.5xl text-grey-100'>Không có dữ liệu</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {paginationData && (
        <TableRCPaginationCustom
          pagination={paginationData}
          onChangePage={page => handlePageChange(page)}
          onLimitChange={handleLimitChange}
          showLimitSelector={true}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ModalConfirmDeleteQuizz
        open={showDeleteDialog}
        setOpen={setShowDeleteDialog}
        quiz={quizToDelete}
        onDeleteSuccess={handleDeleteSuccess}
      />

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
          fetchQuizzes()
        }}
      />
    </Card>
  )
}
