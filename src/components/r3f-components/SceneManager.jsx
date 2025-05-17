// src/components/r3f-components/SceneManager.jsx
import React, { useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as THREE from 'three'
import { useModelsStorage, useSelectionStorage } from '@wi3n/core'

export function SceneManager({ focusDuration = 1 }) {
  const { models, updateModelChildren } = useModelsStorage()
  const selectedId = useSelectionStorage(s => s.selectedId)
  const { scene, camera } = useThree()
  const controls = useThree(state => state.controls)

  const added = useRef(new Set())
  const anim = useRef({
    startPos: new THREE.Vector3(),
    startTarget: new THREE.Vector3(),
    endPos: new THREE.Vector3(),
    endTarget: new THREE.Vector3(),
    t: 1
  }).current

  // imperatif model ekleme
  useEffect(() => {
    const loader = new GLTFLoader()
    models.forEach(m => {
      if (added.current.has(m.id)) return
      added.current.add(m.id)
      loader.load(m.path, gltf => {
        const root = gltf.scene.clone(true)
        root.name = m.id.toString()
        // *** burası önemli ***
        root.userData.isModelRoot = true
        root.userData.modelId = m.id

        scene.add(root)
        // eğer halihazırda seçili ise focus da hazırla
        const ch = root.children?.map(c => ({ id: c.uuid, name: c.name || c.type }))
        updateModelChildren(m.id, ch)
        if (useSelectionStorage.getState().selectedId === m.id) {
          startFocus(root)
        }
      })
    })
    console.log('models', models)
  }, [models, scene])

  // selectedId değiştiğinde focus başlat
  useEffect(() => {
    if (!selectedId) return
    const obj = scene.getObjectByName(selectedId)
    if (obj) startFocus(obj)
  }, [selectedId, scene])

  function startFocus(obj) {
    const box = new THREE.Box3().setFromObject(obj)
    const sph = box.getBoundingSphere(new THREE.Sphere())
    anim.startPos.copy(camera.position)
    anim.startTarget.copy(controls.target)
    anim.endTarget.copy(sph.center)
    const fov = THREE.MathUtils.degToRad(camera.fov)
    const dist = sph.radius / Math.sin(fov / 2) * 1.2
    anim.endPos.set(sph.center.x, sph.center.y, sph.center.z + dist)
    anim.t = 0
  }

  // frame’de interpolate
  useFrame((_, delta) => {
    if (anim.t < 1) {
      anim.t = Math.min(1, anim.t + delta / focusDuration)
      const s = anim.t * (2 - anim.t)
      camera.position.lerpVectors(anim.startPos, anim.endPos, s)
      controls.target.lerpVectors(anim.startTarget, anim.endTarget, s)
      camera.lookAt(controls.target)
      camera.updateProjectionMatrix()
      controls.update()
    }
  })

  return null
}
