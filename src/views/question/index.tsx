'use client'

import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'

import clsx from 'clsx'

import { Edit2, Eye, Trash } from 'iconsax-react'

import useTableHead from '@/hooks/useTableHead'

import CustomIconButton from '@/@core/components/mui/IconButton'


const questionData = [
  {
    id: '6a73feba-cc5e-4d4b-9d53-3e8c1e53e5d1',
    content: 'Cấu trúc dữ liệu nào được sử dụng trong ngăn xếp (stack)?',
    created_at: '2025-10-08',
    level: 1,
    type: 'multiple',
    updated_at: '2025-10-08',
    teacher_id: 'f20f6ac3-efc1-442d-9bd9-19e7d84a2b8e',
    answers: [
      {
        id: '94c94dbd-3fda-4d10-b8f3-ff5c5e7df69a',
        content: 'Mảng một chiều',
        is_true: false
      },
      {
        id: 'aa7a9b0d-8f27-4f94-8a7c-0c66a5b54de9',
        content: 'Danh sách liên kết',
        is_true: true
      },
      {
        id: '03b4ef1e-3a73-4c4e-a119-7de25e3c7ab4',
        content: 'Cây nhị phân',
        is_true: false
      }
    ],
    subject: [
      {
        id: 'b1f1a6f2-8c9b-4f41-ae12-3d7c98d1c3e1',
        name: 'Cấu trúc dữ liệu và giải thuật'
      }
    ]
  },
  {
    id: 'b5b3e0c5-489d-4d1d-8a7f-0aefc99a7b21',
    content: 'Độ phức tạp trung bình của tìm kiếm trong cây nhị phân cân bằng là gì?',
    created_at: '2025-10-08',
    level: 2,
    type: 'single',
    updated_at: '2025-10-08',
    teacher_id: 'f20f6ac3-efc1-442d-9bd9-19e7d84a2b8e',
    answers: [
      {
        id: '80c41d1e-50ea-44cf-988d-d9d9dcbd7a8e',
        content: 'O(log n)',
        is_true: true
      },
      {
        id: 'a3c939c2-5ae3-44ad-a0d2-68f4ea09e948',
        content: 'O(n)',
        is_true: false
      },
      {
        id: '1d3df0d5-0135-4a1d-b3b0-cbe7d5f7aee0',
        content: 'O(n²)',
        is_true: false
      }
    ],
    subject: [
      {
        id: 'b1f1a6f2-8c9b-4f41-ae12-3d7c98d1c3e1',
        name: 'Cấu trúc dữ liệu và giải thuật'
      }
    ]
  },
  {
    id: '8d94e08e-9c9d-4a09-91a4-8b21d4a27fd2',
    content: 'Thuật toán sắp xếp nào có độ phức tạp O(n²)?',
    created_at: '2025-10-08',
    level: 1,
    type: 'multiple',
    updated_at: '2025-10-08',
    teacher_id: 'f20f6ac3-efc1-442d-9bd9-19e7d84a2b8e',
    answers: [
      {
        id: 'cdf8d9b8-f64c-4d7d-817f-0a38518a112b',
        content: 'Bubble Sort',
        is_true: true
      },
      {
        id: 'ae40d251-0a72-4e9a-8841-aba01c46e20e',
        content: 'Selection Sort',
        is_true: true
      },
      {
        id: '21eb03cb-3133-4aa0-bad1-6f018395f6f5',
        content: 'Quick Sort',
        is_true: false
      }
    ],
    subject: [
      {
        id: 'b1f1a6f2-8c9b-4f41-ae12-3d7c98d1c3e1',
        name: 'Cấu trúc dữ liệu và giải thuật'
      }
    ]
  },
  {
    id: 'd4a4b728-4d52-4af0-bfda-f6c6deadc2d9',
    content: 'Cấu trúc dữ liệu nào phù hợp nhất để triển khai hàng đợi (queue)?',
    created_at: '2025-10-08',
    level: 1,
    type: 'single',
    updated_at: '2025-10-08',
    teacher_id: 'f20f6ac3-efc1-442d-9bd9-19e7d84a2b8e',
    answers: [
      {
        id: 'bf0a28cc-245f-4af7-bff0-3cc7e505ea2a',
        content: 'Danh sách liên kết vòng',
        is_true: false
      },
      {
        id: 'ef6a2f75-b6b7-42da-bc8c-bb6a0e43ec45',
        content: 'Danh sách liên kết',
        is_true: true
      },
      {
        id: '06e1d65b-412b-4dd8-8a4e-fc6c0247f427',
        content: 'Mảng một chiều',
        is_true: false
      }
    ],
    subject: [
      {
        id: 'b1f1a6f2-8c9b-4f41-ae12-3d7c98d1c3e1',
        name: 'Cấu trúc dữ liệu và giải thuật'
      }
    ]
  },
  {
    id: 'a3e1f9b2-8d1f-4b3a-8b0d-01c65d7f92ee',
    content: 'Khi nào nên dùng cây AVL thay vì cây nhị phân thông thường?',
    created_at: '2025-10-08',
    level: 3,
    type: 'single',
    updated_at: '2025-10-08',
    teacher_id: 'f20f6ac3-efc1-442d-9bd9-19e7d84a2b8e',
    answers: [
      {
        id: '7b60e009-5e4a-4b9a-8a79-9323a15a511b',
        content: 'Khi cần đảm bảo độ cân bằng của cây để tối ưu truy xuất',
        is_true: true
      },
      {
        id: '2387503b-1247-4937-b029-bbd5594a8c92',
        content: 'Khi không cần cân bằng cây',
        is_true: false
      },
      {
        id: 'f9279d41-0d36-4d14-a3e5-2026e9c69eb5',
        content: 'Khi dữ liệu đã được sắp xếp',
        is_true: false
      }
    ],
    subject: [
      {
        id: 'b1f1a6f2-8c9b-4f41-ae12-3d7c98d1c3e1',
        name: 'Cấu trúc dữ liệu và giải thuật'
      }
    ]
  }
]

export default function QuestionView() {
  const TABLE_HEAD = useTableHead()

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <Typography variant='h4' className='font-semibold'>
          Danh sách câu hỏi
        </Typography>
      </Grid>

      <Grid size={{ xs: 12 }}>
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

                          <CustomIconButton size='small' onClick={() => {}}>
                            <Trash size={18} color='#ED0909' />
                          </CustomIconButton>
                        </div>
                      </td>
                      <td className='px-3 py-3 max-w-[400px] truncate' title={item.content}>
                        {item.content}
                      </td>
                      <td className='px-3 py-3 text-center'>{item.level}</td>
                      <td
                        className='px-3 py-3 max-w-[400px] truncate'
                        title={item.subject.map(sub => sub.name).join(', ')}
                      >
                        {item.subject.map(sub => sub.name).join(', ')}
                      </td>
                      <td className='px-3 py-3 text-center'>{item.created_at}</td>
                      <td className='px-3 py-3 text-center'>{item.updated_at}</td>
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
        </Card>
      </Grid>
    </Grid>
  )
}
