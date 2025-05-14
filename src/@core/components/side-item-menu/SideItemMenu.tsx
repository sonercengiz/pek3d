// SideItemMenu.tsx
import React, { FC, useState, ReactNode } from 'react'
import { Box, Tab } from '@mui/material'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { styled } from '@mui/material/styles'

export interface MenuContent {
  title: string
  content: ReactNode
}

interface SideItemMenuProps {
  menuContents: MenuContent[]
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
}))

const SideItemMenu: FC<SideItemMenuProps> = ({ menuContents }) => {
  // string olarak tutuyoruz çünkü TabContext value string ister
  const [value, setValue] = useState<string>('0')

  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  // sekme sayısına göre variant seçimi
  const tabsVariant = menuContents.length > 2 ? 'scrollable' : 'fullWidth'

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        m: 2,
        zIndex: 1,
        width: 220,
        bgcolor: '#000000CC',
        borderRadius: 4,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '96vh',
      }}
    >
      <TabContext value={value}>
        <TabList
          onChange={handleTabChange}
          variant={tabsVariant}
          scrollButtons={'auto'}
          allowScrollButtonsMobile
          
          slotProps={{
            startScrollButtonIcon: {
              sx: {
                color: '#fff',          // sola kayan ikon (←) rengi
                fontSize: '1rem'
              }
            },
            endScrollButtonIcon: {
              sx: {
                color: '#fff',          // sağa kayan ikon (→) rengi
                fontSize: '1rem'
              }
            }
          }}

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
            />
          ))}
        </TabList>

        {/* İçerikler */}
        {menuContents.map((menu, idx) => (
          <TabPanel
            key={idx}
            value={idx.toString()}
            sx={{ flex: 1, p: 0 }}
          >
            {menu.content}
          </TabPanel>
        ))}
      </TabContext>
    </Box>
  )
}

export default SideItemMenu
