// src/components/r3f-components/TransformEditor.jsx
import React, { useRef, useEffect, useMemo } from 'react'
import { useThree } from '@react-three/fiber'
import { TransformControls } from '@react-three/drei'
import { useModelsStorage } from '@wi3n/core'

export default function TransformEditor({ mode = 'translate' }) {
  const { scene, controls } = useThree()
  const transformRef = useRef()
  const selectedId = useModelsStorage(s => s.selectedId)
  const models = useModelsStorage(s => s.models)
  const updateTransform = useModelsStorage(s => s.updateModelTransform)

  // Seçili objeyi sahneden al
  const selectedObject = useMemo(() => {
    return selectedId != null
      ? scene.getObjectByName(selectedId)
      : null
  }, [scene, selectedId, models])

  // Attach/detach ve objectChange listener’ını tek useEffect’te yönetin
  useEffect(() => {
    const tc = transformRef.current
    if (!tc) return

    // 1) Attach veya detach
    if (selectedObject) {
      tc.attach(selectedObject)
    } else {
      tc.detach()
    }

    // 2) Transform değiştiğinde state’i güncelle
    const handleObjectChange = () => {
      const obj = tc.object
      if (!selectedId || !obj) return
      updateTransform(selectedId, {
        position: [obj.position.x, obj.position.y, obj.position.z],
        rotation: [obj.rotation.x, obj.rotation.y, obj.rotation.z],
        scale: [obj.scale.x, obj.scale.y, obj.scale.z],
      })
    }
    tc.addEventListener('objectChange', handleObjectChange)

    return () => {
      tc.removeEventListener('objectChange', handleObjectChange)
      if (!selectedObject) {
        tc.detach()
      }
    }
  }, [selectedObject, selectedId, updateTransform])

  // Drag sırasında OrbitControls’u devre dışı bırak
  useEffect(() => {
    const tc = transformRef.current
    if (!tc || !controls) return

    const handleDragging = ({ value }) => {
      controls.enabled = !value
    }
    tc.addEventListener('dragging-changed', handleDragging)
    return () => {
      tc.removeEventListener('dragging-changed', handleDragging)
    }
  }, [controls])

  if (!selectedObject) return null

  return (
    <TransformControls
      ref={transformRef}
      mode={mode}
      translationSnap={0.1}
      rotationSnap={Math.PI / 180 * 5}
      scaleSnap={0.1}
    />
  )
}
