// src/components/r3f-components/SceneManager.jsx
import React, { useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as THREE from 'three'
import { useModelsStorage } from '@wi3n/core'

export function SceneManager({ focusDuration = 1 }) {
  const { models, updateModelChildren, selectedId } = useModelsStorage()
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
      if (added.current.has(m.instanceId)) return
      added.current.add(m.instanceId)
      loader.load(m.path, gltf => {
        const root = gltf.scene.clone(true)
        root.name = m.instanceId
        // *** burası önemli ***
        root.userData = {
          isModelRoot: true,
          modelId: m.id,
          instanceId: m.instanceId,
          modelName: m.name,
        }

        scene.add(root)
        // eğer halihazırda seçili ise focus da hazırla
        const ch = root.children?.map(c => ({ id: c.uuid, name: c.name || c.type }))
        updateModelChildren(m.instanceId, ch)
        if (useModelsStorage.getState().selectedId === m.instanceId) {
          startFocus(root)
        }
      })
    })
    console.log(1);
  }, [models, scene])

  // selectedId değiştiğinde focus başlat
  useEffect(() => {
    if (!selectedId) return
    const obj = scene.getObjectByName(selectedId)
    if (obj) startFocus(obj)
  }, [selectedId, scene])

  function startFocus(obj) {
    // 1) Model’in bounding sphere’ünü al
    const box = new THREE.Box3().setFromObject(obj)
    const sph = box.getBoundingSphere(new THREE.Sphere())

    // 2) Mevcut kamera/hedef pozisyonunu sakla
    anim.startPos.copy(camera.position)
    anim.startTarget.copy(controls.target)

    // 3) Yeni hedef noktayı model merkezine kaydır
    anim.endTarget.copy(sph.center)

    // 4) Kameranın mevcut baktığı yönden birim vektör al
    const currentDir = new THREE.Vector3()
      .subVectors(camera.position, controls.target)
      .normalize()

    // 5) Gerekli mesafeyi hesapla
    const fov = THREE.MathUtils.degToRad(camera.fov)
    const distance = sph.radius / Math.sin(fov / 2) * 1.2

    // 6) Son kamera pozisyonunu, model merkezinden bu yönde uzaklaştırarak ayarla
    anim.endPos
      .copy(sph.center)
      .add(currentDir.multiplyScalar(distance))

    // 7) Animasyon kronometresini başa sar
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
