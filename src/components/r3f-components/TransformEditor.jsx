// src/components/r3f-components/TransformEditor.jsx
import React, { useRef, useEffect, useMemo } from 'react'
import { useThree } from '@react-three/fiber'
import { TransformControls } from '@react-three/drei'
import { useModelsStorage } from '@wi3n/core'

export default function TransformEditor({ mode = 'translate' }) {
  const { scene, controls } = useThree()     // mevcut OrbitControls
  const transformRef = useRef()
  const selectedId = useModelsStorage(s => s.selectedId)
  const models = useModelsStorage(s => s.models)
  const updateTransform = useModelsStorage(s => s.updateModelTransform)

  // Sahnedeki objeye referans
  const selectedObject = useMemo(() => {
    if (selectedId == null) return null
    return scene.getObjectByName(selectedId)
  }, [scene, selectedId, models])

  // attach/detach
  useEffect(() => {
    const tc = transformRef.current
    if (!tc) return
    if (selectedObject) tc.attach(selectedObject)
    else tc.detach()
  }, [selectedObject])

  // OrbitControls’u drag sırasında disable/enable et
  useEffect(() => {
    const tc = transformRef.current
    if (!tc || !controls) return
    const handler = (e) => { controls.enabled = !e.value }
    tc.addEventListener('dragging-changed', handler)
    return () => tc.removeEventListener('dragging-changed', handler)
  }, [controls])

  // Transform değiştiğinde store’a yolla
  useEffect(() => {
    const tc = transformRef.current
    if (!tc) return
    const onChange = () => {
      const o = tc.object
      updateTransform(selectedId, {
        position: [o.position.x, o.position.y, o.position.z],
        rotation: [o.rotation.x, o.rotation.y, o.rotation.z],
        scale: [o.scale.x, o.scale.y, o.scale.z],
      })
    }
    tc.addEventListener('objectChange', onChange)
    return () => tc.removeEventListener('objectChange', onChange)
  }, [selectedId, updateTransform])

  if (!selectedObject) return null

  return (
    <TransformControls
      ref={transformRef}
      scaleSnap={0.1}
      rotationSnap={Math.PI / 180 * 5}
      translationSnap={0.1}
      mode={mode}
    />
  )
}
