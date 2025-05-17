// src/PreviewModel.tsx
import React, { useRef, useContext, useEffect, CSSProperties } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { PreviewModelContext } from './PreviewModelProvider'

export interface PreviewModelProps {
  modelPath: string
  scale?: [number, number, number]
  position?: [number, number, number]
  width?: number | string
  height?: number | string
  style?: CSSProperties
}

export const PreviewModel: React.FC<PreviewModelProps> = ({
  modelPath,
  scale = [1, 1, 1],
  position = [0, 0, 0],
  width = 200,
  height = 200,
  style = {}
}) => {
  const elRef = useRef<HTMLDivElement>(null)
  const { register, unregister } = useContext(PreviewModelContext)
  const idRef = useRef<number | null>(null)

  useEffect(() => {
    const el = elRef.current
    if (!el) return

    idRef.current = register(el, (scene, camera, controls) => {
      const loader = new GLTFLoader()
      loader.load(
        modelPath,
        gltf => {
          const root = gltf.scene || gltf.scenes[0]

          // ——> AUTOFIT: scale & center
          const bbox = new THREE.Box3().setFromObject(root)
          const size = bbox.getSize(new THREE.Vector3())
          const maxDim = Math.max(size.x, size.y, size.z)
          const target = 2
          const sF = target / maxDim
          root.scale.set(sF, sF, sF)

          bbox.setFromObject(root)
          const center = bbox.getCenter(new THREE.Vector3())
          root.position.sub(center)

          // sahneye ekle & group’u sakla
          scene.add(root)
          scene.userData.modelRoot = root

          // ——> CAMERA FIT
          const sphere = bbox.getBoundingSphere(new THREE.Sphere())
          const fovRad = THREE.MathUtils.degToRad(camera.fov)
          const dist = (sphere.radius / Math.sin(fovRad / 2)) * 1.2
          camera.position.set(0, 0, dist)
          camera.lookAt(0, 0, 0)
          camera.updateProjectionMatrix()

          controls.target.set(0, 0, 0)
          controls.update()
        },
        undefined,
        err => console.error('GLTF load error:', err)
      )
    })

    return () => {
      if (idRef.current !== null) unregister(idRef.current)
    }
  }, [register, unregister, modelPath])

  return (
    <div
      ref={elRef}
      style={{
        width,
        height,
        background: 'transparent',
        ...style
      }}
    />
  )
}
