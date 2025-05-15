import React, { useEffect, useRef, useState, Suspense } from 'react'
import { useGLTF, useProgress, Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { Typography } from '@mui/material'
import * as THREE from 'three'
import { useModelPreview } from './ModelPreviewProvider'

interface SpinningModelProps {
  modelPath: string
  scale?: number | [number, number, number]
  spinSpeed?: number
  onLoad?: () => void
}

const SpinningModel: React.FC<SpinningModelProps> = ({
  modelPath,
  scale = 1,
  spinSpeed = 0.5,
  onLoad = () => { },
}) => {
  const group = useRef<THREE.Group>(null)
  const { scene } = useGLTF(modelPath)

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.deleteAttribute('uv')
        child.castShadow = false
        child.receiveShadow = false
        child.material = new THREE.MeshStandardMaterial({ color: '#525252' })
      }
    })
    onLoad()
  }, [scene, onLoad])

  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * spinSpeed
    }
  })

  return <primitive ref={group} object={scene} scale={scale} />
}

interface ModelPreviewProps {
  modelPath: string
  scale?: number | [number, number, number]
  spinSpeed?: number
  cameraPosition?: [number, number, number]
  targetPosition?: [number, number, number]
  fov?: number
  backgroundColor?: string
  lightPosition?: [number, number, number]
  lightIntensity?: number
  fallback?: React.ReactNode
}

const ModelPreview: React.FC<ModelPreviewProps> = ({
  modelPath,
  scale = 1,
  spinSpeed = 0.5,
  cameraPosition = [0, 2, 5],
  targetPosition = [0, 0, 0],
  fov = 50,
  backgroundColor = 'gray',
  lightPosition = [0, 5, 5],
  lightIntensity = 2,
  fallback,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { registerViewport, unregisterViewport } = useModelPreview()
  const [viewportId] = useState(() => `model-preview-${Math.random().toString(36).substr(2, 9)}`)
  const { progress } = useProgress()

  useEffect(() => {
    const ref = containerRef.current
    if (ref) {
      registerViewport(viewportId, { current: ref })
    }
    return () => unregisterViewport(viewportId)
  }, [viewportId, registerViewport, unregisterViewport])

  useEffect(() => {
    useGLTF.preload(modelPath)
  }, [modelPath])

  const loadingScreen = (
    <Html center>
      <Typography variant="subtitle1" fontSize={14} color="white">
        Loading {Math.round(progress)}%
      </Typography>
    </Html>
  )

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        backgroundColor
      }}
    >
      <Suspense fallback={fallback || loadingScreen}>
        <SpinningModel
          modelPath={modelPath}
          scale={scale}
          spinSpeed={spinSpeed}
          onLoad={() => console.log('Model loaded')}
        />
      </Suspense>
    </div>
  )
}

export default ModelPreview