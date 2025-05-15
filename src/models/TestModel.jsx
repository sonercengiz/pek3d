import React, { useEffect, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export default function TestModel() {
  const { scene } = useGLTF('/models/mikser.glb')
  const ref = useRef()

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {

        child.material = new THREE.MeshStandardMaterial({
          color: '#525252',
          flatShading: true,
        })

        child.castShadow = true
        child.receiveShadow = true
      }
    })
  }, [scene])

  return (
    <primitive
      ref={ref}
      object={scene}
      scale={0.001}
    />
  )
}
