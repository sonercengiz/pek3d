// CustomPopup.jsx
import React from 'react'
import { Box, Fade } from '@mui/material'
import { createPortal } from 'react-dom'

const CustomPopup = ({
  open,
  onClose,
  children,
}) => {
  if (!open) return null

  return createPortal(
    <Fade in={open}>
      {/* Backdrop */}
      <Box
        onClick={onClose}
        sx={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          bgcolor: '#00000000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1300,
        }}
      >
        {children}
      </Box>
    </Fade>,
    document.body
  )
}

export default CustomPopup
