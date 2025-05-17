// src/components/r3f-components/Model.jsx
import React, { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { useModelsStorage } from '@wi3n/core'

export default function Model({ id, path, ...props }) {
  const { scene } = useGLTF(path)
  const select = useModelsStorage(s => s.select)
  const selectedId = useModelsStorage(s => s.selectedId)

  // bir kez clone et ve ismini ata
  const cloned = useMemo(() => {
    const c = scene.clone(true)
    c.name = id
    return c
  }, [scene, id])

  // seçili ise emissive ile highlight et
  useMemo(() => {
    cloned.traverse(o => {
      if (o.isMesh) {
        o.material = o.material.clone()
        o.material.emissive = new THREE.Color(
          id === selectedId ? 0x2244ff : 0x000000
        )
        o.material.emissiveIntensity = id === selectedId ? 0.5 : 0
      }
    })
  }, [cloned, id, selectedId])

  return (
    <primitive
      object={cloned}
      {...props}
      onClick={e => {
        e.stopPropagation()
        select(id)
      }}
      onPointerOver={e => (document.body.style.cursor = 'pointer')}
      onPointerOut={e => (document.body.style.cursor = 'auto')}
    />
  )
}
