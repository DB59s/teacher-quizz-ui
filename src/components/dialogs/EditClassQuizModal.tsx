'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import TextField from '@mui/material/TextField'

// Third-party Imports
import { toast } from 'react-toastify'

// Service Imports
import { getClassQuizDetail, updateClassQuiz, type ClassQuizDetail } from '@/services/classQuizzes.service'

// Component Imports
import PageLoading from '@/theme/PageLoading'

type EditClassQuizModalProps = {
  open: boolean
  onClose: () => void
  classQuizId: string | null
  onUpdateSuccess?: () => void
}

const EditClassQuizModal = ({ open, onClose, classQuizId, onUpdateSuccess }: EditClassQuizModalProps) => {
  const [classQuizDetail, setClassQuizDetail] = useState<ClassQuizDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form states
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')

  useEffect(() => {
    if (open && classQuizId) {
      fetchClassQuizDetail()
    } else {
      // Reset state when modal closes
      setClassQuizDetail(null)
      setError(null)
      setStartTime('')
      setEndTime('')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, classQuizId])

  const fetchClassQuizDetail = async () => {
    if (!classQuizId) return

    setLoading(true)
    setError(null)

    try {
      const data = await getClassQuizDetail(classQuizId)

      setClassQuizDetail(data)
      // Convert ISO strings to datetime-local format
      const startTimeLocal = new Date(data.start_time).toISOString().slice(0, 16)
      const endTimeLocal = new Date(data.end_time).toISOString().slice(0, 16)
      setStartTime(startTimeLocal)
      setEndTime(endTimeLocal)
    } catch (err) {
      setError('Không thể tải chi tiết class quiz. Vui lòng thử lại.')
      console.error('Error fetching class quiz detail:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!classQuizId || !startTime || !endTime) {
      toast.error('Vui lòng nhập đầy đủ thời gian', { position: 'bottom-right' })

      return
    }

    // Validate end time is after start time
    const startDate = new Date(startTime)
    const endDate = new Date(endTime)
    if (endDate <= startDate) {
      toast.error('Thời gian kết thúc phải sau thời gian bắt đầu', { position: 'bottom-right' })

      return
    }

    setSaving(true)

    try {
      // Convert datetime-local to ISO string
      const startTimeISO = new Date(startTime).toISOString()
      const endTimeISO = new Date(endTime).toISOString()

      await updateClassQuiz(classQuizId, {
        start_time: startTimeISO,
        end_time: endTimeISO
      })

      toast.success('Cập nhật class quiz thành công!', {
        position: 'bottom-right',
        autoClose: 3000
      })

      if (onUpdateSuccess) {
        onUpdateSuccess()
      }

      onClose()
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra khi cập nhật class quiz', {
        position: 'bottom-right',
        autoClose: 3000
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>Chỉnh sửa thời gian Class Quiz</DialogTitle>
      <DialogContent>
        <PageLoading show={loading} />
        {error && (
          <Box className='p-4 text-center'>
            <Typography color='error'>{error}</Typography>
            <Button variant='outlined' onClick={fetchClassQuizDetail} className='mt-2'>
              Thử lại
            </Button>
          </Box>
        )}
        {!loading && !error && classQuizDetail && (
          <Box className='space-y-4'>
            {/* Quiz Info */}
            <Box>
              <Box className='mb-4'>
                <Card>
                  <CardContent>
                    <Typography variant='h6' className='mb-2'>
                      {classQuizDetail.quiz?.name}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      {classQuizDetail.quiz?.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>

              <Divider className='my-4' />

              {/* Time Settings */}
              <Box className='space-y-4 mt-4'>
                <TextField
                  fullWidth
                  label='Thời gian bắt đầu'
                  type='datetime-local'
                  value={startTime}
                  onChange={e => setStartTime(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  disabled={saving}
                />

                <TextField
                  fullWidth
                  label='Thời gian kết thúc'
                  type='datetime-local'
                  value={endTime}
                  onChange={e => setEndTime(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  disabled={saving}
                />
              </Box>
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saving}>
          Hủy
        </Button>
        <Button variant='contained' onClick={handleSave} disabled={saving || loading || !startTime || !endTime}>
          {saving ? 'Đang lưu...' : 'Lưu'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditClassQuizModal
