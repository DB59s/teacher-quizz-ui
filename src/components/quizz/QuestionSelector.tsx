'use client'

import type { ChangeEvent } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'

import Card from '@mui/material/Card'
import MenuItem from '@mui/material/MenuItem'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Autocomplete from '@mui/material/Autocomplete'
import Chip from '@mui/material/Chip'
import ListItemText from '@mui/material/ListItemText'
import Button from '@mui/material/Button'

import { apiClient } from '@/libs/axios-client'
import CustomTextField from '@/@core/components/mui/TextField'
import TableRCPaginationCustom from '@/components/table/TableRCPaginationCustom'
import PageLoading from '@/theme/PageLoading'

type PaginationData = {
  page: number
  limit: number
  totalItems: number
} | null

type Question = {
  id: string
  content: string
  level: number
  created_at: string
  updated_at: string
  subject_id?: string
  subject_ids?: string[]
}

interface QuestionSelectorProps {
  selectedQuestions: string[]
  onSelectionChange: (selectedIds: string[]) => void
}

export default function QuestionSelector({ selectedQuestions, onSelectionChange }: QuestionSelectorProps) {
  const [loading, setLoading] = useState(false)
  const [questionData, setQuestionData] = useState<Question[]>([])
  const [paginationData, setPaginationData] = useState<PaginationData>(null)
  const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([])
  const [loadingSubjects, setLoadingSubjects] = useState(false)

  // Filter states - actual values used for API calls
  const [appliedSearchTerm, setAppliedSearchTerm] = useState<string>('')
  const [appliedLevel, setAppliedLevel] = useState<string>('')
  const [appliedSubjectIds, setAppliedSubjectIds] = useState<string[]>([])
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)

  // Local states for input fields (not applied until search button is clicked)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [level, setLevel] = useState<string>('')
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>([])

  const fetchQuestions = useCallback(async () => {
    try {
      setLoading(true)

      const queryString = new URLSearchParams()

      if (appliedSearchTerm) queryString.append('search', appliedSearchTerm)
      if (appliedLevel) queryString.append('level', appliedLevel)
      if (appliedSubjectIds.length > 0) queryString.append('subject_id', appliedSubjectIds.join(','))
      queryString.append('page', page.toString())
      queryString.append('limit', limit.toString())

      const apiUrl = `/api/v1/questions${queryString.toString() ? `?${queryString.toString()}` : ''}`

      const questionsRes = await apiClient.get(apiUrl)

      const questionsData = questionsRes.data
      const rawQuestions: Question[] = questionsData?.data || []

      setQuestionData(rawQuestions)
      setPaginationData(
        questionsData?.pagination || {
          page,
          limit,
          totalItems: rawQuestions.length
        }
      )
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [limit, appliedLevel, page, appliedSearchTerm, appliedSubjectIds])

  useEffect(() => {
    fetchQuestions()
  }, [fetchQuestions])

  // Fetch subjects
  useEffect(() => {
    setLoadingSubjects(true)
    apiClient
      .get('/api/v1/subjects?page=1&limit=100')
      .then(res => {
        setSubjects(res.data?.data || [])
      })
      .catch(err => {
        console.error(err)
      })
      .finally(() => {
        setLoadingSubjects(false)
      })
  }, [])

  const handleLimitChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLimit(parseInt(e.target.value))
    setPage(1)
  }

  const handleLevelChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLevel(e.target.value)
  }

  const handleApplySearch = () => {
    setAppliedSearchTerm(searchTerm)
    setAppliedLevel(level)
    setAppliedSubjectIds(selectedSubjectIds)
    setPage(1)
  }

  const handleChangeSearch = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      handleApplySearch()
    }
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handleQuestionToggle = (questionId: string) => {
    const currentIndex = selectedQuestions.indexOf(questionId)
    const newSelected = [...selectedQuestions]

    if (currentIndex === -1) {
      newSelected.push(questionId)
    } else {
      newSelected.splice(currentIndex, 1)
    }

    onSelectionChange(newSelected)
  }

  const handleSelectAll = () => {
    if (selectedQuestions.length === questionData.length) {
      onSelectionChange([])
    } else {
      onSelectionChange(questionData.map(q => q.id))
    }
  }

  const isAllSelected = questionData.length > 0 && selectedQuestions.length === questionData.length

  return (
    <Card>
      <PageLoading show={loading} />

      {/* Filters */}
      <div className='flex flex-col lg:flex-row flex-wrap justify-between gap-3 p-6'>
        <div className='flex flex-wrap items-center max-sm:flex-col gap-3 max-sm:is-full is-auto'>
          <CustomTextField
            value={searchTerm || ''}
            type='search'
            onChange={e => setSearchTerm(e.target.value)}
            onKeyUp={handleChangeSearch}
            placeholder='Tìm kiếm câu hỏi'
            className='max-sm:is-full is-[260px] !bg-white'
          />
          <Autocomplete
            multiple
            disableCloseOnSelect
            options={subjects}
            loading={loadingSubjects}
            getOptionLabel={option => option.name}
            value={subjects.filter(subject => selectedSubjectIds.includes(subject.id))}
            onChange={(_, newValue) => {
              const newIds = newValue.map(subject => subject.id)

              setSelectedSubjectIds(newIds)
            }}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => {
                const { key, ...tagProps } = getTagProps({ index })

                return <Chip key={key ?? option.id} label={option.name} {...tagProps} size='small' />
              })
            }
            renderOption={(props, option, { selected }) => {
              const { key, ...optionProps } = props

              return (
                <li key={key} {...optionProps}>
                  <Checkbox checked={selected} />
                  <ListItemText primary={option.name} />
                </li>
              )
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={params => (
              <CustomTextField
                {...params}
                placeholder='Môn học liên quan'
                className='max-sm:is-full is-[260px] !bg-white'
              />
            )}
            noOptionsText='Không tìm thấy môn học phù hợp'
            loadingText='Đang tải danh sách môn học...'
          />
          <CustomTextField
            select
            value={level}
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
          <Button variant='contained' color='primary' onClick={handleApplySearch} className='!max-sm:is-full'>
            Tìm kiếm
          </Button>
        </div>
        <div className='flex flex-wrap items-center max-sm:flex-col gap-3'>
          <CustomTextField
            select
            value={limit.toString()}
            onChange={handleLimitChange}
            className='flex-auto is-[70px] max-sm:is-full'
          >
            <MenuItem value='10'>10</MenuItem>
            <MenuItem value='25'>25</MenuItem>
            <MenuItem value='50'>50</MenuItem>
          </CustomTextField>
        </div>
      </div>

      {/* Table */}
      <div className='overflow-x-auto w-full'>
        <table className='w-full min-w-max table-auto text-left text-sm border-spacing-0'>
          <thead>
            <tr>
              <th className='px-3 py-4 uppercase'>
                <div className='items-center gap-1 text-sm font-medium leading-none text-grey-500 flex justify-center'>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isAllSelected}
                        indeterminate={selectedQuestions.length > 0 && selectedQuestions.length < questionData.length}
                        onChange={handleSelectAll}
                      />
                    }
                    label='Chọn'
                  />
                </div>
              </th>
              <th className='px-3 py-4 uppercase'>
                <div className='items-center gap-1 text-sm font-medium leading-none text-grey-500 flex justify-center'>
                  <span>#</span>
                </div>
              </th>
              <th className='px-3 py-4 uppercase'>
                <div className='items-center gap-1 text-sm font-medium leading-none text-grey-500 flex justify-center'>
                  <span>Nội dung</span>
                </div>
              </th>
              <th className='px-3 py-4 uppercase'>
                <div className='items-center gap-1 text-sm font-medium leading-none text-grey-500 flex justify-center'>
                  <span>Độ khó</span>
                </div>
              </th>
              <th className='px-3 py-4 uppercase'>
                <div className='items-center gap-1 text-sm font-medium leading-none text-grey-500 flex justify-center'>
                  <span>Ngày tạo</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {questionData && questionData.length > 0 ? (
              questionData.map((item, index) => (
                <tr key={item.id} className='even:bg-grey-100/50'>
                  <td className='px-3 py-3 text-center'>
                    <Checkbox
                      checked={selectedQuestions.includes(item.id)}
                      onChange={() => handleQuestionToggle(item.id)}
                    />
                  </td>
                  <td className='px-3 py-3 text-center'>{(page - 1) * limit + index + 1}</td>
                  <td className='px-3 py-3 max-w-[400px] truncate' title={item.content}>
                    {item.content}
                  </td>
                  <td className='px-3 py-3 text-center'>{item.level}</td>
                  <td className='px-3 py-3 text-center'>{new Date(item.created_at).toLocaleDateString('vi-VN')}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5}>
                  <div className='flex h-28 select-none items-center justify-center text-4.5xl font-semibold text-grey-100'>
                    Không có câu hỏi nào
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {paginationData && <TableRCPaginationCustom pagination={paginationData} onChangePage={handlePageChange} />}
    </Card>
  )
}
