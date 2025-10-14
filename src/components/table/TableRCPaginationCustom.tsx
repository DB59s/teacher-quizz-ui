// MUI Imports

import Typography from '@mui/material/Typography'
import { ArrowLeft2, ArrowRight2 } from 'iconsax-react'
import Pagination from 'rc-pagination/lib/Pagination'

const TableRCPaginationCustom = ({
  pagination,
  onChangePage
}: {
  pagination: any
  onChangePage: (page: number) => void
}) => {
  const page = Number(pagination?.page) || 1
  const limit = Number(pagination?.limit) || 10
  const totalItems = Number(pagination?.totalItems) || 0

  const startEntry = totalItems === 0 ? 0 : (page - 1) * limit + 1
  const endEntry = Math.min(page * limit, totalItems)

  return (
    <div className='flex justify-between items-center flex-wrap pli-6 border-bs bs-auto plb-5 gap-2'>
      <Typography color='text.disabled'>
        {`Hiển thị ${startEntry} - ${endEntry} trong tổng số ${totalItems}`}
      </Typography>
      <Pagination
        current={page}
        total={totalItems}
        pageSize={limit}
        hideOnSinglePage
        showTitle={false}
        showPrevNextJumpers
        className='hover:cursor-pointer'
        onChange={onChangePage}
        totalBoundaryShowSizeChanger={3}
        nextIcon={<ArrowRight2 color='#000' size='16' />}
        prevIcon={<ArrowLeft2 size='16' color='#000' />}
        jumpPrevIcon={<div>{`Jump Previous`}</div>}
        jumpNextIcon={<div>{`Jump Next`}</div>}
      />
    </div>
  )
}

export default TableRCPaginationCustom
