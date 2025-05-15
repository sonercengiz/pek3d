import React from 'react'
import { Text } from '@react-three/drei'

export interface GridWithLabelsProps {
  /** Total size of the grid */
  size?: number
  /** Number of divisions per axis */
  divisions?: number
  /** Position of the grid group */
  position?: [number, number, number]
  /** Offset for the label distance */
  labelOffset?: number
  /** Font size for the labels */
  fontSize?: number
  /** Color of the label text */
  textColor?: string
  /** Color of the grid lines */
  gridColor?: string
}

const GridWithLabels: React.FC<GridWithLabelsProps> = ({
  size = 20,
  divisions = 20,
  position = [0, 0, 0],
  labelOffset = 0.5,
  fontSize = 0.5,
  textColor = 'gray',
  gridColor = 'gray',
}) => {
  const step = size / divisions
  const half = size / 2

  return (
    <group position={position}>
      {/* Grid plane on XZ */}
      <gridHelper args={[size, divisions, gridColor, gridColor]} />

      {/* X-axis labels */}
      {Array.from({ length: divisions + 1 }, (_, i) => {
        const x = -half + step * i
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
            {`${(i * step).toFixed(2)}m`}
          </Text>
        )
      })}

      {/* Z-axis labels */}
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
            {`${(i * step).toFixed(2)}m`}
          </Text>
        )
      })}
    </group>
  )
}

export default GridWithLabels
