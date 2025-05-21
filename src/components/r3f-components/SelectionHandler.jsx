// src/components/r3f-components/SelectionHandler.jsx
import { useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useModelsStorage } from 'wi3n-core'
import { useSettingsStorage } from '../../storage/SceneStorage'

export default function SelectionHandler({ clearOnEmpty = true }) {
  const select = useModelsStorage(s => s.select)
  const clearSelection = useModelsStorage(s => s.clearSelection)
  const { mode } = useSettingsStorage()
  const { gl, scene, camera } = useThree()
  const raycaster = useRef(new THREE.Raycaster())
  const downPos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = gl.domElement

    const handleMouseDown = (event) => {
      if (mode === 'snap') return
      if (event.button !== 0) return
      downPos.current = { x: event.clientX, y: event.clientY }
    }

    const handleMouseUp = (event) => {
      if (mode === 'snap') return
      if (event.button !== 0) return
      const dx = event.clientX - downPos.current.x
      const dy = event.clientY - downPos.current.y
      if (dx * dx + dy * dy > 25) return  // drag, not click

      const { left, top, width, height } = canvas.getBoundingClientRect()
      const x = ((event.clientX - left) / width) * 2 - 1
      const y = -((event.clientY - top) / height) * 2 + 1

      raycaster.current.setFromCamera({ x, y }, camera)
      const hits = raycaster.current.intersectObjects(scene.children, true)

      const hit = hits.find(h => {
        let o = h.object
        while (o) {
          if (o.userData?.isModelRoot) return true
          o = o.parent
        }
        return false
      })

      if (hit) {
        let obj = hit.object
        while (obj && !obj.userData.isModelRoot) {
          obj = obj.parent
        }
        select(obj.userData.instanceId)
      } else if (clearOnEmpty) {
        clearSelection()
      }
    }

    canvas.addEventListener('mousedown', handleMouseDown)
    canvas.addEventListener('mouseup', handleMouseUp)
    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown)
      canvas.removeEventListener('mouseup', handleMouseUp)
    }
  }, [gl.domElement, camera, scene, select, clearSelection, clearOnEmpty, mode])

  return null
}