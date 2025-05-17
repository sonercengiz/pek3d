// src/components/r3f-components/SelectionHandler.jsx
import { useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useSelectionStorage } from '@wi3n/core'

export default function SelectionHandler() {
  const select = useSelectionStorage(s => s.select)
  const clear = useSelectionStorage(s => s.clearSelection)
  const { gl, scene, camera } = useThree()
  const raycaster = useRef(new THREE.Raycaster())

  useEffect(() => {
    const handleClick = (event) => {
      // normalize mouse coords to [-1,1]
      const rect = gl.domElement.getBoundingClientRect()
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1

      raycaster.current.setFromCamera({ x, y }, camera)
      const intersects = raycaster.current.intersectObjects(scene.children, true)

      if (intersects.length > 0) {
        // ilk intersect edilen mesh
        let obj = intersects[0].object
        // root group'u bul (name atadığımız m.id burada)
        while (obj && !obj.name) obj = obj.parent
        if (obj && obj.name) {
          select(obj.name)
          return
        }
      }
      // sahnenin boş bir yerine tıklanmışsa seçimi temizle
      clear()
    }

    gl.domElement.addEventListener('pointerdown', handleClick)
    return () => {
      gl.domElement.removeEventListener('pointerdown', handleClick)
    }
  }, [gl, scene, camera, select, clear])

  return null
}
