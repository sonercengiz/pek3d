// src/components/r3f-components/SmoothSyncCamera.jsx
import React, { useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useCameraStorage } from '@wi3n/core'

export default function SmoothSyncCamera({ duration = 0.8 }) {
  // Store’daki hedef değerler
  const [tx, ty, tz] = useCameraStorage(s => s.cameraPosition)
  const [lx, ly, lz] = useCameraStorage(s => s.cameraTarget)
  const tzm = useCameraStorage(s => s.cameraZoom)

  const camera = useThree(state => state.camera)
  const controls = useThree(state => state.controls)

  // Animasyon durumunu saklayacağımız obje
  const anim = useRef({
    // başlangıç ve hedefler
    startPos: new THREE.Vector3(),
    endPos: new THREE.Vector3(),
    startTarget: new THREE.Vector3(),
    endTarget: new THREE.Vector3(),
    startZoom: camera.zoom,
    endZoom: camera.zoom,
    t: 1
  }).current

  // Sadece gerçekten değişim olduğunda animasyonu başlat
  useEffect(() => {
    if (!controls) return

    // Eğer önceki hedef değerler ile birebir aynıysa, yeniden başlatmıyoruz
    const samePos = anim.endPos.x === tx && anim.endPos.y === ty && anim.endPos.z === tz
    const sameLook = anim.endTarget.x === lx && anim.endTarget.y === ly && anim.endTarget.z === lz
    const sameZoom = anim.endZoom === tzm
    if (samePos && sameLook && sameZoom) return

    // Başlangıç durumunu yakala
    anim.startPos.copy(camera.position)
    anim.startTarget.copy(controls.target)
    anim.startZoom = camera.zoom

    // Yeni hedefleri koy
    anim.endPos.set(tx, ty, tz)
    anim.endTarget.set(lx, ly, lz)
    anim.endZoom = tzm

    // kronometreyi sıfırla
    anim.t = 0

    // Sadece bireysel değerleri dependency olarak veriyoruz:
  }, [tx, ty, tz, lx, ly, lz, tzm, camera, controls])

  // Her frame’de aşamalı geçiş
  useFrame((_, delta) => {
    if (anim.t < 1) {
      anim.t = Math.min(1, anim.t + delta / duration)
      // ease-out fonksiyonu
      const s = anim.t * (2 - anim.t)

      // pozisyon, zoom ve kontrol hedefini yumuşakça geçir
      camera.position.lerpVectors(anim.startPos, anim.endPos, s)
      camera.zoom = THREE.MathUtils.lerp(anim.startZoom, anim.endZoom, s)
      camera.updateProjectionMatrix()

      controls.target.lerpVectors(anim.startTarget, anim.endTarget, s)
      controls.update()
    }
  })

  return null
}
