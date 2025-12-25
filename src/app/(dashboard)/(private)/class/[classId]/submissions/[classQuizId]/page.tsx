'use client'

import React, { useCallback, useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'

import { ArrowLeft, Eye } from 'lucide-react'

import { getClassQuizSubmissions, type Submission } from '@/services/submission.service'
import PageLoading from '@/theme/PageLoading'
import CustomIconButton from '@/@core/components/mui/IconButton'
import TableRCPaginationCustom from '@/components/table/TableRCPaginationCustom'
import SubmissionDetailModal from '@/components/dialogs/SubmissionDetailModal'
import { formatDateVN } from '@/utils/dateFormat'

export default function SubmissionsPage({ params }: { params: Promise<{ classId: string; classQuizId: string }> }) {
  const router = useRouter()
  const unwrappedParams = React.use(params)
  const { classQuizId } = unwrappedParams

  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalItems, setTotalItems] = useState(0)

  // States for submission detail modal
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null)

  const fetchSubmissions = useCallback(async () => {
    setLoading(true)

    try {
      const response = await getClassQuizSubmissions(classQuizId, currentPage, itemsPerPage)

      setSubmissions(response.data)
      setTotalItems(response.pagination.total_items)
    } catch (error) {
      console.error('Error fetching submissions:', error)
    } finally {
      setLoading(false)
    }
  }, [classQuizId, currentPage, itemsPerPage])

  useEffect(() => {
    fetchSubmissions()
  }, [fetchSubmissions])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setItemsPerPage(parseInt(e.target.value))
    setCurrentPage(1)
  }

  const handleViewDetail = (submissionId: string) => {
    setSelectedSubmissionId(submissionId)
    setShowDetailModal(true)
  }

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'graded':
        return <Chip label='Đã chấm' color='success' size='small' />
      case 'pending':
        return <Chip label='Chờ chấm' color='warning' size='small' />
      case 'not_submitted':
        return <Chip label='Chưa nộp' color='default' size='small' />
      default:
        return <Chip label={status} size='small' />
    }
  }

  const TABLE_HEAD = [
    { name: 'STT', position: 'center' },
    { name: 'Hành động', position: 'center' },
    { name: 'Họ và tên', position: 'left' },
    { name: 'Mã sinh viên', position: 'center' },
    { name: 'Trạng thái', position: 'center' },
    { name: 'Điểm', position: 'center' },
    { name: 'Thời gian nộp', position: 'center' }
  ]

  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-4'>
        <Button startIcon={<ArrowLeft size={20} />} onClick={() => router.back()}>
          Quay lại
        </Button>
        <Typography variant='h4'>Danh sách bài nộp</Typography>
      </div>

      <Card>
        <PageLoading show={loading} />

        <div className='overflow-x-auto w-full'>
          <table className='w-full min-w-max table-auto text-left text-sm border-spacing-0'>
            <thead>
              <tr>
                {TABLE_HEAD.map((head, index) => (
                  <th key={`${index}_${head.name}`} className='px-3 py-4 uppercase'>
                    <div
                      className={`items-center gap-1 text-sm font-medium leading-none text-grey-500 text-${head.position} flex justify-${head.position === 'left' ? 'start' : 'center'}`}
                    >
                      <span>{head.name}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {submissions.length > 0 ? (
                submissions.map((submission, index) => {
                  const stt = (currentPage - 1) * itemsPerPage + index + 1

                  return (
                    <tr key={submission.submission_id || stt} className='border-t border-grey-200 hover:bg-grey-100'>
                      <td className='px-3 py-4 text-center'>{stt}</td>
                      <td className='px-3 py-4 text-center'>
                        {submission.submission_id && (
                          <CustomIconButton size='small' onClick={() => handleViewDetail(submission.submission_id!)}>
                            <Eye size={18} color='#000' />
                          </CustomIconButton>
                        )}
                      </td>
                      <td className='px-3 py-4'>{submission.student.full_name}</td>
                      <td className='px-3 py-4 text-center'>{submission.student.student_code}</td>
                      <td className='px-3 py-4 text-center'>{getStatusChip(submission.status)}</td>
                      <td className='px-3 py-4 text-center'>{submission.score !== null ? submission.score : '-'}</td>
                      <td className='px-3 py-4 text-center'>
                        {submission.submission_time ? formatDateVN(submission.submission_time, true) : '-'}
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={TABLE_HEAD.length}>
                    <div className='flex h-28 select-none items-center justify-center'>
                      <Typography color='text.secondary'>Không có dữ liệu</Typography>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalItems > 0 && (
          <TableRCPaginationCustom
            pagination={{
              page: currentPage,
              limit: itemsPerPage,
              totalItems: totalItems
            }}
            onChangePage={handlePageChange}
            onLimitChange={handleLimitChange}
            showLimitSelector={true}
          />
        )}
      </Card>

      {/* Submission Detail Modal */}
      <SubmissionDetailModal
        open={showDetailModal}
        onClose={() => {
          setShowDetailModal(false)
          setSelectedSubmissionId(null)
        }}
        submissionId={selectedSubmissionId}
      />
    </div>
  )
}
