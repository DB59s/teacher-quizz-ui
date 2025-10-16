// React Imports
import { useState } from 'react'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

// Component Imports
import DialogCloseButton from '../dialogs/DialogCloseButton'
import { fetchApi } from '@/libs/fetchApi'

type Quiz = {
  id: string
  name: string
  description?: string
}

type ModalConfirmDeleteQuizzProps = {
  open: boolean
  setOpen: (open: boolean) => void
  quiz: Quiz | null
  onDeleteSuccess?: () => void
}

export default function ModalConfirmDeleteQuizz({
  open,
  setOpen,
  quiz,
  onDeleteSuccess
}: ModalConfirmDeleteQuizzProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleConfirmDelete = async () => {
    if (!quiz?.id) return

    try {
      setIsDeleting(true)

      const res = await fetchApi(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/quizzes/${quiz.id}`, {
        method: 'DELETE'
      })

      if (!res.ok) throw new Error('Xoá quiz thất bại')

      // Close modal
      setOpen(false)

      // Call success callback
      if (onDeleteSuccess) {
        onDeleteSuccess()
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCancel = () => {
    setOpen(false)
  }

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      maxWidth='sm'
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          overflow: 'visible'
        }
      }}
    >
      <DialogCloseButton onClick={handleCancel} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>

      <DialogTitle variant='h4' className='text-center'>
        Xác nhận xóa quiz
      </DialogTitle>

      <DialogContent
        sx={{
          overflowY: 'auto',
          overflowX: 'visible'
        }}
      >
        <Typography className='mb-4'>Bạn có chắc chắn muốn xóa quiz này không?</Typography>

        {quiz && (
          <div className='space-y-2'>
            <Typography
              variant='body2'
              color='text.secondary'
              className='mt-2 p-3 bg-grey-50 rounded border-l-4 border-l-blue-300'
            >
              <strong>Tên quiz:</strong> {quiz.name}
            </Typography>
            {quiz.description && (
              <Typography
                variant='body2'
                color='text.secondary'
                className='p-3 bg-grey-50 rounded border-l-4 border-l-blue-300'
              >
                <strong>Mô tả:</strong> {quiz.description}
              </Typography>
            )}
          </div>
        )}

        <Typography color='error' className='mt-4 p-2 bg-red-50 rounded border border-red-200'>
          <strong>⚠️ Lưu ý:</strong> Hành động này không thể hoàn tác!
        </Typography>
      </DialogContent>

      <DialogActions className='justify-center gap-3 pb-6'>
        <Button variant='tonal' color='secondary' onClick={handleCancel} disabled={isDeleting} size='large'>
          Hủy
        </Button>
        <Button variant='contained' color='error' onClick={handleConfirmDelete} disabled={isDeleting} size='large'>
          {isDeleting ? 'Đang xóa...' : 'Xác nhận xóa'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
