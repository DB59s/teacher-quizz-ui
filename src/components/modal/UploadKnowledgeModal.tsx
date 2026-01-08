'use client'

import { useState, useCallback } from 'react'

import { useDropzone } from 'react-dropzone'
import { toast } from 'react-toastify'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import { styled } from '@mui/material/styles'

import { apiClient } from '@/libs/axios-client'
import DialogCloseButton from '../dialogs/DialogCloseButton'

interface UploadKnowledgeModalProps {
  open: boolean
  onClose: () => void
}

const DropzoneWrapper = styled(Box)(({ theme }) => ({
  border: `2px dashed ${theme.palette.divider}`,
  borderRadius: 16,
  padding: theme.spacing(6),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  backgroundColor: theme.palette.background.paper,
  minHeight: 200,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.action.hover,
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4]
  },
  '&.active': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.action.selected,
    borderWidth: 3
  }
}))

export default function UploadKnowledgeModal({ open, onClose }: UploadKnowledgeModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0])
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt']
    },
    maxFiles: 1,
    disabled: isUploading
  })

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    const toastId = toast.loading('Đang nạp tri thức...')

    try {
      const formData = new FormData()

      formData.append('file', selectedFile)

      await apiClient.post('https://api.vuquangduy.io.vn/api/v1/knowledge/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      toast.update(toastId, {
        render: 'Nạp tri thức thành công!',
        type: 'success',
        isLoading: false,
        autoClose: 3000
      })

      // Reset and close
      setSelectedFile(null)
      onClose()
    } catch (error: any) {
      toast.update(toastId, {
        render: error.message || 'Có lỗi xảy ra khi nạp tri thức',
        type: 'error',
        isLoading: false,
        autoClose: 5000
      })
      console.error('Upload knowledge error:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleClose = () => {
    if (!isUploading) {
      setSelectedFile(null)
      onClose()
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth='sm'
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          overflow: 'visible'
        }
      }}
    >
      <DialogCloseButton onClick={handleClose} disableRipple disabled={isUploading}>
        <i className='tabler-x' />
      </DialogCloseButton>

      <DialogTitle variant='h4' className='text-center'>
        Nạp tri thức
      </DialogTitle>

      <DialogContent
        sx={{
          overflowY: 'auto',
          overflowX: 'visible'
        }}
      >
        <Box className='mt-2'>
          <DropzoneWrapper {...getRootProps()} className={isDragActive ? 'active' : ''}>
            <input {...getInputProps()} />

            <Box className='flex flex-col items-center gap-4'>
              <Box className='flex items-center justify-center w-20 h-20 rounded-full bg-primary/10'>
                <i className='tabler-file-text text-5xl text-primary' />
              </Box>

              {selectedFile ? (
                <>
                  <Typography variant='h6' color='primary'>
                    {selectedFile.name}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </Typography>
                </>
              ) : (
                <>
                  <Typography variant='h6'>{isDragActive ? 'Thả file vào đây' : 'Kéo thả file TXT vào đây'}</Typography>
                  <Typography variant='body2' color='text.secondary'>
                    hoặc click để chọn file
                  </Typography>
                </>
              )}

              <Typography variant='caption' color='text.disabled'>
                Chỉ chấp nhận file TXT (tối đa 10MB)
              </Typography>
            </Box>
          </DropzoneWrapper>
        </Box>
      </DialogContent>

      <DialogActions className='justify-center gap-3 pb-6'>
        <Button variant='tonal' color='secondary' onClick={handleClose} disabled={isUploading} size='large'>
          Hủy
        </Button>
        <Button
          variant='contained'
          color='primary'
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          size='large'
          startIcon={isUploading ? <CircularProgress size={20} /> : <i className='tabler-upload' />}
        >
          {isUploading ? 'Đang nạp...' : 'Nạp tri thức'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
