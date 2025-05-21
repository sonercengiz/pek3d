// src/components/r3f-components/bottom-toolbar/BottomToolbar.jsx
import React from 'react'
import { Toolbar } from 'wi3n-core'
import ViewInArIcon from '@mui/icons-material/ViewInAr'
import { useSettingsStorage } from '../../../storage/SceneStorage'
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';

export default function BottomToolbar() {
  const { mode, setMode } = useSettingsStorage()

  // Define toolbar items inside the component to capture setMode
  const items = [
    {
      id: 'selection-mode',
      icon: <ZoomOutMapIcon />,
      onClick: () => setMode(mode === 'selection' ? null : 'selection'),

    },
    {
      id: 'snap-mode',
      icon: <ViewInArIcon />,
      onClick: () => setMode(mode === 'snap' ? null : 'snap'),
    },
  ]

  return (
    <Toolbar
      items={items}
      mode="select"
      placement="bottom-center"
      containerSx={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)' }}
    />
  )
}
