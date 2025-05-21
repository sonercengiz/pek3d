import React, { useRef, useEffect, useMemo, useCallback } from 'react'
import { useThree } from '@react-three/fiber'
import { TransformControls } from '@react-three/drei'
import { useModelsStorage } from 'wi3n-core'
import throttle from 'lodash/throttle'
import { useSettingsStorage } from '../../storage/SceneStorage'

// Utility to round numbers to desired precision
const round = (num, decimals = 2) => parseFloat(num.toFixed(decimals))

export default function TransformEditor({ mode = 'translate' }) {
  const { scene, controls } = useThree()
  const transformRef = useRef()
  const selectedId = useModelsStorage(s => s.selectedId)
  const models = useModelsStorage(s => s.models)
  const updateTransform = useModelsStorage(s => s.updateModelTransform)
  const { transformEditorType } = useSettingsStorage()

  // Get the selected object from the scene
  const selectedObject = useMemo(() => (
    selectedId != null ? scene.getObjectByName(selectedId) : null
  ), [scene, selectedId, models])

  // Throttle updates to the store for performance, with rounding
  const throttledUpdate = useCallback(
    throttle((obj) => {
      updateTransform(selectedId, {
        position: [
          round(obj.position.x, 2),
          round(obj.position.y, 2),
          round(obj.position.z, 2)
        ],
        rotation: [
          round(obj.rotation.x, 3),
          round(obj.rotation.y, 3),
          round(obj.rotation.z, 3)
        ],
        scale: [
          round(obj.scale.x, 2),
          round(obj.scale.y, 2),
          round(obj.scale.z, 2)
        ],
      })
    }, 100),
    [selectedId, updateTransform]
  )

  // Attach/detach and event listeners
  useEffect(() => {
    const tc = transformRef.current
    if (!tc) return

    if (selectedObject) {
      tc.attach(selectedObject)
    } else {
      tc.detach()
    }

    const onObjectChange = () => {
      const obj = tc.object
      if (obj && selectedId != null) {
        throttledUpdate(obj)
      }
    }
    const onDraggingChanged = ({ value }) => {
      controls.enabled = !value
      // On drag end, ensure final rounded update
      if (!value && transformRef.current?.object && selectedId != null) {
        const o = transformRef.current.object
        updateTransform(selectedId, {
          position: [
            round(o.position.x, 2),
            round(o.position.y, 2),
            round(o.position.z, 2)
          ],
          rotation: [
            round(o.rotation.x, 3),
            round(o.rotation.y, 3),
            round(o.rotation.z, 3)
          ],
          scale: [
            round(o.scale.x, 2),
            round(o.scale.y, 2),
            round(o.scale.z, 2)
          ],
        })
      }
    }

    tc.addEventListener('objectChange', onObjectChange)
    tc.addEventListener('dragging-changed', onDraggingChanged)

    return () => {
      tc.removeEventListener('objectChange', onObjectChange)
      tc.removeEventListener('dragging-changed', onDraggingChanged)
      tc.detach()
      throttledUpdate.cancel()
    }
  }, [selectedObject, selectedId, controls, throttledUpdate, updateTransform])

  if (!selectedObject) return null

  return (
    <TransformControls
      ref={transformRef}
      mode={mode}
      translationSnap={0.005}
      rotationSnap={Math.PI / 180 * 5}
      scaleSnap={0.05}
    />
  )
}
