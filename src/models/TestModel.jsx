import { useGLTF } from '@react-three/drei'
import React from 'react'

const TestModel = () => {
  const { scene  } = useGLTF('/models/Yerden Hamur Besleme Sistemi.glb')
  return (
    <>
      <primitive object={scene} scale={0.001}/>
    </>
  )
}

export default TestModel