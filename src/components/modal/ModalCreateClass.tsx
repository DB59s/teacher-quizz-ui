// Next Imports
import { useSession } from 'next-auth/react'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Grid from '@mui/material/Grid2'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'

// Component Imports
import DialogCloseButton from '../dialogs/DialogCloseButton'
import CustomTextField from '@/@core/components/mui/TextField'
import CustomInputLabel from '../form/CustomInputLabel'


type ModalCreateClassProps = {
  open: boolean
  setOpen: (open: boolean) => void
}

export default function ModalCreateClass({ open, setOpen }: ModalCreateClassProps) {
    const session = useSession()

    console.log(session)

  return (
    <Dialog open={open} sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
      <DialogCloseButton onClick={() => setOpen(false)} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>

      <DialogTitle variant='h4' className='text-center'>
        Tạo lớp học mới
      </DialogTitle>

      <form onSubmit={e => e.preventDefault()}>
        <DialogContent className='overflow-visible'>
          <Grid container spacing={6}>
            <Grid size={{ xs: 12 }} className='flex gap-4'>
              <CustomInputLabel>Tên lớp học</CustomInputLabel>
              <CustomTextField />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className='justify-center'>
          <Button variant='contained' type='submit' onClick={() => setOpen(false)}>
            Tạo
          </Button>

          <Button variant='tonal' type='reset' color='secondary' onClick={() => setOpen(false)}>
            Huỷ
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
