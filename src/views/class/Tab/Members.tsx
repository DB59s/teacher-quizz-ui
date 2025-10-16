import { useCallback, useEffect, useState } from 'react'

import Card from '@mui/material/Card'

import clsx from 'clsx'

import { fetchApi } from '@/libs/fetchApi'
import useTableHead from '@/hooks/useTableHead'

import PageLoading from '@/theme/PageLoading'

export default function Members(data: any) {
  const [loading, setLoading] = useState(false)
  const { _id } = data.data
  const [students, setStudents] = useState<any[]>([])
  const TABLE_HEAD = useTableHead()

  const fetchClassDetails = useCallback(async () => {
    setLoading(true)

    try {
      const response = await fetchApi(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/classes/teacher/${_id}/students`, {
        method: 'GET'
      })

      if (!response.ok) throw new Error('Failed to fetch class details')
      const json = await response.json()

      setStudents(json?.data.students || [])
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
                <td colSpan={TABLE_HEAD()?.length} className='p-4 text-center text-gray-500'>Chưa có học sinh</td>
              </tr>
            ) : (
              students.map((student, index) => (
                <tr key={student.student_id}>
                  <td className='px-3 py-3 text-center'>{index + 1}</td>
                  <td className='px-3 py-3 text-center'>{student.student.full_name}</td>
                  <td className='px-3 py-3 text-center'>{student.student.student_code}</td>
                  <td className='px-3 py-3 text-center'>{student.student.email}</td>
                  <td className='px-3 py-3 text-center'>{student.student.phone_number}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
