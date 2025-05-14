import { Text } from '@react-three/drei'
import React from 'react'

const GridWithLabels = ({ size = 20, divisions = 20, position = [0, 0, 0], labelOffset = 0.5, fontSize = 0.5, textColor = 'gray', gridColor='gray' }) => {
  const step = size / divisions
  const half = size / 2

  return (
    <>
      <group position={position}>
        {/* Orijinal grid */}
        <gridHelper args={[size, divisions, gridColor, gridColor]} />

        {/* X ekseni üzerindeki etiketler */}
        {Array.from({ length: divisions + 1 }, (_, i) => {
          const x = -half + step * i
          // atlamak istersen örn i===0 || i===divisions
          return (
            <Text
              key={`x-label-${i}`}
              position={[x, 0.01, -half - labelOffset]}
              rotation={[-Math.PI / 2, 0, Math.PI / 2]}
              fontSize={fontSize}
              color={textColor}
              anchorX="center"
              anchorY="middle"
            >
              {`${i * step}m`}
            </Text>
          )
        })}

        {/* Z ekseni üzerindeki etiketler */}
        {Array.from({ length: divisions + 1 }, (_, i) => {
          const z = -half + step * i
          return (
            <Text
              key={`z-label-${i}`}
              position={[-half - labelOffset, 0.01, z]}
              rotation={[-Math.PI / 2, 0, 0]}
              fontSize={fontSize}
              color={textColor}
              anchorX="center"
              anchorY="middle"
            >
              {`${i * step}m`}
            </Text>
          )
        })}
      </group>
    </>
  )
}

export default GridWithLabels