import React, { useState, FC } from 'react'
import { Paper, Button, SxProps, Theme } from '@mui/material'

export interface ToolbarItem {
  /** Unique id for the item */
  id: string
  /** What to render inside the button (SVG, <Icon>, <img>, etc.) */
  icon: React.ReactNode
  /** Called when this button is clicked */
  onClick: () => void
}

export type ToolbarMode = 'click' | 'select'
export type ToolbarPlacement =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'top-center'
  | 'bottom-center'

export interface ToolbarProps {
  /** The list of buttons to render */
  items: ToolbarItem[]
  /** Mode: 'click' for simple buttons, 'select' for toggleable selection */
  mode?: ToolbarMode
  /** Placement on screen */
  placement?: ToolbarPlacement
  /** Optional callback when selection changes (only in 'select' mode) */
  onSelect?: (id: string, index: number) => void
  /** Initial selected index (only in 'select' mode) */
  initialSelectedIndex?: number
  /** Style override for the container Paper */
  containerSx?: SxProps<Theme>
  /** Style override for each button */
  buttonSx?: SxProps<Theme>
}

export const Toolbar: FC<ToolbarProps> = ({
  items,
  mode = 'click',
  placement = 'top-left',
  onSelect,
  initialSelectedIndex = 0,
  containerSx,
  buttonSx,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(initialSelectedIndex)

  const handleClick = (item: ToolbarItem, idx: number) => {
    item.onClick()
    if (mode === 'select') {
      setSelectedIndex(idx)
      onSelect?.(item.id, idx)
    }
  }

  const defaultButtonSx: SxProps<Theme> = {
    borderRadius: '50%',
    minWidth: 40,
    minHeight: 40,
    padding: 0,
    mx: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    '&:hover': {
      border: '2px solid #fff',
      backgroundColor: 'black',
    },
  }

  // Determine positioning based on placement prop
  const positionSx: SxProps<Theme> = (() => {
    switch (placement) {
      case 'top-left':
        return { top: 0, left: 0, transform: 'none' }
      case 'top-right':
        return { top: 0, right: 0, transform: 'none' }
      case 'bottom-left':
        return { bottom: 0, left: 0, transform: 'none' }
      case 'bottom-right':
        return { bottom: 0, right: 0, transform: 'none' }
      case 'top-center':
        return { top: 0, left: '50%', transform: 'translateX(-50%)' }
      case 'bottom-center':
        return { bottom: 0, left: '50%', transform: 'translateX(-50%)' }
      default:
        return { top: 0, left: 0, transform: 'none' }
    }
  })()

  return (
    <Paper
      sx={{
        position: 'absolute',
        m: 2,
        p: 1,
        display: 'flex',
        bgcolor: '#000000CC',
        borderRadius: 6,
        ...positionSx,
        ...containerSx,
      }}
    >
      {items.map((item, idx) => (
        <Button
          key={item.id}
          variant="contained"
          size="small"
          onClick={() => handleClick(item, idx)}
          sx={{
            ...defaultButtonSx,
            ...(mode === 'select' && selectedIndex === idx
              ? {
                border: '2px solid #2C99FF',
                backgroundColor: 'black',
                '&:hover': {},
              }
              : {}),
            ...buttonSx,
          }}
        >
          {item.icon}
        </Button>
      ))}
    </Paper>
  )
}

export default Toolbar