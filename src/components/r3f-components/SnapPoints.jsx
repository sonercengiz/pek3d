// src/components/r3f-components/SnapPoints.jsx
import React, { useEffect, useState } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useModelsStorage } from 'wi3n-core'
import { useSettingsStorage } from '../../storage/SceneStorage'

// SnapPoints: renders clickable spheres at model-root bounding corners and face centers for alignment
export default function SnapPoints() {
  const { scene } = useThree()
  const models = useModelsStorage(s => s.models)
  const updateModelTransform = useModelsStorage(s => s.updateModelTransform)
  const mode = useSettingsStorage(s => s.mode)

  const [points, setPoints] = useState([])
  const [source, setSource] = useState(null)
  const [target, setTarget] = useState(null)

  // Rebuild snap points when models or mode change
  useEffect(() => {
    if (mode !== 'snap') {
      setPoints([])
      return
    }
    const pts = []
    models.forEach(m => {
      const root = scene.getObjectByName(m.instanceId)
      if (!root) return
      const box = new THREE.Box3().setFromObject(root)
      const min = box.min.clone()
      const max = box.max.clone()
      const center = box.getCenter(new THREE.Vector3())

      // 8 corners (no normal)
      const corners = [
        [min.x, min.y, min.z], [min.x, min.y, max.z],
        [min.x, max.y, min.z], [min.x, max.y, max.z],
        [max.x, min.y, min.z], [max.x, min.y, max.z],
        [max.x, max.y, min.z], [max.x, max.y, max.z],
      ]
      corners.forEach((raw, idx) => {
        const pos = new THREE.Vector3(...raw)
        const dir = pos.clone().sub(center).normalize()
        const worldPos = pos.clone().add(dir.multiplyScalar(0.05))
        pts.push({ id: `${m.instanceId}-corner-${idx}`, instanceId: m.instanceId, worldPos, normal: null })
      })

      // 6 face centers with normals
      const faces = [
        { raw: [center.x, center.y, min.z], normal: [0, 0, -1], label: 'front' },
        { raw: [center.x, center.y, max.z], normal: [0, 0, 1], label: 'back' },
        { raw: [center.x, min.y, center.z], normal: [0, -1, 0], label: 'bottom' },
        { raw: [center.x, max.y, center.z], normal: [0, 1, 0], label: 'top' },
        { raw: [min.x, center.y, center.z], normal: [-1, 0, 0], label: 'left' },
        { raw: [max.x, center.y, center.z], normal: [1, 0, 0], label: 'right' },
      ]
      faces.forEach(({ raw, normal, label }) => {
        const pos = new THREE.Vector3(...raw)
        const normVec = new THREE.Vector3(...normal)
        const worldPos = pos.clone().add(normVec.clone().multiplyScalar(0.05))
        pts.push({ id: `${m.instanceId}-face-${label}`, instanceId: m.instanceId, worldPos, normal: normVec })
      })
    })
    setPoints(pts)
  }, [models, mode, scene])

  // Align on both source and target selection
  useEffect(() => {
    if (source && target) {
      const delta = target.worldPos.clone().sub(source.worldPos)
      const obj = scene.getObjectByName(source.instanceId)
      if (obj) {
        // Position align
        const newPos = obj.position.clone().add(delta)
        obj.position.copy(newPos)
        // Rotation align if normals available
        if (source.normal && target.normal) {
          // current face normal in world
          const curNorm = source.normal.clone().applyQuaternion(obj.quaternion).normalize()
          const tgtNorm = target.normal.clone().normalize()
          const q = new THREE.Quaternion().setFromUnitVectors(curNorm, tgtNorm)
          obj.quaternion.premultiply(q)
        }
        // commit to store
        const euler = new THREE.Euler().setFromQuaternion(obj.quaternion, obj.rotation.order)
        updateModelTransform(source.instanceId, {
          position: [obj.position.x, obj.position.y, obj.position.z],
          rotation: [euler.x, euler.y, euler.z]
        })
      }
      setSource(null)
      setTarget(null)
    }
  }, [source, target, scene, updateModelTransform])

  if (mode !== 'snap') return null

  const handleClick = (pt, e) => {
    e.stopPropagation()
    if (!source) setSource(pt)
    else if (!target) setTarget(pt)
  }

  return (
    <>
      {points.map(pt => {
        const isSrc = source?.id === pt.id
        const isTgt = target?.id === pt.id
        const color = isSrc ? 'green' : isTgt ? 'red' : 'yellow'
        return (
          <mesh
            key={pt.id}
            position={pt.worldPos}
            onClick={e => { e.stopPropagation(); handleClick(pt, e) }}
            userData={{ instanceId: pt.instanceId }}
          >
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial color={color} />
          </mesh>
        )
      })}
    </>
  )
}
