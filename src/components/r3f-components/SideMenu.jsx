import React from 'react'
import SideItemMenu from '../../@core/components/side-item-menu/SideItemMenu'

const menuContents = [
  {
    title: "Objeler",
    content: <></>
  },
  {
    title: "Assetler",
    content: <></>
  }
]
const SideMenu = () => {
  return (
    <SideItemMenu menuContents={menuContents}/>
  )
}

export default SideMenu