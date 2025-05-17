// src/components/r3f-components/SelectedHighlighter.jsx
import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { useSelectionStorage } from '@wi3n/core'

export default function SelectedHighlighter({ color = 0xffff00 }) {
  const selectedId = useSelectionStorage(s => s.selectedId)
  const { scene } = useThree()

  useEffect(() => {
    // helper: tıklanan mesh’in ait olduğu root group’u bul
    function findRoot(obj) {
      let o = obj
      while (o && !o.name) o = o.parent
      return o
    }

    // Sahnedeki tüm Mesh’leri wireframe toggler
    scene.traverse(obj => {
      if (obj.isMesh) {
        const root = findRoot(obj)
        const isSel = root && root.name === selectedId
        // wireframe
        if (obj.material) {
          obj.material.wireframe = isSel
          // veya kaplamayı değiştir:
          // obj.material.opacity = isSel ? 0.5 : 1
          // obj.material.transparent = isSel
          obj.material.needsUpdate = true
        }
      }
    })
  }, [selectedId, scene])

  return null
}
