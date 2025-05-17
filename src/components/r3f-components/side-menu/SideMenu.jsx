import React from 'react'
import { SideItemMenu } from '@wi3n/core'
import SceneTree from './SceneTree'

const menuContents = [
  {
    title: "Sahne",
    content: <><SceneTree /></>
  }
]
const SideMenu = () => {
  return (
    <SideItemMenu menuContents={menuContents} />
  )
}

export default SideMenu