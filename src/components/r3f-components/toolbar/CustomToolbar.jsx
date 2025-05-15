import React from 'react'
import AbcIcon from '@mui/icons-material/Abc';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import SettingsIcon from '@mui/icons-material/Settings';
import Toolbar from '../../../@core/components/toolbar/Toolbar';
import MapIcon from '@mui/icons-material/Map';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import MemoryIcon from '@mui/icons-material/Memory';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

const toolbarItems = [
  {
    id: 'move',
    icon: <AbcIcon />,
    onClick: () => {
      console.log('Move seçildi')
    }
  },
  {
    id: 'reset-camera',
    icon: <PhotoCameraIcon />,
    onClick: () => {
      console.log('camera seçildi')
    }
  },
  {
    id: 'settings',
    icon: <SettingsIcon />,
    onClick: () => {
      console.log('settings seçildi')
    }
  },
]

const toolbarItems2 = [
  {
    id: 'map',
    icon: <MapIcon />,
    onClick: () => {
      console.log('Move seçildi')
    }
  },
  {
    id: 'reset-camera',
    icon: <ManageAccountsIcon />,
    onClick: () => {
      console.log('camera seçildi')
    }
  },
  {
    id: 'settings',
    icon: <MemoryIcon />,
    onClick: () => {
      console.log('settings seçildi')
    }
  },
  {
    id: 'settings2',
    icon: <PictureAsPdfIcon />,
    onClick: () => {
      console.log('settings seçildi')
    }
  },

]

const CustomToolbar = () => {
  const handleSelect = (id, index) => {
    // console.log(`Seçilen buton: ${id} (index: ${index})`)
  }
  return (
    <>
      <Toolbar
        items={toolbarItems}
        mode="click"
        placement="top-center"
      />

      {/* or in select-mode, bottom-right */}
      <Toolbar
        items={toolbarItems2}
        mode="select"
        initialSelectedIndex={1}
        onSelect={handleSelect}
        placement="bottom-center"
      />
    </>
  )
}

export default CustomToolbar