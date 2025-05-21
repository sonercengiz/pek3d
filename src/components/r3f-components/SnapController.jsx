// src/components/r3f-components/SnapController.jsx
import React, { useState, useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useModelsStorage } from 'wi3n-core'
import { useSettingsStorage } from '../../storage/SceneStorage'

// SnapController: handles snap logic by listening on the canvas domElement
export default function SnapController() {
  const { scene, camera, gl } = useThree()
  const raycaster = useRef(new THREE.Raycaster())
  const mouse = useRef(new THREE.Vector2())

  const { updateModelTransform, select } = useModelsStorage()
  const { mode } = useSettingsStorage()

  const [source, setSource] = useState(null)
  const [target, setTarget] = useState(null)

  // on click, perform raycast to pick a snap point mesh
  const handleClick = (event) => {
    if (mode !== 'snap') return
    event.stopPropagation()
    const rect = gl.domElement.getBoundingClientRect()
    mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

    raycaster.current.setFromCamera(mouse.current, camera)
    const hits = raycaster.current.intersectObjects(scene.children, true)
    const hit = hits.find(h => h.object.userData?.snapPoint)
    if (!hit) return

    // for SnapPoints, snapPoint is already world position array
    const worldArr = hit.object.userData.snapPoint
    const worldPos = new THREE.Vector3(...worldArr)
    const instanceId = hit.object.userData.instanceId

    // first click = source, second = target
    if (!source) {
      setSource({ instanceId, worldPos })
      select(instanceId)
    } else if (!target) {
      setTarget({ worldPos })
    }
  }

  // align when both set
  useEffect(() => {
    if (source && target) {
      const delta = new THREE.Vector3().subVectors(target.worldPos, source.worldPos)
      const obj = scene.getObjectByName(source.instanceId)
      if (obj) {
        const newPos = obj.position.clone().add(delta)
        updateModelTransform(source.instanceId, {
          position: [newPos.x, newPos.y, newPos.z]
        })
      }
      setSource(null)
      setTarget(null)
    }
  }, [source, target, scene, updateModelTransform])

  // attach to canvas, not window
  useEffect(() => {
    const canvas = gl.domElement
    canvas.addEventListener('pointerdown', handleClick)
    return () => canvas.removeEventListener('pointerdown', handleClick)
  }, [mode, source, target])

  return null
}
