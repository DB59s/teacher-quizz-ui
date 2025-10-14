'use client'

import Card from '@mui/material/Card'

import clsx from 'clsx'

import useTableHead from '@/hooks/useTableHead'

export default function QuizzTable() {
    const TABLE_HEAD = useTableHead()

    return (
        <Card>
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
                  <tr>
                    <td colSpan={100}>
                      <div className='flex h-28 select-none items-center justify-center text-4.5xl font-semibold text-grey-100'>
                        Không có quizz nào
                      </div>
                    </td>
                  </tr>
              </tbody>
            </table>
          </div>
        </Card>
    )
}
