import React, { useMemo } from 'react'
import * as THREE from 'three'
import { Text } from '@react-three/drei'

export interface FloorProps {
  /** X eksenindeki toplam uzunluk */
  xSize?: number
  /** Z eksenindeki toplam uzunluk */
  zSize?: number
  /** X doğrultusundaki bölme sayısı */
  xDivisions?: number
  /** Z doğrultusundaki bölme sayısı */
  zDivisions?: number
  /** Grid ve etiket grubunun konumu */
  position?: [number, number, number]
  /** Etiketlerin yerden yüksekliği */
  labelOffset?: number
  /** Çizgi kalınlığı (linewidth) */
  lineThickness?: number
  /** Çizgi opaklığı (0.0–1.0) */
  opacity?: number
  /** Etiket font büyüklüğü */
  fontSize?: number
  /** Etiketlerin rengi */
  textColor?: string
  /** Çizgi rengi */
  gridColor?: string
}

const Floor: React.FC<FloorProps> = ({
  xSize = 20,
  zSize = 10,
  xDivisions = 20,
  zDivisions = 10,
  position = [0, 0, 0],
  labelOffset = 0.5,
  lineThickness = 1,
  opacity = 0.5,
  fontSize = 0.5,
  textColor = 'gray',
  gridColor = 'gray',
}) => {
  // Adımları önceden hesaplayalım
  const xStep = xSize / xDivisions
  const zStep = zSize / zDivisions
  const halfX = xSize / 2
  const halfZ = zSize / 2

  // Tek seferlik geometriyi useMemo ile oluştur
  const gridGeometry = useMemo(() => {
    const verts: number[] = []

    // Dikey çizgiler (Z eksenine paralel), xDivisions+1 tane
    for (let i = 0; i <= xDivisions; i++) {
      const x = -halfX + xStep * i
      verts.push(x, 0, -halfZ, x, 0, halfZ)
    }
    // Yatay çizgiler (X eksenine paralel), zDivisions+1 tane
    for (let j = 0; j <= zDivisions; j++) {
      const z = -halfZ + zStep * j
      verts.push(-halfX, 0, z, halfX, 0, z)
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3))
    return geo
  }, [xSize, zSize, xDivisions, zDivisions])

  return (
    <group position={position}>
      {/* Grid çizgileri */}
      <lineSegments geometry={gridGeometry}>
        <lineBasicMaterial
          attach="material"
          color={gridColor}
          transparent
          opacity={opacity}
          linewidth={lineThickness}
        />
      </lineSegments>

      {/* X doğrultusundaki etiketler */}
      {Array.from({ length: xDivisions + 1 }, (_, i) => {
        const x = -halfX + xStep * i
        return (
          <Text
            key={`x-label-${i}`}
            position={[x, 0.01, -halfZ - labelOffset]}
            rotation={[-Math.PI / 2, 0, Math.PI / 2]}
            fontSize={fontSize}
            color={textColor}
            anchorX="center"
            anchorY="middle"
          >
            {`${(i * xStep).toFixed(2)}m`}
          </Text>
        )
      })}

      {/* Z doğrultusundaki etiketler */}
      {Array.from({ length: zDivisions + 1 }, (_, j) => {
        const z = -halfZ + zStep * j
        return (
          <Text
            key={`z-label-${j}`}
            position={[-halfX - labelOffset, 0.01, z]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={fontSize}
            color={textColor}
            anchorX="center"
            anchorY="middle"
          >
            {`${(j * zStep).toFixed(2)}m`}
          </Text>
        )
      })}
    </group>
  )
}

export default Floor
