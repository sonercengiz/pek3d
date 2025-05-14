import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

const RestrictedControls = ({
  height = 10,
  distance = 20,
  fov = 50,
  rotateSpeed = 0.5,
  zoomSpeed = 1,
  dampingFactor = 0.1,
}) => {
  const cameraRef = useRef()
  const controlsRef = useRef()

  // Başlangıçta pozisyon, FOV ve hedefi ayarlayıp güncelle
  useEffect(() => {
    const cam = cameraRef.current
    const ctrl = controlsRef.current
    if (!cam || !ctrl) return

    // Kamera pozisyonu ve görüş açısı
    cam.position.set(0, height, distance)
    cam.fov = fov
    cam.updateProjectionMatrix()

    // Hedefi (0,0,0) olarak belirle
    ctrl.target.set(0, 0, 0)
    ctrl.update()
  }, [height, distance, fov])

  return (
    <>
      {/* Bu kamera artık Canvas’ın default kamerası */}
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        near={0.1}
        far={1000}
      />

      {/* 
        mouseButtons prop’u sayesinde sol+tık=pan, sağ+tık=rotate, 
        orta tekerlek=zoom atanıyor. 
        Tilt sabit 45°: minPolarAngle ve maxPolarAngle = π/4 
      */}
      <OrbitControls
        ref={controlsRef}
        enablePan
        enableRotate
        enableZoom

        // Hareket hız ayarları
        rotateSpeed={rotateSpeed}
        zoomSpeed={zoomSpeed}

        // Tilt’i 45° sabitle
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 4}

        // XZ düzleminde kaydırma
        screenSpacePanning={false}

        // Mouse tuş atamaları
        mouseButtons={{
          LEFT: THREE.MOUSE.PAN,    // Mouse1 → pan
          MIDDLE: THREE.MOUSE.DOLLY,  // Mouse3 → zoom
          RIGHT: THREE.MOUSE.ROTATE, // Mouse2 → rotate
        }}

        // Yumuşak kontroller
        enableDamping
        dampingFactor={dampingFactor}
      />
    </>
  )
}

export default RestrictedControls