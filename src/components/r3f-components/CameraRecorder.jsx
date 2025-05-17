// src/components/r3f-components/CameraRecorder.jsx
import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { useCameraStorage } from '@wi3n/core'

export default function CameraRecorder() {
  const setCamPos = useCameraStorage(s => s.setCameraPosition)
  const setCamTar = useCameraStorage(s => s.setCameraTarget)
  const setCamZoom = useCameraStorage(s => s.setCameraZoom)
  const camera = useThree(state => state.camera)
  const controls = useThree(state => state.controls)

  useEffect(() => {
    if (!controls) return
    const handler = () => {
      setCamPos([camera.position.x, camera.position.y, camera.position.z])
      setCamTar([controls.target.x, controls.target.y, controls.target.z])
      setCamZoom(camera.zoom)
    }
    controls.addEventListener('change', handler)
    return () => controls.removeEventListener('change', handler)
  }, [camera, controls, setCamPos, setCamTar, setCamZoom])

  return null
}
