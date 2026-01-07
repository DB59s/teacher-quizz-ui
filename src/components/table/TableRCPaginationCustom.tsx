// MUI Imports

import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'
import { ArrowLeft2, ArrowRight2 } from 'iconsax-react'
import Pagination from 'rc-pagination/lib/Pagination'

import CustomTextField from '@/@core/components/mui/TextField'

const TableRCPaginationCustom = ({
  pagination,
  onChangePage,
  onLimitChange,
  showLimitSelector = false
}: {
  pagination: any
  onChangePage: (page: number) => void
  onLimitChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  showLimitSelector?: boolean
}) => {
  const page = Number(pagination?.page) || 1
  const limit = Number(pagination?.limit) || 10
  const totalItems = Number(pagination?.totalItems) || 0

  const startEntry = totalItems === 0 ? 0 : (page - 1) * limit + 1
  const endEntry = Math.min(page * limit, totalItems)

  return (
    <div className='flex justify-between items-center flex-wrap pli-6 border-bs bs-auto plb-5 gap-2'>
      <div className='flex items-center gap-3'>
        <Typography color='text.disabled'>
          {`Hiển thị ${startEntry} - ${endEntry} trong tổng số ${totalItems}`}
        </Typography>
        {showLimitSelector && onLimitChange && (
          <CustomTextField select value={limit.toString()} onChange={onLimitChange} className='is-[70px]'>
            <MenuItem value='10'>10</MenuItem>
            <MenuItem value='25'>25</MenuItem>
            <MenuItem value='50'>50</MenuItem>
          </CustomTextField>
        )}
      </div>
      <Pagination
        current={page}
        total={totalItems}
        pageSize={limit}
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
