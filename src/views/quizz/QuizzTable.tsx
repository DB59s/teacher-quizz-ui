'use client'

import type { ChangeEvent } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { useSearchParams } from 'next/navigation'

import Card from '@mui/material/Card'
import MenuItem from '@mui/material/MenuItem'
import clsx from 'clsx'

import { Edit2, Eye, Trash } from 'iconsax-react'

import { useQueryParams } from '@/hooks/useQueryParams'
import useTableHead from '@/hooks/useTableHead'
import { fetchApi } from '@/libs/fetchApi'
import PageLoading from '@/theme/PageLoading'
import CustomIconButton from '@/@core/components/mui/IconButton'
import CustomTextField from '@/@core/components/mui/TextField'
import TableRCPaginationCustom from '@/components/table/TableRCPaginationCustom'
import ModalConfirmDeleteQuizz from '@/components/modal/ModalConfirmDeleteQuizz'

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
    // Reset states
    setQuizToDelete(null)
    setShowDeleteDialog(false)

    // Refresh quizzes list
    fetchQuizzes()
  }

  console.log('Quizzes:', quizzes)

  return (
    <Card>
      <PageLoading show={loading} />
      <div className='flex flex-col lg:flex-row flex-wrap justify-between gap-3 p-6'>
        <div className='flex flex-wrap items-center max-sm:flex-col gap-3 max-sm:is-full is-auto'>
          <CustomTextField
            select
            value={currentSearchParams?.limit || '10'}
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
            {quizzes.map((quiz: any, index: number) => {
              const key = quiz.id || quiz._id || `quiz-${index}`

              return (
                <tr key={key} className='border-t border-grey-200 hover:bg-grey-100'>
                  <td className='px-3 py-4 text-center'>{index + 1}</td>
                  <td className='action px-3 py-3'>
                    <div className='flex items-center justify-center gap-2'>
                      <CustomIconButton size='small' onClick={() => {}}>
                        <Eye size={18} color='#000' />
                      </CustomIconButton>

                      <CustomIconButton size='small' color='primary'>
                        <Edit2 size={18} color='#000' />
                      </CustomIconButton>

                      <CustomIconButton size='small' onClick={handleDeleteQuiz(quiz)}>
                        <Trash size={18} color='#ED0909' />
                      </CustomIconButton>
                    </div>
                  </td>
                  <td className='px-3 py-4 text-center'>{quiz.name}</td>
                  <td className='px-3 py-4 text-center'>10</td>
                  <td className='px-3 py-4 text-center'>30 phút</td>
                  <td className='px-3 py-4 text-center'>{new Date(quiz.created_at).toLocaleDateString('vi-VN')}</td>
                  <td className='px-3 py-4 text-center'>{new Date(quiz.updated_at).toLocaleDateString('vi-VN')}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {paginationData && (
        <TableRCPaginationCustom pagination={paginationData} onChangePage={page => handlePageChange(page)} />
      )}

      {/* Delete Confirmation Modal */}
      <ModalConfirmDeleteQuizz
        open={showDeleteDialog}
        setOpen={setShowDeleteDialog}
        quiz={quizToDelete}
        onDeleteSuccess={handleDeleteSuccess}
      />
    </Card>
  )
}
