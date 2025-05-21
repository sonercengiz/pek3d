// src/components/r3f-components/SideItemMenu.tsx
import React, { FC, useState, ReactNode } from 'react'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { styled, SxProps, Theme } from '@mui/material/styles'

export interface MenuContent {
  title: string
  content: ReactNode
}

export type Placement =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'top-center'
  | 'bottom-center'

interface SideItemMenuProps {
  menuContents: MenuContent[]
  width?: number | string
  height?: number | string
  placement?: Placement
  sx?: SxProps<Theme>
}

const CustomTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  fontSize: '14px',
  fontWeight: 500,
  color: '#AAA',
  minWidth: 0,
  padding: '6px 16px',
  borderRadius: '16px',
  marginRight: theme.spacing(1),
  '&.Mui-selected': {
    backgroundColor: '#FFFFFF1A',
    color: '#FFF',
  },
  '&.Mui-disabled': {
    opacity: 1,
    cursor: 'default',
    backgroundColor: 'transparent',
    color: '#555',
  },
}))

const placementMap: Record<Placement, SxProps<Theme>> = {
  'top-left': { top: 0, left: 0, transform: 'none' },
  'top-right': { top: 0, right: 0, transform: 'none' },
  'bottom-left': { bottom: 0, left: 0, transform: 'none' },
  'bottom-right': { bottom: 0, right: 0, transform: 'none' },
  'top-center': { top: 0, left: '50%', transform: 'translateX(-50%)' },
  'bottom-center': { bottom: 0, left: '50%', transform: 'translateX(-50%)' },
}

const SideItemMenu: FC<SideItemMenuProps> = ({
  menuContents,
  width = 220,
  height = '96vh',
  placement,
  sx,
}) => {
  const [value, setValue] = useState('0')
  const single = menuContents.length === 1

  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    if (!single) setValue(newValue)
  }

  const placementSx = placement ? placementMap[placement] : {}

  return (
    <Box
      sx={[
        {
          position: 'absolute',
          m: 2,
          zIndex: 1,
          bgcolor: '#000000CC',
          borderRadius: 4,
          display: 'flex',
          flexDirection: 'column',
          width,
          height,
        },
        placementSx,
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <TabContext value={value}>
        <TabList
          onChange={handleTabChange}
          variant={single ? 'fullWidth' : menuContents.length > 2 ? 'scrollable' : 'fullWidth'}
          scrollButtons={single ? false : 'auto'}
          allowScrollButtonsMobile={!single}
          sx={{
            p: 1,
            '& .MuiTabs-indicator': {
              backgroundColor: '#AAA',
              height: 2,
              borderRadius: 1,
            },
          }}
        >
          {menuContents.map((menu, idx) => (
            <CustomTab
              key={idx}
              label={menu.title}
              value={idx.toString()}
              sx={single ? { pointerEvents: 'none' } : undefined}
            />
          ))}
        </TabList>

        {menuContents.map((menu, idx) => (
          <TabPanel
            key={idx}
            value={idx.toString()}
            sx={{
              flex: 1,
              p: 0,
              overflowY: 'auto',
              userSelect: 'none',
              scrollbarWidth: 'none',
            }}
          >
            {menu.content}
          </TabPanel>
        ))}
      </TabContext>
    </Box>
  )
}

export default SideItemMenu
