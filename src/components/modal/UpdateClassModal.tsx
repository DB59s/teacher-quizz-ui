'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'

import { toast } from 'react-toastify'

import { updateClass, deleteClass, type UpdateClassPayload } from '@/services/class.service'
import useClass from '@/hooks/useClass'

interface UpdateClassModalProps {
  open: boolean
  onClose: () => void
  onSuccess?: () => void
  classData: {
    id: string
    name: string
    description: string
    status?: string
  }
}

export default function UpdateClassModal({ open, onClose, onSuccess, classData }: UpdateClassModalProps) {
  const router = useRouter()
  const { refreshClasses } = useClass()
  const [loading, setLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const [formData, setFormData] = useState<UpdateClassPayload>({
    name: classData.name,
    description: classData.description,
    status: (classData.status as 'active' | 'inactive') || 'active'
  })

  const handleChange = (field: keyof UpdateClassPayload, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleUpdate = async () => {
    if (!formData.name.trim()) {
      toast.error('Tên lớp học không được để trống')

      return
    }

    if (!formData.description.trim()) {
      toast.error('Mô tả không được để trống')

      return
    }

    try {
      setLoading(true)
      await updateClass(classData.id, formData)

      // Refresh danh sách lớp học
      await refreshClasses()

      toast.success('Cập nhật lớp học thành công')
      onClose()

      // Gọi callback để refresh dữ liệu trang
      if (onSuccess) {
        onSuccess()
      }
    } catch (error: any) {
      toast.error(error.message || 'Cập nhật lớp học thất bại')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      setDeleteLoading(true)
      await deleteClass(classData.id)

      // Refresh danh sách lớp học
      await refreshClasses()

      toast.success('Xóa lớp học thành công')
      setShowDeleteConfirm(false)
      onClose()
      router.push('/dashboards/teacher')
    } catch (error: any) {
      toast.error(error.message || 'Xóa lớp học thất bại')
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false)
  }

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
        <DialogTitle>Cập nhật lớp học</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              label='Tên lớp học'
              fullWidth
              value={formData.name}
              onChange={e => handleChange('name', e.target.value)}
              required
            />
            <TextField
              label='Mô tả'
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={e => handleChange('description', e.target.value)}
              required
            />
            <FormControl fullWidth>
              <InputLabel>Trạng thái</InputLabel>
              <Select value={formData.status} label='Trạng thái' onChange={e => handleChange('status', e.target.value)}>
                <MenuItem value='active'>Hoạt động</MenuItem>
                <MenuItem value='inactive'>Không hoạt động</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 3 }}>
          <Button variant='outlined' color='error' onClick={handleDeleteClick} disabled={deleteLoading || loading}>
            Xóa lớp học
          </Button>
          <Stack direction='row' spacing={2}>
            <Button onClick={onClose} disabled={loading || deleteLoading}>
              Hủy
            </Button>
            <Button variant='contained' onClick={handleUpdate} disabled={loading || deleteLoading}>
              {loading ? 'Đang cập nhật...' : 'Cập nhật'}
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteConfirm} onClose={handleDeleteCancel} maxWidth='xs' fullWidth>
        <DialogTitle>Xác nhận xóa lớp học</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa lớp học <strong>{classData.name}</strong>?
            <br />
            <br />
            Hành động này không thể hoàn tác và sẽ xóa tất cả dữ liệu liên quan đến lớp học này.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleDeleteCancel} disabled={deleteLoading}>
            Hủy
          </Button>
          <Button variant='contained' color='error' onClick={handleDeleteConfirm} disabled={deleteLoading}>
            {deleteLoading ? 'Đang xóa...' : 'Xóa lớp học'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
