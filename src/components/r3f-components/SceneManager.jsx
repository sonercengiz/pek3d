// src/components/r3f-components/SceneManager.jsx
import React, { useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as THREE from 'three'
import { useModelsStorage } from 'wi3n-core'

export function SceneManager({ focusDuration = 1 }) {
  const { models, updateModelChildren, selectedId, updateModelTransform } = useModelsStorage()
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

  // 1) İlk yükleme: modelleri imperatif ekle
  useEffect(() => {
    const loader = new GLTFLoader()
    models.forEach(m => {
      if (added.current.has(m.instanceId)) return
      added.current.add(m.instanceId)

      loader.load(m.path, gltf => {
        const root = gltf.scene.clone(true)
        root.name = m.instanceId

        // temel materyaller
        // root.traverse(obj => {
        //   if (obj.isMesh) {
        //     obj.material = new THREE.MeshStandardMaterial({
        //       color: 'Darkgray',
        //       metalness: 0,
        //       roughness: 0.8
        //     })
        //     obj.castShadow = true
        //     obj.receiveShadow = false
        //   }
        // })

        // işaretle
        root.userData = {
          isModelRoot: true,
          modelId: m.id,
          instanceId: m.instanceId,
          modelName: m.name
        }

        // --- collisionCount’u state’ten oku ---
        const { models: currentModels } = useModelsStorage.getState()
        const [origX, , origZ] = m.position
        const EPS = 1e-3
        const collisionCount = currentModels.filter(m2 =>
          Math.abs(m2.position[0] - origX) < EPS &&
          Math.abs(m2.position[2] - origZ) < EPS
        ).length

        // offset adımı
        const step = 1
        const newX = origX + (collisionCount - 1) * step  // collisionCount-1: kendisi hariç
        const newY = 0
        const newZ = origZ

        // state’i güncelle
        updateModelTransform(m.instanceId, {
          position: [newX, newY, newZ]
        })

        // sahneye uygula
        root.position.set(newX, newY, newZ)
        root.rotation.set(...m.rotation)
        root.scale.set(...m.scale)

        scene.add(root)

        // children list update
        const ch = root.children.map(c => ({ id: c.uuid, name: c.name || c.type }))
        updateModelChildren(m.instanceId, ch)



        // eğer zaten seçili ise odakla
        if (selectedId === m.instanceId) startFocus(root)
      })
    })
  }, [models, scene, selectedId, updateModelChildren])

  // 2) Store’da transformlar değişince sahneyi güncelle
  useEffect(() => {
    models.forEach(m => {
      // sahnede bu instanceId ile group var mı?
      const obj = scene.getObjectByName(m.instanceId)
      if (obj) {
        obj.position.set(...m.position)
        obj.rotation.set(...m.rotation)
        obj.scale.set(...m.scale)
      }
    })
  }, [models, scene])

  // 3) Seçim değişince focus
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

    const currentDir = new THREE.Vector3()
      .subVectors(camera.position, controls.target)
      .normalize()

    const fov = THREE.MathUtils.degToRad(camera.fov)
    const distance = sph.radius / Math.sin(fov / 2) * 1.2

    anim.endPos
      .copy(sph.center)
      .add(currentDir.multiplyScalar(distance))

    anim.t = 0
  }

  // 4) Yumuşak kamera animasyonu
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
