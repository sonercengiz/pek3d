// src/components/r3f-components/SelectedBoxHelper.jsx
import React, { useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useSelectionStorage } from '@wi3n/core'

export default function SelectedBoxHelper({ color = 0xffff00 }) {
  const selectedId = useSelectionStorage(s => s.selectedId)
  const { scene } = useThree()
  const helperRef = useRef(null)

  useEffect(() => {
    // eski helper'ı temizle
    if (helperRef.current) {
      scene.remove(helperRef.current)
      helperRef.current.geometry.dispose()
      helperRef.current.material.dispose()
      helperRef.current = null
    }
    if (!selectedId) return

    // sahneden seçili objeyi bul
    const obj = scene.getObjectByName(selectedId)
    if (!obj) return

    // BoxHelper oluştur ve ekle
    const box = new THREE.BoxHelper(obj, color)
    scene.add(box)
    helperRef.current = box

    // unmount cleanup
    return () => {
      if (helperRef.current) {
        scene.remove(helperRef.current)
        helperRef.current.geometry.dispose()
        helperRef.current.material.dispose()
        helperRef.current = null
      }
    }
  }, [selectedId, scene, color])

  // her frame'de helper'ı update et (özellikle objeler hareket ediyorsa)
  useFrame(() => {
    if (helperRef.current) {
      helperRef.current.update()
    }
  })

  return null
}
