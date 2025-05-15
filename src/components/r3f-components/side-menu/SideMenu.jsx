import React from 'react'
import SideItemMenu from '../../../@core/components/side-item-menu/SideItemMenu'
import MenuContent from './MenuContent'

const menuContents = [
  {
    title: "Sahne",
    content: <MenuContent />
  },
  {
    title: "Sahne",
    content: <MenuContent />
  }
]
const SideMenu = () => {
  return (
    <SideItemMenu menuContents={menuContents} />
  )
}

export default SideMenu