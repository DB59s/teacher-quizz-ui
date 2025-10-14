'use client'

import type { ChangeEvent } from 'react'
import { useCallback, useEffect, useState } from 'react'

import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import MenuItem from '@mui/material/MenuItem'

import clsx from 'clsx'

import { Edit2, Eye, Trash } from 'iconsax-react'

import { useQueryParams } from '@/hooks/useQueryParams'

import useTableHead from '@/hooks/useTableHead'

import CustomIconButton from '@/@core/components/mui/IconButton'
import { fetchApi } from '@/libs/fetchApi'
import PageLoading from '@/theme/PageLoading'
import CustomTextField from '@/@core/components/mui/TextField'
import TableRCPaginationCustom from '@/components/table/TableRCPaginationCustom'

type Props = {
  searchParams: {
    status?: string
    search?: string
    page?: string
    limit?: string
    inStock?: string
  }
}

type PaginationData = {
  page: number
  limit: number
  totalItems: number
} | null

export default function QuestionView({ searchParams }: Props) {
  const TABLE_HEAD = useTableHead()
  const [loading, setLoading] = useState(false)
  const [questionData, setQuestionData] = useState<any[]>([])
  const { queryParams, updateQueryParams } = useQueryParams()
  const [paginationData, setPaginationData] = useState<PaginationData>(null)

  // Sử dụng queryParams từ hook để có real-time data
  const currentSearchParams = {
    status: (queryParams.status as string) || searchParams?.status || '',
    search: (queryParams.search as string) || searchParams?.search || '',
    page: (queryParams.page as string) || searchParams?.page || '1',
    limit: (queryParams.limit as string) || searchParams?.limit || '10',
    inStock: (queryParams.inStock as string) || searchParams?.inStock || ''
  }

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

      // Tạo URL với query parameters
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/questions${queryString.toString() ? `?${queryString.toString()}` : ''}`

      console.log('API URL với query params:', apiUrl) // Debug log

      const questionsRes = await fetchApi(apiUrl, { method: 'GET' })

      if (!questionsRes.ok) {
        setPaginationData(null)
        throw new Error('Không lấy được danh sách câu hỏi')
      }

      const questionsData = await questionsRes.json()

      setQuestionData(questionsData?.data || [])

      // Đảm bảo pagination data có page từ currentSearchParams
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
  }, [currentSearchParams.search, currentSearchParams.status, currentSearchParams.page, currentSearchParams.limit, currentSearchParams.inStock])

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

  // Debug effect để kiểm tra queryParams
  useEffect(() => {
    console.log('QueryParams changed:', queryParams)
    console.log('Current SearchParams:', currentSearchParams)
  }, [queryParams, currentSearchParams])

  const handleDeleteQuestion = (id: string) => async () => {
    if (!id) return

    try {
      const res = await fetchApi(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/questions/${id}`, { method: 'DELETE' })

      if (!res.ok) throw new Error('Xoá câu hỏi thất bại')
      await fetchQuestions()
    } catch (error) {
      console.error(error)
    }
  }

  const handleLimitChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newLimit = e.target.value
    const newParams = { ...currentSearchParams, limit: newLimit, page: '1' }

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

  const handlePageChange = (page: number) => {
    console.log('Page change to:', page) // Debug log

    const newParams = { ...currentSearchParams, page: page.toString() }

    updateQueryParams(newParams)
  }

  return (
    <Grid container spacing={6}>
      <PageLoading show={loading} />
      <Grid size={{ xs: 12 }}>
        <Typography variant='h4' className='font-semibold'>
          Danh sách câu hỏi
        </Typography>
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
                          <CustomIconButton size='small' onClick={() => {}}>
                            <Eye size={18} color='#000' />
                          </CustomIconButton>

                          <CustomIconButton
                            size='small'
                            href={item?.id ? `/question/${item?.id}/edit` : ''}
                            color='primary'
                          >
                            <Edit2 size={18} color='#000' />
                          </CustomIconButton>

                          <CustomIconButton size='small' onClick={handleDeleteQuestion(item.id)}>
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
            <TableRCPaginationCustom 
              pagination={paginationData} 
              onChangePage={page => handlePageChange(page)} 
            />
          )}
        </Card>
      </Grid>
    </Grid>
  )
}