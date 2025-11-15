'use client'

import { useState, useCallback } from 'react'

import { useDropzone } from 'react-dropzone'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import { styled } from '@mui/material/styles'

interface UploadPDFSectionProps {
  onFileUpload: (file: File) => void
  isGenerating: boolean
}

const DropzoneWrapper = styled(Box)(({ theme }) => ({
  border: `2px dashed ${theme.palette.divider}`,
  borderRadius: 16,
  padding: theme.spacing(8),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  backgroundColor: theme.palette.background.paper,
  minHeight: 300,
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

export default function UploadPDFSection({ onFileUpload, isGenerating }: UploadPDFSectionProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0])
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    disabled: isGenerating
  })

  const handleGenerate = () => {
    if (selectedFile) {
      onFileUpload(selectedFile)
    }
  }

  return (
    <Box>
      <DropzoneWrapper {...getRootProps()} className={isDragActive ? 'active' : ''}>
        <input {...getInputProps()} />

        <Box className='flex flex-col items-center gap-4'>
          <Box className='flex items-center justify-center w-24 h-24 rounded-full bg-primary/10'>
            <i className='tabler-file-upload text-6xl text-primary' />
          </Box>

          {selectedFile ? (
            <>
              <Typography variant='h6' color='primary'>
                {selectedFile.name}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </Typography>
            </>
          ) : (
            <>
              <Typography variant='h6'>{isDragActive ? 'Thả file vào đây' : 'Kéo thả file PDF vào đây'}</Typography>
              <Typography variant='body2' color='text.secondary'>
                hoặc click để chọn file
              </Typography>
            </>
          )}

          <Typography variant='caption' color='text.disabled'>
            Chỉ chấp nhận file PDF (tối đa 10MB)
          </Typography>
        </Box>
      </DropzoneWrapper>

      {selectedFile && (
        <Box className='flex justify-center gap-4 mt-6'>
          <Button variant='outlined' color='secondary' onClick={() => setSelectedFile(null)} disabled={isGenerating}>
            Hủy
          </Button>
          <Button
            variant='contained'
            color='primary'
            onClick={handleGenerate}
            disabled={isGenerating}
            startIcon={isGenerating ? <CircularProgress size={20} /> : <i className='tabler-sparkles' />}
          >
            {isGenerating ? 'Đang tạo câu hỏi...' : 'Generate Quiz'}
          </Button>
        </Box>
      )}
    </Box>
  )
}
