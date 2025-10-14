import { useCallback } from 'react'

import { usePathname } from 'next/navigation'

const useTableHead = () => {

  const pathname = usePathname()

  const TABLE_HEAD = useCallback(() => {
    const isQuestionPath = /question/.test(pathname || '')
    const isQuizzPath = /quizz/.test(pathname || '')

    if (isQuestionPath) {
      return [
        {
          name: '#',
          position: 'center',
          sortable: false,
          field: 'index'
        },
        {
          name: 'Hành động',
          position: 'center',
          sortable: false,
          field: 'actions',
        },
        {
          name: 'Nội dung',
          position: 'center',
          sortable: false,
          field: 'content',
          maxWidth: 360
        },
        {
          name: 'Độ khó',
          position: 'center',
          sortable: false,
          field: 'level'
        },
        {
          name: 'Ngày tạo',
          position: 'center',
          sortable: false,
          field: 'createdAt'
        },
        {
          name: 'Ngày cập nhật',
          position: 'left',
          sortable: false,
          field: 'updatedAt'
        }
      ]
    }

    if (isQuizzPath) {
      return [
        {
          name: '#',
          position: 'center',
          sortable: false,
          field: 'index'
        },
        {
          name: 'Hành động',
          position: 'center',
          sortable: false,
          field: 'actions',
        },
        {
          name: 'Nội dung',
          position: 'center',
          sortable: false,
          field: 'name',
        },
        {
          name: 'Số câu hỏi',
          position: 'center',
          sortable: false,
          field: 'questionCount'
        },
        {
          name: 'Thời gian làm bài',
          position: 'center',
          sortable: false,
          field: 'duration'
        },
        {
          name: 'Ngày tạo',
          position: 'center',
          sortable: false,
          field: 'createdAt'
        },
        {
          name: 'Ngày cập nhật',
          position: 'center',
          sortable: false,
          field: 'updatedAt'
        }
      ]
    }

  }, [pathname])

  return TABLE_HEAD
}

export default useTableHead
