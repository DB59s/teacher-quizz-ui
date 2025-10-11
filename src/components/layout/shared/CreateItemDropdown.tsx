'use client'

// React Imports
import { useRef, useState } from 'react'

// Next Imports
import Link from 'next/link'

// import { useParams } from 'next/navigation'

// import { useSession } from 'next-auth/react'

// MUI Imports
import { Button } from '@mui/material'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Fade from '@mui/material/Fade'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import MenuList from '@mui/material/MenuList'
import Paper from '@mui/material/Paper'
import Popper from '@mui/material/Popper'
import type { Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

// Util Imports
import { Add } from 'iconsax-react'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'
import ModalCreateClass from '@/components/modal/ModalCreateClass'
import ModalCreateQuestion from '@/components/modal/ModalCreateQuestion'

const CreateItemDropdown = () => {
  // States
  const [open, setOpen] = useState(false)
  const [isModalCreateClassOpen, setIsModalCreateClassOpen] = useState(false)
  const [isModalCreateQuestionOpen, setIsModalCreateQuestionOpen] = useState(false)

  // Refs
  const anchorRef = useRef<HTMLButtonElement>(null)

  // Hooks
  const { settings } = useSettings()

  const isBelowSmScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))

  const handleClose = () => {
    setOpen(false)
  }

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen)
  }

  const AddIcon = () => <Add size={24} color='white' className='bg-primary rounded-full' />

  return (
    <>
      {isBelowSmScreen && (
        <IconButton ref={anchorRef} onClick={handleToggle}>
          <AddIcon />
        </IconButton>
      )}
      {!isBelowSmScreen && (
        <Button ref={anchorRef} variant='text' color='inherit' onClick={handleToggle} className='flex gap-1'>
          <AddIcon />
          Thêm mới
        </Button>
      )}
      <Popper
        open={open}
        transition
        disablePortal
        placement='bottom-start'
        anchorEl={anchorRef.current}
        className='min-is-[160px] !mbs-3 z-[1]'
      >
        {({ TransitionProps, placement }) => (
          <Fade
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom-start' ? 'left top' : 'right top'
            }}
          >
            <Paper className={settings.skin === 'bordered' ? 'border shadow-none' : 'shadow-lg'}>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList onKeyDown={handleClose}>
                  <MenuItem
                    component={Link}
                    href='#'
                    onClick={() => {
                      setIsModalCreateClassOpen(true)
                      handleClose();
                      }}
                  >
                    Tạo mới lớp học
                  </MenuItem>
                  <MenuItem
                    component={Link}
                    href='#'
                    onClick={() => {
                      setIsModalCreateQuestionOpen(true)
                      handleClose()
                    }}
                  >
                    Tạo mới câu hỏi
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
      <ModalCreateClass open={isModalCreateClassOpen} setOpen={setIsModalCreateClassOpen} />
      <ModalCreateQuestion type='create' open={isModalCreateQuestionOpen} setOpen={setIsModalCreateQuestionOpen} />
    </>
  )
}

export default CreateItemDropdown
