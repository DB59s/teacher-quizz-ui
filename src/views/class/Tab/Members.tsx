import { useCallback, useEffect, useState } from 'react'

import Card from '@mui/material/Card'

import clsx from 'clsx'

import useTableHead from '@/hooks/useTableHead'
import { getClassStudents, removeStudentFromClass } from '@/services/class.service'

import PageLoading from '@/theme/PageLoading'

export default function Members(data: any) {
  const [loading, setLoading] = useState(false)
  const { _id } = data.data
  const [students, setStudents] = useState<any[]>([])
  const TABLE_HEAD = useTableHead()

  const fetchClassDetails = useCallback(async () => {
    setLoading(true)

    try {
      const list = await getClassStudents(_id)
      
      setStudents(list)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [_id])

  useEffect(() => {
    fetchClassDetails()
  }, [fetchClassDetails])

  console.log('Students:', students)

  const handleRemove = async (registrationId: string) => {
    setLoading(true)

    try {
      await removeStudentFromClass(registrationId)
      await fetchClassDetails()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
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
            {students.length === 0 ? (
              <tr>
                <td colSpan={TABLE_HEAD()?.length} className='p-4 text-center text-gray-500'>
                  Chưa có học sinh
                </td>
              </tr>
            ) : (
              students.map((student, index) => (
                <tr key={student.student_id}>
                  <td className='px-3 py-3 text-center'>{index + 1}</td>
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
    </Card>
  )
}
