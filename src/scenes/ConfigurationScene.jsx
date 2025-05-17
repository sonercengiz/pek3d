// src/ConfigurationScene.jsx
import React from 'react'
import { Canvas } from '@react-three/fiber'
import {
  GizmoHelper,
  GizmoViewport,
  OrbitControls,
  PerspectiveCamera
} from '@react-three/drei'
import { GridWithLabels, useModelsStorage } from '@wi3n/core'
import { useCameraStorage, useControlsStorage, useEnvironmentStorage, useHistoryStorage, useSelectionStorage } from '@wi3n/core'
import SmoothSyncCamera from '../components/r3f-components/SmoothSyncCamera'
import { SceneManager } from '../components/r3f-components/SceneManager'
import Model from '../components/r3f-components/model/Model'
import SelectionHandler from '../components/r3f-components/SelectionHandler'
import SelectedHighlighter from '../components/r3f-components/SelectedHighlighter'
import SelectedBoxHelper from '../components/r3f-components/SelectedBoxHelper'

export default function ConfigurationScene({ children }) {
  // initial camera
  const camPos = useCameraStorage(s => s.cameraPosition)
  const camTar = useCameraStorage(s => s.cameraTarget)
  const camZ = useCameraStorage(s => s.cameraZoom)
  const clearSel = useSelectionStorage(s => s.clearSelection)

  // controls settings
  const enablePan = useControlsStorage(s => s.enablePan)
  const enableRotate = useControlsStorage(s => s.enableRotate)
  const enableZoom = useControlsStorage(s => s.enableZoom)
  const rotateSpeed = useControlsStorage(s => s.rotateSpeed)
  const zoomSpeed = useControlsStorage(s => s.zoomSpeed)
  const damping = useControlsStorage(s => s.dampingFactor)

  // env
  const bgColor = useEnvironmentStorage(s => s.backgroundColor)
  const fogOn = useEnvironmentStorage(s => s.fog.enabled)
  const fogColor = useEnvironmentStorage(s => s.fog.color)
  const fogNear = useEnvironmentStorage(s => s.fog.near)
  const fogFar = useEnvironmentStorage(s => s.fog.far)

  // models
  const models = useModelsStorage(s => s.models)

  // history
  const undo = useHistoryStorage(s => s.undo)
  const redo = useHistoryStorage(s => s.redo)

  return (
    <Canvas>
      <color attach="background" args={[bgColor]} />
      {fogOn && <fog attach="fog" args={[fogColor, fogNear, fogFar]} />}

      <PerspectiveCamera
        makeDefault
        position={camPos}
        zoom={camZ}
        onUpdate={cam => cam.lookAt(...camTar)}
      />

      <directionalLight position={[0, 5, 5]} intensity={2} />
      <directionalLight position={[5, 5, 0]} intensity={2} />
      <directionalLight position={[-5, 5, 0]} intensity={2} />
      <directionalLight position={[0, 5, -5]} intensity={2} />

      <SceneManager focusDuration={0.8} />

      <OrbitControls
        makeDefault
        enablePan={enablePan}
        enableRotate={enableRotate}
        enableZoom={enableZoom}
        rotateSpeed={rotateSpeed}
        zoomSpeed={zoomSpeed}
        enableDamping
        dampingFactor={damping}
        target={camTar}
      />

      {/* her seçime veya reset’e smooth */}
      <SmoothSyncCamera duration={0.8} />

      <SelectionHandler />
      <SelectedHighlighter />
      <SelectedBoxHelper color={'yellow'} />


      {children}

      < GridWithLabels size={20} divisions={20} fontSize={0.3} position={[0, 0, 0]} gridColor="gray" />
      <GizmoHelper alignment="bottom-right" margin={[80, 80]}><GizmoViewport /></GizmoHelper>
    </Canvas>
  )
}
