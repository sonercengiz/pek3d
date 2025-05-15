
import React, { useEffect, useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export default function TestModel2() {
  const { scene } = useGLTF('/models/mikser.glb')

  return (
    <primitive object={scene} scale={0.0001} />
  )
}
