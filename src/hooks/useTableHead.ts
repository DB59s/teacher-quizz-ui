import { useCallback } from 'react'

import { usePathname } from 'next/navigation'

const useTableHead = () => {

  const pathname = usePathname()

  const TABLE_HEAD = useCallback(() => {
    const isQuestionPath = /question/.test(pathname || '')

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
          maxWidth: 160
        },
        {
          name: 'Độ khó',
          position: 'center',
          sortable: false,
          field: 'level'
        },
        {
          name: 'Môn học',
          position: 'left',
          sortable: false,
          field: 'subject',
          maxWidth: 160
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
  }, [pathname])

  return TABLE_HEAD
}

export default useTableHead
