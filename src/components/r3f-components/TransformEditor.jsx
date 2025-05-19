import React, { useRef, useEffect, useMemo, useCallback } from 'react'
import { useThree } from '@react-three/fiber'
import { TransformControls } from '@react-three/drei'
import { useModelsStorage } from '@wi3n/core'
import { throttle } from 'lodash'

export default function TransformEditor({ mode = 'translate' }) {
  const { scene, controls } = useThree()
  const transformRef = useRef()
  const selectedId = useModelsStorage(s => s.selectedId)
  const models = useModelsStorage(s => s.models)
  const updateTransform = useModelsStorage(s => s.updateModelTransform)

  // Seçili obje referansı
  const selectedObject = useMemo(() => {
    return selectedId != null
      ? scene.getObjectByName(selectedId)
      : null
  }, [scene, selectedId, models])

  // Tek seferlik attach/detach
  useEffect(() => {
    const tc = transformRef.current
    if (!tc) return

    if (selectedObject) tc.attach(selectedObject)
    else tc.detach()

    return () => {
      if (tc) tc.detach()
    }
  }, [selectedObject])

  // Sürükleme değişimini dinle: drag başladığında OrbitControls’u kapat, bittiğinde store’a tek güncelleme
  useEffect(() => {
    const tc = transformRef.current
    if (!tc || !controls) return

    const onDraggingChanged = ({ value }) => {
      controls.enabled = !value

      // sürükleme bittiğinde bir kere güncelle
      if (!value && tc.object && selectedId) {
        const o = tc.object
        updateTransform(selectedId, {
          position: [o.position.x, o.position.y, o.position.z],
          rotation: [o.rotation.x, o.rotation.y, o.rotation.z],
          scale: [o.scale.x, o.scale.y, o.scale.z],
        })
      }
    }

    tc.addEventListener('dragging-changed', onDraggingChanged)
    return () => {
      tc.removeEventListener('dragging-changed', onDraggingChanged)
    }
  }, [controls, selectedId, updateTransform])

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
