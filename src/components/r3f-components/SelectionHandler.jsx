// src/components/r3f-components/SelectionHandler.jsx
import { useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useModelsStorage } from '@wi3n/core'

export default function SelectionHandler({ clearOnEmpty = true }) {
  const select = useModelsStorage(s => s.select)
  const clearSelection = useModelsStorage(s => s.clearSelection)
  const { gl, scene, camera } = useThree()
  const raycaster = useRef(new THREE.Raycaster())
  // fare basma pozisyonunu saklayacağız
  const downPos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = gl.domElement

    // 1) Mousedown'da pozisyonu al (sadece sol tuş)
    const handleMouseDown = (event) => {
      if (event.button !== 0) return
      downPos.current = { x: event.clientX, y: event.clientY }
    }

    // 2) Mouseup'da aradaki mesafe < eşik ise gerçekten click say
    const handleMouseUp = (event) => {
      if (event.button !== 0) return
      const dx = event.clientX - downPos.current.x
      const dy = event.clientY - downPos.current.y
      const dist2 = dx * dx + dy * dy
      if (dist2 > 5 * 5) return  // drag, not click

      // normalize coords
      const { left, top, width, height } = canvas.getBoundingClientRect()
      const x = ((event.clientX - left) / width) * 2 - 1
      const y = -((event.clientY - top) / height) * 2 + 1

      // raycast all scene children
      raycaster.current.setFromCamera({ x, y }, camera)
      const hits = raycaster.current.intersectObjects(scene.children, true)

      // pick first model‐root hit
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
        return
      }

      // otherwise clear
      if (clearOnEmpty) clearSelection()
    }


    canvas.addEventListener('mousedown', handleMouseDown)
    canvas.addEventListener('mouseup', handleMouseUp)
    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown)
      canvas.removeEventListener('mouseup', handleMouseUp)
    }
  }, [gl.domElement, camera, scene, select, clearSelection, clearOnEmpty])

  return null
}
