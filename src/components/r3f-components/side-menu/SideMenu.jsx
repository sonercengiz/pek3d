import React from 'react'
import { SideItemMenu, useModelsStorage } from 'wi3n-core'
import SceneTree from './SceneTree'
import SceneSettings from './SceneSettings'

const menuContents = [
  // {
  //   title: "Scene Settings",
  //   content: <SceneSettings />
  // },
  {
    title: "Components",
    content: <><SceneTree /></>
  },

]
const SideMenu = () => {
  const { models } = useModelsStorage()
  return (
    models.length > 0 && <>
      <SideItemMenu menuContents={menuContents} placement='top-left' height={'96vh'} width={200} />
    </>

  )
}

export default SideMenu