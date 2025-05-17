// src/components/r3f-components/SmoothSyncCamera.jsx
import React, { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useCameraStorage } from '@wi3n/core'

export default function SmoothSyncCamera({ duration = 0.8 }) {
  const targetPos = useCameraStorage(s => s.cameraPosition)
  const targetLo = useCameraStorage(s => s.cameraTarget)
  const targetZ = useCameraStorage(s => s.cameraZoom)
  const camera = useThree(state => state.camera)
  const controls = useThree(state => state.controls)

  const a = useRef({
    startPos: new THREE.Vector3(),
    startTarget: new THREE.Vector3(),
    startZoom: camera.zoom,
    endPos: new THREE.Vector3(),
    endTarget: new THREE.Vector3(),
    endZoom: camera.zoom,
    t: 1
  }).current

  useEffect(() => {
    if (!controls) return
    a.startPos.copy(camera.position)
    a.startTarget.copy(controls.target)
    a.startZoom = camera.zoom
    a.endPos.set(...targetPos)
    a.endTarget.set(...targetLo)
    a.endZoom = targetZ
    a.t = 0
  }, [targetPos, targetLo, targetZ, camera, controls])

  useFrame((_, delta) => {
    if (a.t < 1) {
      a.t = Math.min(1, a.t + delta / duration)
      const s = a.t * (2 - a.t)
      camera.position.lerpVectors(a.startPos, a.endPos, s)
      camera.zoom = THREE.MathUtils.lerp(a.startZoom, a.endZoom, s)
      camera.updateProjectionMatrix()
      controls.target.lerpVectors(a.startTarget, a.endTarget, s)
      controls.update()
    }
  })

  return null
}
