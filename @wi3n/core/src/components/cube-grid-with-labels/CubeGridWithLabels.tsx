import React from 'react'
import { Text } from '@react-three/drei'
import type { Vector3 } from 'three'

export interface CubeGridWithLabelsProps {
  /** Total size of each grid plane */
  size?: number
  /** Number of divisions per grid */
  divisions?: number
  /** Offset distance for labels */
  labelOffset?: number
  /** Font size for axis labels */
  fontSize?: number
  /** Color of the label text */
  textColor?: string
}

const CubeGridWithLabels: React.FC<CubeGridWithLabelsProps> = ({
  size = 20,
  divisions = 20,
  labelOffset = 0.5,
  fontSize = 0.5,
  textColor = 'gray',
}) => {
  const step = size / divisions
  const half = size / 2

  return (
    <>
      {/* Ground plane (XZ) at origin */}
      <gridHelper
        args={[size, divisions, 'red', 'red']}
        position={[0, 0, 0]}
      />

      {/* Side plane (YZ), rotated to face X axis */}
      <gridHelper
        args={[size, divisions, 'blue', 'blue']}
        rotation={[0, 0, Math.PI / 2]}
        position={[-half, half, 0]}
      />

      {/* Front plane (XY), rotated to face Z axis */}
      <gridHelper
        args={[size, divisions, 'green', 'green']}
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, half, -half]}
      />

      {/* X-axis labels along Z=0 edge */}
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

      {/* Z-axis labels along X=0 edge */}
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
