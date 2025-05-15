import React from 'react'
import { Canvas } from '@react-three/fiber'
import { GizmoHelper, GizmoViewport, OrbitControls, PerspectiveCamera, Stats } from '@react-three/drei'
import { GridWithLabels } from '@wi3n/core'

// Zustand stores
import { useCameraStorage } from '@wi3n/core'
import { useControlsStorage } from '@wi3n/core'
import { useEnvironmentStorage } from '@wi3n/core'
import { useModelsStorage } from '@wi3n/core'
import { useSelectionStorage } from '@wi3n/core'
import { useHistoryStorage } from '@wi3n/core'

/**
 * ConfigurationScene
 * - Tüm sahne ayarlarını ayrı selector hook’larıyla alır (infinite loop önlemek için).
 * - children ile ekstra sahne elemanları eklenebilir.
 */
export default function ConfigurationScene({ children }) {
  // Kamera ayarları
  const cameraPosition = useCameraStorage((s) => s.cameraPosition)
  const cameraTarget = useCameraStorage((s) => s.cameraTarget)
  const cameraZoom = useCameraStorage((s) => s.cameraZoom)

  // Kontroller (nesne referansı döndürmeyen primitive değerler)
  const enablePan = useControlsStorage((s) => s.enablePan)
  const enableRotate = useControlsStorage((s) => s.enableRotate)
  const enableZoom = useControlsStorage((s) => s.enableZoom)
  const rotateSpeed = useControlsStorage((s) => s.rotateSpeed)
  const zoomSpeed = useControlsStorage((s) => s.zoomSpeed)
  const dampingFactor = useControlsStorage((s) => s.dampingFactor)

  // Environment (primitive değerler veya sabit referanslar)
  const backgroundColor = useEnvironmentStorage((s) => s.backgroundColor)
  const fogEnabled = useEnvironmentStorage((s) => s.fog.enabled)
  const fogColor = useEnvironmentStorage((s) => s.fog.color)
  const fogNear = useEnvironmentStorage((s) => s.fog.near)
  const fogFar = useEnvironmentStorage((s) => s.fog.far)

  // Modeller ve seçim
  const models = useModelsStorage((s) => s.models)
  const selectedId = useSelectionStorage((s) => s.selectedId)

  // History (undo/redo)
  const undo = useHistoryStorage((s) => s.undo)
  const redo = useHistoryStorage((s) => s.redo)

  return (
    <Canvas>
      {/* fps */}
      {/* <Stats /> */}


      {/* Environment */}
      <color attach="background" args={[backgroundColor]} />
      {fogEnabled && <fog attach="fog" args={[fogColor, fogNear, fogFar]} />}


      {/* Kamera */}
      <PerspectiveCamera
        makeDefault
        position={cameraPosition}
        zoom={cameraZoom}
        onUpdate={(cam) => cam.lookAt(...cameraTarget)}
      />


      {/* light */}
      <directionalLight position={[0, 5, 5]} intensity={2} castShadow={false} />
      <directionalLight position={[5, 5, 0]} intensity={2} castShadow={false} />
      <directionalLight position={[-5, 5, 0]} intensity={2} castShadow={false} />
      <directionalLight position={[0, 5, -5]} intensity={2} castShadow={false} />


      {/* Modeller */}
      {models.map((model) => (
        <primitive
          key={model.id}
          object={model.object}
          position={model.position}
          scale={model.id === selectedId ? [1.1, 1.1, 1.1] : [1, 1, 1]}
        />
      ))}


      {/* children: ekstra objeler */}
      {children}


      {/* Izgara */}
      <GridWithLabels size={20} divisions={20} fontSize={0.3} position={[0, 0, 0]} gridColor='gray' />



      {/* Kontroller */}
      <OrbitControls
        makeDefault
        enablePan={enablePan}
        enableRotate={enableRotate}
        enableZoom={enableZoom}
        rotateSpeed={rotateSpeed}
        zoomSpeed={zoomSpeed}
        enableDamping
        dampingFactor={dampingFactor}
        target={cameraTarget}
      />


      {/* Gizmo */}
      <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
        <GizmoViewport />
      </GizmoHelper>

      {/* <TestModel position={[0, 10, 0]} /> */}
      {/* <TestModel2 /> */}


    </Canvas>
  )
}
