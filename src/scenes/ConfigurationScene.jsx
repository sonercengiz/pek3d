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
import { GridWithLabels, useModelsStorage } from '@wi3n/core'
import { useCameraStorage, useControlsStorage, useEnvironmentStorage, useHistoryStorage } from '@wi3n/core'
import SmoothSyncCamera from '../components/r3f-components/SmoothSyncCamera'
import { SceneManager } from '../components/r3f-components/SceneManager'
import SelectionHandler from '../components/r3f-components/SelectionHandler'
import SelectedHighlighter from '../components/r3f-components/SelectedHighlighter'
import { Floor } from '../components/r3f-components/Floor'
import TransformEditor from '../components/r3f-components/TransformEditor'

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

  return (
    <Canvas performance={{ min: 0.1, max: 0.5 }} shadows>
      <Stats />
      <color attach="background" args={[bgColor]} />
      {fogOn && <fog attach="fog" args={[fogColor, fogNear, fogFar]} />}

      <PerspectiveCamera
        makeDefault
        position={camPos}
        zoom={camZ}
        onUpdate={cam => cam.lookAt(...camTar)}
      />

      <directionalLight position={[0, 5, 5]} intensity={5} color={'lightblue'} />
      <directionalLight position={[5, 5, 0]} intensity={5} color={'lightblue'} />
      <directionalLight position={[-5, 5, 0]} intensity={5} color={'lightblue'} />
      <directionalLight position={[0, 5, -5]} intensity={5} color={'lightblue'} />

      <SceneManager focusDuration={0.8} />
      <TransformEditor mode='translate' />

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


      {children}

      {/* <Floor /> */}

      <GridWithLabels size={20} divisions={20} fontSize={0.3} position={[0, 0.01, 0]} gridColor="black" textColor='black' />
      <GridWithLabels size={5} divisions={5} fontSize={0.3} position={[0, 2.01, 0]} gridColor="black" textColor='black' />

      <GizmoHelper alignment="bottom-right" margin={[80, 80]}><GizmoViewport /></GizmoHelper>
    </Canvas>
  )
}
