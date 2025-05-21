// src/components/r3f-components/SelectedHighlighter.jsx
import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { useModelsStorage } from 'wi3n-core'
import * as THREE from 'three'

export default function SelectedHighlighter() {
  const { models, selectedId } = useModelsStorage()
  const { scene } = useThree()

  useEffect(() => {
    models.forEach(m => {
      const root = scene.getObjectByName(m.instanceId)
      if (!root) return

      root.traverse(o => {
        if (!o.isMesh || !o.material) return

        // Model bazlı wireframe gösterimi
        o.material.wireframe = !!m.showWireframe

        // Seçili model materyal rengi yeşil, diğerler koyu gri
        const baseColor = m.instanceId === selectedId ? 'lightgreen' : 'darkgray'
        o.material.color = new THREE.Color(baseColor)

        o.material.needsUpdate = true
      })
    })
  }, [models, selectedId, scene])

  return null
}