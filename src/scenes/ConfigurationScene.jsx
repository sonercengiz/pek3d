// src/ConfigurationScene.jsx
import React from 'react'
import { Canvas } from '@react-three/fiber'
import {
  GizmoHelper,
  GizmoViewport,
  MeshReflectorMaterial,
  OrbitControls,
  PerspectiveCamera,
  Stats
} from '@react-three/drei'
import { GridWithLabels, useModelsStorage } from 'wi3n-core'
import { useCameraStorage, useControlsStorage, useEnvironmentStorage, useHistoryStorage } from 'wi3n-core'
import SmoothSyncCamera from '../components/r3f-components/SmoothSyncCamera'
import { SceneManager } from '../components/r3f-components/SceneManager'
import SelectionHandler from '../components/r3f-components/SelectionHandler'
import SelectedHighlighter from '../components/r3f-components/SelectedHighlighter'
import { Floor } from 'wi3n-core'
import TransformEditor from '../components/r3f-components/TransformEditor'
import { useSettingsStorage } from '../storage/SceneStorage'
import SnapPoints from '../components/r3f-components/SnapPoints'
import SnapController from '../components/r3f-components/SnapController'

export default function ConfigurationScene({ children }) {
  // initial camera
  const camPos = useCameraStorage(s => s.cameraPosition)
  const camTar = useCameraStorage(s => s.cameraTarget)
  const camZ = useCameraStorage(s => s.cameraZoom)
  const clearSel = useModelsStorage(s => s.clearSelection)

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

  // settings
  const { mode, transformEditorType } = useSettingsStorage()

  return (
    <Canvas shadows>
      {/* <Stats /> */}
      <color attach="background" args={[bgColor]} />
      {fogOn && <fog attach="fog" args={[fogColor, fogNear, fogFar]} />}

      <PerspectiveCamera
        makeDefault
        position={camPos}
        zoom={camZ}
        onUpdate={cam => cam.lookAt(...camTar)}
      />

      <directionalLight position={[0, 5, 5]} intensity={1} color={'white'} />
      <directionalLight position={[5, 5, 0]} intensity={1} color={'white'} />
      <directionalLight position={[-5, 5, 0]} intensity={1} color={'white'} />
      <directionalLight position={[0, 5, -5]} intensity={1} color={'white'} />

      <SceneManager focusDuration={0.8} />
      {mode === 'selection' && <TransformEditor mode={transformEditorType} />}

      {mode === 'snap' && <SnapPoints />}
      {mode === 'snap' && <SnapController />}

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

      {mode === 'selection' && <SelectionHandler />}
      <SelectedHighlighter />


      {children}

      <Floor fontSize={0.3} />

      {/* <GridWithLabels size={20} divisions={20} fontSize={0.3} position={[0, 0, 0]} gridColor="black" textColor='black' /> */}
      <GizmoHelper alignment="bottom-right" margin={[80, 80]}><GizmoViewport /></GizmoHelper>
    </Canvas>
  )
}
