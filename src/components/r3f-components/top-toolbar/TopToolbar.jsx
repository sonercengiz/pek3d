// TopToolbar.jsx
import React, { useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import SettingsIcon from '@mui/icons-material/Settings'
import { Toolbar } from '@wi3n/core'
import CustomPopup from '../CustomPopup'
import SettingsSection from './SettingsSection'
import AddComponentSection from './AddComponentSection'

const TopToolbar = () => {
  const [openAdd, setOpenAdd] = useState(false)
  const [openSettings, setOpenSettings] = useState(false)

  const items = [
    {
      id: 'add-component',
      icon: <AddIcon />,
      onClick: () => setOpenAdd(true),
    },
    {
      id: 'settings',
      icon: <SettingsIcon />,
      onClick: () => setOpenSettings(true),
    },
  ]

  return (
    <>
      <Toolbar
        items={items}
        mode="click"
        placement="top-center"
      />

      {/* Custom “Add Component” Popup */}
      <CustomPopup open={openAdd} onClose={() => setOpenAdd(false)}>
        <AddComponentSection />
      </CustomPopup>

      {/* Custom “Settings” Popup */}
      <CustomPopup open={openSettings} onClose={() => setOpenSettings(false)}>
        <SettingsSection />
      </CustomPopup>
    </>
  )
}

export default TopToolbar
