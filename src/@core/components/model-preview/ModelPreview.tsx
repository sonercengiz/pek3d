import React, { Suspense, useEffect, useRef, ReactNode } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html, useGLTF, useProgress, OrbitControls } from '@react-three/drei'
import { Typography } from '@mui/material'
import * as THREE from 'three'

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
  const { scene } = useGLTF(modelPath) as { scene: THREE.Group }

  useEffect(() => {
    // Remove UV maps and apply dark gray material
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
  fallback?: ReactNode
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
  useEffect(() => {
    useGLTF.preload(modelPath)
  }, [modelPath])

  const { progress } = useProgress()
  const loadingScreen = (
    <Html center>
      <Typography variant="subtitle1" fontSize={14} color="white">
        Loading {Math.round(progress)}%
      </Typography>
    </Html>
  )

  return (
    <Canvas
      camera={{ position: cameraPosition, fov }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={lightPosition} intensity={lightIntensity} />
      <color attach="background" args={[backgroundColor]} />
      <gridHelper args={[10, 10]} position={[0, 0, 0]} />
      <Suspense fallback={fallback || loadingScreen}>
        <SpinningModel
          modelPath={modelPath}
          scale={scale}
          spinSpeed={spinSpeed}
          onLoad={() => console.log('onLoad callback')}
        />
      </Suspense>
      <OrbitControls enablePan={false} enableRotate={false} enableZoom={false} target={targetPosition} />
    </Canvas>
  )
}

export default ModelPreview