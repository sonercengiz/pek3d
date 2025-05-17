// src/components/r3f-components/SelectedHighlighter.jsx
import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { useModelsStorage } from '@wi3n/core'

export default function SelectedHighlighter() {
  const { selectedId, models } = useModelsStorage()
  const { scene } = useThree()

  useEffect(() => {
    // Sahnedeki tüm model köklerini al
    const roots = []
    scene.traverse(obj => {
      if (obj.userData?.instanceId) {
        roots.push(obj)
      }
    })

    // 1) Önce her şeyin wireframe’ini kapat
    roots.forEach(root => {
      root.traverse(o => {
        if (o.isMesh && o.material) {
          o.material.wireframe = false
          // ihtiyaca göre temizle
          o.material.needsUpdate = true
        }
      })
    })

    // 2) Seçili bir obje varsa, diğerlerinin wireframe’ini aç
    if (selectedId != null) {
      roots
        .filter(root => root.userData.instanceId !== selectedId)
        .forEach(root => {
          root.traverse(o => {
            if (o.isMesh && o.material) {
              o.material.wireframe = true
              // çizgi özellikleri isteğe bağlı:
              o.material.wireframeLinewidth = 3
              o.material.needsUpdate = true
            }
          })
        })
    }
  }, [models, selectedId, scene])

  return null
}
