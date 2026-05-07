'use client'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { DayPreset } from '@/lib/alpineflow/timeOfDay'

function sr(s: number) { const v = Math.sin(s * 127.1) * 43758.5453; return v - Math.floor(v) }

export function AlpineWater({ preset }: { preset: DayPreset }) {
  const matRef = useRef<THREE.MeshStandardMaterial>(null)
  const highlightRef = useRef<THREE.MeshBasicMaterial>(null)

  const waterColor = preset.uiDark ? '#152638' : '#3a7ca8'
  const reflectColor = preset.uiDark ? '#3a5a80' : '#88c4e8'

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (matRef.current) {
      matRef.current.emissiveIntensity = 0.06 + Math.sin(t * 0.42) * 0.025
      matRef.current.roughness = 0.08 + Math.sin(t * 0.3 + 1) * 0.04
    }
    if (highlightRef.current) {
      highlightRef.current.opacity = 0.25 + Math.sin(t * 0.55) * 0.12
    }
  })

  const rocks = useMemo(() => [
    [-16, 0, 10], [-12, 0, -7], [-9, 0, 13], [-5, 0, -9],
    [ 10, 0,  7], [ 7, 0, -11], [15, 0, 4], [-19, 0, 1],
    [-14, 0, 5], [11, 0, -4],
  ], [])

  return (
    // Lake sits to the left of the camera path, visible from aerial and from ground
    <group position={[-44, -2.3, 22]} rotation={[0, 0.35, 0]}>

      {/* Lake bed (slightly below surface) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.15, 0]} receiveShadow>
        <circleGeometry args={[22, 56]} />
        <meshLambertMaterial color="#8a7868" />
      </mesh>

      {/* Lake surface — scale X for an oval shape */}
      <group scale={[1.55, 1, 1]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[18, 56]} />
          <meshStandardMaterial
            ref={matRef}
            color={waterColor}
            transparent
            opacity={0.84}
            roughness={0.08}
            metalness={0.45}
            emissive={waterColor}
            emissiveIntensity={0.06}
          />
        </mesh>
      </group>

      {/* Sky reflection highlight */}
      <group scale={[1.55, 1, 1]}>
        <mesh rotation={[-Math.PI / 2, 0, 0.2]} position={[3, 0.01, -2]}>
          <ellipseGeometry args={[7, 3.5, 24]} />
          <meshBasicMaterial ref={highlightRef} color={reflectColor} transparent opacity={0.28} />
        </mesh>
      </group>

      {/* Shoreline pebbles */}
      {rocks.map(([x, y, z], i) => (
        <mesh
          key={i}
          position={[x as number, y as number, z as number]}
          rotation={[sr(i) * 2, sr(i * 2) * 3, sr(i * 3)]}
          castShadow
        >
          <dodecahedronGeometry args={[0.5 + sr(i * 5) * 0.7, 0]} />
          <meshLambertMaterial color={i % 3 === 0 ? '#7a7068' : i % 3 === 1 ? '#6a6058' : '#8a7868'} />
        </mesh>
      ))}

      {/* Distant mountain reflection (dark strip at far shore) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -14]}>
        <planeGeometry args={[28, 4]} />
        <meshBasicMaterial color={preset.uiDark ? '#0a1820' : '#2a5878'} transparent opacity={0.22} />
      </mesh>

    </group>
  )
}
