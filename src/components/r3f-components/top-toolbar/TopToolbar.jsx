// src/TopToolbar.jsx
import React, { useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import SettingsIcon from '@mui/icons-material/Settings'
import CameraOutdoorIcon from '@mui/icons-material/CameraOutdoor'
import { Toolbar, useModelsStorage } from 'wi3n-core'
import CustomPopup from '../CustomPopup'
import SettingsSection from './SettingsSection'
import AddComponentSection from '../add-component-section'
import { useCameraStorage } from 'wi3n-core'

export default function TopToolbar() {
  const [openAdd, setOpenAdd] = useState(false)
  const [openSettings, setOpenSettings] = useState(false)

  // camera setters
  const setPos = useCameraStorage(s => s.setCameraPosition)
  const setTar = useCameraStorage(s => s.setCameraTarget)
  const setZoom = useCameraStorage(s => s.setCameraZoom)
  // clear selection
  const clearSel = useModelsStorage(s => s.clearSelection)

  const initialPos = [0, 10, 10]
  const initialTar = [0, 0, 0]
  const initialZoom = 1

  const items = [
    { id: 'add-component', icon: <AddIcon />, onClick: () => setOpenAdd(true) },
    // {
    //   id: 'reset-camera',
    //   icon: <CameraOutdoorIcon />,
    //   onClick: () => {
    //     // store’a gerçekten yeni değerler yazar
    //     setPos(initialPos)
    //     setTar(initialTar)
    //     setZoom(initialZoom)
    //     clearSel()
    //   }
    // },
    { id: 'settings', icon: <SettingsIcon />, onClick: () => setOpenSettings(true) },
  ]

  return (
    <>
      <Toolbar items={items} mode="click" placement="top-center" />

      <CustomPopup open={openAdd} onClose={() => setOpenAdd(false)}>
        <AddComponentSection onClose={() => setOpenAdd(false)} />
      </CustomPopup>

      <CustomPopup open={openSettings} onClose={() => setOpenSettings(false)}>
        <SettingsSection />
      </CustomPopup>
    </>
  )
}
