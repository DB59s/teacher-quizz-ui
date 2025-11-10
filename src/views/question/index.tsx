'use client'

import type { ChangeEvent } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { useSearchParams } from 'next/navigation'

import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import MenuItem from '@mui/material/MenuItem'

import clsx from 'clsx'

import { Edit2, Eye, Trash } from 'iconsax-react'

import { Button } from '@mui/material'

import { useQueryParams } from '@/hooks/useQueryParams'

import useTableHead from '@/hooks/useTableHead'

import CustomIconButton from '@/@core/components/mui/IconButton'
import { fetchApi } from '@/libs/fetchApi'
import PageLoading from '@/theme/PageLoading'
import CustomTextField from '@/@core/components/mui/TextField'
import TableRCPaginationCustom from '@/components/table/TableRCPaginationCustom'
import ModalConfirmDeleteQuestion from '@/components/modal/ModalConfirmDeleteQuestion'
import ModalCreateQuestion from '@/components/modal/ModalCreateQuestion'
import QuestionDetailModal from '@/components/dialogs/QuestionDetailModal'

type PaginationData = {
  page: number
  limit: number
  totalItems: number
} | null

export default function QuestionView() {
  const TABLE_HEAD = useTableHead()
  const [loading, setLoading] = useState(false)
  const [questionData, setQuestionData] = useState<any[]>([])
  const { updateQueryParams } = useQueryParams()
  const [paginationData, setPaginationData] = useState<PaginationData>(null)
  const searchParams = useSearchParams()

  const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([])
  const [loadingSubjects, setLoadingSubjects] = useState(false)

  // States for delete confirmation modal
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [questionToDelete, setQuestionToDelete] = useState<{ id: string; content: string } | null>(null)
  const [isModalCreateQuestionOpen, setIsModalCreateQuestionOpen] = useState(false)

  // States for question detail modal
  const [showQuestionDetailModal, setShowQuestionDetailModal] = useState(false)
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null)

  // States for edit question modal
  const [isModalEditQuestionOpen, setIsModalEditQuestionOpen] = useState(false)
  const [selectedEditQuestionId, setSelectedEditQuestionId] = useState<string | null>(null)

  // Lấy search params từ URL thực tế
  const currentSearchParams = useMemo(
    () => ({
      status: searchParams.get('status') || '',
      search: searchParams.get('search') || '',
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '10',
      inStock: searchParams.get('inStock') || '',
      subject_id: searchParams.get('subject_id') || '',
      level: searchParams.get('level') || ''
    }),
    [searchParams]
  )

  const [searchTerm, setSearchTerm] = useState<string>(currentSearchParams.search || '')

  const fetchQuestions = useCallback(async () => {
    try {
      setLoading(true)

      const queryString = new URLSearchParams()

      if (currentSearchParams.search) queryString.append('search', currentSearchParams.search)
      if (currentSearchParams.status) queryString.append('status', currentSearchParams.status)
      if (currentSearchParams.page) queryString.append('page', currentSearchParams.page)
      if (currentSearchParams.limit) queryString.append('limit', currentSearchParams.limit)
      if (currentSearchParams.inStock) queryString.append('inStock', currentSearchParams.inStock)
      if (currentSearchParams.subject_id) queryString.append('subject_id', currentSearchParams.subject_id)
      if (currentSearchParams.level) queryString.append('level', currentSearchParams.level)

      // Tạo URL với query parameters
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/questions${queryString.toString() ? `?${queryString.toString()}` : ''}`

      const questionsRes = await fetchApi(apiUrl, { method: 'GET' })

      if (!questionsRes.ok) {
        setPaginationData(null)
        throw new Error('Không lấy được danh sách câu hỏi')
      }

      const questionsData = await questionsRes.json()

      setQuestionData(questionsData?.data || [])

      // Đảm bảo pagination data có page từ searchParams

      const paginationWithCorrectPage = {
        ...questionsData?.pagination,
        page: parseInt(currentSearchParams.page || '1'),
        limit: parseInt(currentSearchParams.limit || '10')
      }

      setPaginationData(paginationWithCorrectPage || null)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [
    currentSearchParams.search,
    currentSearchParams.status,
    currentSearchParams.page,
    currentSearchParams.limit,
    currentSearchParams.inStock,
    currentSearchParams.subject_id,
    currentSearchParams.level
  ])

  useEffect(() => {
    fetchQuestions()
  }, [fetchQuestions])

  // Lắng nghe custom event để refresh khi tạo câu hỏi thành công
  useEffect(() => {
    const handleRefreshQuestions = () => {
      fetchQuestions()
    }

    window.addEventListener('refreshQuestions', handleRefreshQuestions)

    return () => {
      window.removeEventListener('refreshQuestions', handleRefreshQuestions)
    }
  }, [fetchQuestions])

  const handleDeleteQuestion = (id: string, content: string) => () => {
    setQuestionToDelete({ id, content })
    setShowDeleteDialog(true)
  }

  const handleDeleteSuccess = () => {
    // Reset states
    setQuestionToDelete(null)
    setShowDeleteDialog(false)

    // Refresh questions list
    fetchQuestions()
  }

  const handleLimitChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newLimit = e.target.value
    const newParams = { ...currentSearchParams, limit: newLimit, page: '1' }

    updateQueryParams(newParams)
  }

  const handleSubjectChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newSubjectId = e.target.value
    const newParams = { ...currentSearchParams, subject_id: newSubjectId || undefined, page: '1' }

    updateQueryParams(newParams)
  }

  const handleLevelChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newLevel = e.target.value
    const newParams = { ...currentSearchParams, level: newLevel || undefined, page: '1' }

    updateQueryParams(newParams)
  }

  const handleChangeSearch = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      const newParams = {
        ...currentSearchParams,
        search: searchTerm || undefined,
        page: undefined
      }

      updateQueryParams(newParams)
    }
  }

  useEffect(() => {
    setLoadingSubjects(true)
    fetchApi(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/subjects?page=1&limit=100`, { method: 'GET' })
      .then(res => {
        if (!res.ok) throw new Error('Không lấy được danh sách môn học')

        return res.json()
      })
      .then(json => {
        setSubjects(json?.data || [])
      })
      .catch(err => {
        console.error(err)
      })
      .finally(() => {
        setLoadingSubjects(false)
      })
  }, [])

  const handlePageChange = (page: number) => {
    const newParams = { ...currentSearchParams, page: page.toString() }

    updateQueryParams(newParams)
  }

  return (
    <Grid container spacing={6}>
      <PageLoading show={loading} />
      <Grid size={{ xs: 12 }}>
        <div className='flex justify-between'>
          <Typography variant='h4' className='font-semibold'>
            Danh sách câu hỏi
          </Typography>
          <Button variant='contained' color='primary' onClick={() => setIsModalCreateQuestionOpen(true)}>
            Thêm câu hỏi
          </Button>
        </div>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Card>
          <div className='flex flex-col lg:flex-row flex-wrap justify-between gap-3 p-6'>
            <div className='flex flex-wrap items-center max-sm:flex-col gap-3 max-sm:is-full is-auto'>
              <CustomTextField
                value={searchTerm || ''}
                type='search'
                onChange={e => setSearchTerm(e.target.value)}
                onKeyUp={e => handleChangeSearch(e)}
                placeholder='Tìm kiếm'
                className='max-sm:is-full is-[260px] !bg-white'
              />
              <CustomTextField
                select
                value={currentSearchParams?.subject_id || ''}
                onChange={handleSubjectChange}
                className='max-sm:is-full is-[200px] !bg-white'
                disabled={loadingSubjects}
                SelectProps={{
                  displayEmpty: true,
                  renderValue: (selected: unknown) => {
                    if (!selected || selected === '') {
                      return 'Tất cả môn học'
                    }

                    const selectedSubject = subjects.find(subject => subject.id === String(selected))

                    return selectedSubject?.name || 'Tất cả môn học'
                  }
                }}
              >
                <MenuItem value=''>Tất cả môn học</MenuItem>
                {subjects.map(subject => (
                  <MenuItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </MenuItem>
                ))}
              </CustomTextField>
              <CustomTextField
                select
                value={currentSearchParams?.level || ''}
                onChange={handleLevelChange}
                className='max-sm:is-full is-[150px] !bg-white'
                SelectProps={{
                  displayEmpty: true,
                  renderValue: (selected: unknown) => {
                    if (!selected || selected === '') {
                      return 'Tất cả độ khó'
                    }

                    return `Độ khó ${String(selected)}` || 'Tất cả độ khó'
                  }
                }}
              >
                <MenuItem value=''>Tất cả độ khó</MenuItem>
                <MenuItem value='1'>1</MenuItem>
                <MenuItem value='2'>2</MenuItem>
                <MenuItem value='3'>3</MenuItem>
                <MenuItem value='4'>4</MenuItem>
              </CustomTextField>
            </div>
            <div className='flex flex-wrap items-center max-sm:flex-col gap-3'>
              <CustomTextField
                select
                value={currentSearchParams?.limit || '10'}
                onChange={handleLimitChange}
                className='flex-auto is-[70px] max-sm:is-full'
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
                {questionData && questionData.length > 0 ? (
                  questionData.map((item, index) => (
                    <tr key={item.id} className='even:bg-grey-100/50'>
                      <td className='px-3 py-3 text-center'>{index + 1}</td>
                      <td className='action px-3 py-3'>
                        <div className='flex items-center justify-center gap-2'>
                          <CustomIconButton
                            size='small'
                            onClick={() => {
                              setSelectedQuestionId(item.id)
                              setShowQuestionDetailModal(true)
                            }}
                          >
                            <Eye size={18} color='#000' />
                          </CustomIconButton>

                          <CustomIconButton
                            size='small'
                            onClick={() => {
                              setSelectedEditQuestionId(item.id)
                              setIsModalEditQuestionOpen(true)
                            }}
                            color='primary'
                          >
                            <Edit2 size={18} color='#000' />
                          </CustomIconButton>

                          <CustomIconButton size='small' onClick={handleDeleteQuestion(item.id, item.content)}>
                            <Trash size={18} color='#ED0909' />
                          </CustomIconButton>
                        </div>
                      </td>
                      <td className='px-3 py-3 max-w-[400px] truncate' title={item.content}>
                        {item.content}
                      </td>
                      <td className='px-3 py-3 text-center'>{item.level}</td>
                      <td className='px-3 py-3 text-center'>{new Date(item.created_at).toLocaleDateString('vi-VN')}</td>
                      <td className='px-3 py-3 text-center'>{new Date(item.updated_at).toLocaleDateString('vi-VN')}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={100}>
                      <div className='flex h-28 select-none items-center justify-center text-4.5xl font-semibold text-grey-100'>
                        Không có câu hỏi nào
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {paginationData && (
            <TableRCPaginationCustom pagination={paginationData} onChangePage={page => handlePageChange(page)} />
          )}
        </Card>
      </Grid>

      <ModalConfirmDeleteQuestion
        open={showDeleteDialog}
        setOpen={setShowDeleteDialog}
        question={questionToDelete}
        onDeleteSuccess={handleDeleteSuccess}
      />
      <ModalCreateQuestion type='create' open={isModalCreateQuestionOpen} setOpen={setIsModalCreateQuestionOpen} />
      <ModalCreateQuestion
        type='edit'
        open={isModalEditQuestionOpen}
        setOpen={open => {
          setIsModalEditQuestionOpen(open)
          if (!open) {
            setSelectedEditQuestionId(null)
          }
        }}
        questionId={selectedEditQuestionId}
      />
      <QuestionDetailModal
        open={showQuestionDetailModal}
        onClose={() => {
          setShowQuestionDetailModal(false)
          setSelectedQuestionId(null)
        }}
        questionId={selectedQuestionId}
      />
    </Grid>
  )
}
