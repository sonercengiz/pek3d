import { Text } from '@react-three/drei'
import React from 'react'

/**
 * GridWithLabels
 * - Three orthogonal grids (ground, side, front) meeting at the (size,size) corner.
 * - Labels on X & Z axes along the bottom and left edges.
 */
const CubeGridWithLabels = ({
  size = 20,
  divisions = 20,
  labelOffset = 0.5,
  fontSize = 0.5,
  textColor = 'gray',
  gridColor = 'gray',
}) => {
  const step = size / divisions
  const half = size / 2

  return (
    <>
      {/* Ground plane (XZ) shifted so corner is at (size,0,size) */}
      <gridHelper
        args={[size, divisions, "red", "red"]}
        position={[0, 0, 0]}
      />

      {/* Side plane (YZ) rotated and shifted so corner is at (size,size,size?) Actually at (size,half,half) */}
      <gridHelper
        args={[size, divisions, "blue", "blue"]}
        rotation={[0, 0, Math.PI / 2]}
        position={[-half, half, 0]}
      />

      {/* Front plane (XY) rotated and shifted so corner is at (half,size,half) */}
      <gridHelper
        args={[size, divisions, "green", "green"]}
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, half, -half]}
      />

      {/* X-axis labels along Z=0 edge from (0,0) to (size,0) */}
      {Array.from({ length: divisions + 1 }, (_, i) => {
        const x = i * step
        return (
          <Text
            key={`x-label-${i}`}
            position={[x, 0.01, -labelOffset]}
            rotation={[-Math.PI / 2, 0, Math.PI / 2]}
            fontSize={fontSize}
            color={textColor}
            anchorX="center"
            anchorY="middle"
          >
            {`${x.toFixed(1)}m`}
          </Text>
        )
      })}

      {/* Z-axis labels along X=0 edge from (0,0) to (0,size) */}
      {Array.from({ length: divisions + 1 }, (_, i) => {
        const z = i * step
        return (
          <Text
            key={`z-label-${i}`}
            position={[-labelOffset, 0.01, z]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={fontSize}
            color={textColor}
            anchorX="center"
            anchorY="middle"
          >
            {`${z.toFixed(1)}m`}
          </Text>
        )
      })}
    </>
  )
}

export default CubeGridWithLabels
