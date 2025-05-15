import React, { createContext, useContext, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { View } from '@react-three/drei'

interface ModelPreviewContextType {
  registerViewport: (id: string, ref: React.RefObject<HTMLDivElement>) => void
  unregisterViewport: (id: string) => void
}

const ModelPreviewContext = createContext<ModelPreviewContextType | null>(null)

export const useModelPreview = () => {
  const context = useContext(ModelPreviewContext)
  if (!context) {
    throw new Error('useModelPreview must be used within a ModelPreviewProvider')
  }
  return context
}

interface ModelPreviewProviderProps {
  children: React.ReactNode
}

export const ModelPreviewProvider: React.FC<ModelPreviewProviderProps> = ({ children }) => {
  const viewports = useRef<Map<string, React.RefObject<HTMLDivElement>>>(new Map())

  const registerViewport = (id: string, ref: React.RefObject<HTMLDivElement>) => {
    viewports.current.set(id, ref)
  }

  const unregisterViewport = (id: string) => {
    viewports.current.delete(id)
  }

  return (
    <ModelPreviewContext.Provider value={{ registerViewport, unregisterViewport }}>
      <Canvas
        gl={{
          powerPreference: "high-performance",
          antialias: false,
          alpha: false,
          stencil: false,
          depth: true
        }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[0, 5, 5]} intensity={2} />
        <color attach="background" args={['#cfcfcf']} />

        {Array.from(viewports.current.entries()).map(([id, ref]) => (
          <View key={id} track={ref}>
            {/* Her viewport için ayrı bir kamera */}
            <PerspectiveCamera makeDefault position={[0, 2, 5]} fov={50} />
            {/* Viewport'a özel içerik buraya gelecek */}
            {children}
          </View>
        ))}
      </Canvas>
    </ModelPreviewContext.Provider>
  )
} 