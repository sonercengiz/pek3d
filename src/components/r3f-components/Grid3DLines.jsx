import React, { useMemo } from 'react'
import * as THREE from 'three'

/**
 * Grid3DPoints
 * - 3D grid rendered as individual points at each lattice intersection.
 *
 * Props:
 * size: number — total span along each axis (±size/2 at extremes).
 * divisions: number — number of segments per axis.
 * position: [x, y, z] — offset for the entire grid.
 * color: string — point color.
 * pointSize: number — size of each point.
 * sizeAttenuation: boolean — whether point size attenuates with distance.
 */
const Grid3DPoints = ({
  size = 20,
  divisions = 10,
  position = [0, 0, 0],
  color = 'gray',
  pointSize = 0.1,
  sizeAttenuation = true,
}) => {
  const step = size / divisions
  const half = size / 2

  // Compute all lattice point positions
  const positions = useMemo(() => {
    const pts = []
    for (let xi = 0; xi <= divisions; xi++) {
      const x = -half + xi * step
      for (let yi = 0; yi <= divisions; yi++) {
        const y = -half + yi * step
        for (let zi = 0; zi <= divisions; zi++) {
          const z = -half + zi * step
          pts.push(x, y, z)
        }
      }
    }
    return new Float32Array(pts)
  }, [divisions, half, step])

  return (
    <points position={position}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={pointSize}
        sizeAttenuation={sizeAttenuation}
      />
    </points>
  )
}

export default Grid3DPoints
