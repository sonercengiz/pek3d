import React from 'react'
import { SideItemMenu } from '@wi3n/core'
import MenuContent from './MenuContent'

const menuContents = [
  {
    title: "Sahne",
    content: <></>
  }
]
const SideMenu = () => {
  return (
    <SideItemMenu menuContents={menuContents} />
  )
}

export default SideMenu