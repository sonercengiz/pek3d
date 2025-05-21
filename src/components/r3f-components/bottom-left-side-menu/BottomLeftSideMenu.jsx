import React from 'react'
import { SideItemMenu } from 'wi3n-core'
import SceneSettings from './SceneSettings'

const menuContents = [
  {
    title: "Scene Settings",
    content: <SceneSettings />
  }
]

const BottomLeftSideMenu = () => {
  return (
    <>
      {/* <SideItemMenu menuContents={menuContents} placement='bottom-left' height={'47vh'} width={200} /> */}
    </>

  )
}

export default BottomLeftSideMenu