import { useCallback, useEffect, useState } from 'react'

import Card from '@mui/material/Card'

import clsx from 'clsx'

import MenuItem from '@mui/material/MenuItem'
import { Users } from 'lucide-react'

import { toast } from 'react-toastify'

import useTableHead from '@/hooks/useTableHead'
import { getClassStudents, removeStudentFromClass } from '@/services/class.service'

import PageLoading from '@/theme/PageLoading'

import CustomTextField from '@/@core/components/mui/TextField'
import TableRCPaginationCustom from '@/components/table/TableRCPaginationCustom'

export default function Members(data: any) {
  const [loading, setLoading] = useState(false)
  const { _id } = data.data
  const [students, setStudents] = useState<any[]>([])
  const TABLE_HEAD = useTableHead()
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const fetchClassDetails = useCallback(async () => {
    setLoading(true)

    try {
      const list = await getClassStudents(_id)

      setStudents(list)
      setCurrentPage(1)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [_id])

  useEffect(() => {
    fetchClassDetails()
  }, [fetchClassDetails])


  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setItemsPerPage(parseInt(e.target.value))
    setCurrentPage(1)
  }

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const displayedStudents = students.slice(startIndex, endIndex)

  const handleRemove = async (registrationId: string) => {
    setLoading(true)

    try {
      await removeStudentFromClass(registrationId)
      await fetchClassDetails()
      toast.success('Xóa học sinh khỏi lớp thành công!', {
        position: 'bottom-right',
        autoClose: 3000
      })
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || 'Xóa học sinh thất bại!', {
        position: 'bottom-right',
        autoClose: 3000
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <PageLoading show={loading} />
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
            {students.length === 0 ? (
              <tr>
                <td colSpan={TABLE_HEAD()?.length}>
                  <div className='flex h-28 select-none items-center justify-center flex-col gap-2'>
                    <Users size={48} className='text-grey-200' />
                    <span className='text-4.5xl text-grey-100'>Chưa có học sinh</span>
                  </div>
                </td>
              </tr>
            ) : (
              displayedStudents.map((student, index) => (
                <tr key={student.student_id}>
                  <td className='px-3 py-3 text-center'>{startIndex + index + 1}</td>
                  <td className='px-3 py-3 text-center'>{student.student.full_name}</td>
                  <td className='px-3 py-3 text-center'>{student.student.student_code}</td>
                  <td className='px-3 py-3 text-center'>{student.student.email}</td>
                  <td className='px-3 py-3 text-center'>
                    {student.status === 'approved' ? (
                      <button
                        className='px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600'
                        onClick={() => handleRemove(student.registration_id)}
                      >
                        Xóa
                      </button>
                    ) : (
                      <span>{student.status}</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {students.length > 0 && (
        <TableRCPaginationCustom
          pagination={{
            page: currentPage,
            limit: itemsPerPage,
            totalItems: students.length
          }}
          onChangePage={handlePageChange}
        />
      )}
    </Card>
  )
}
