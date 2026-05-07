'use client'

import { useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html, Stars } from '@react-three/drei'
import * as THREE from 'three'

type Zone = {
  id: 'wellness' | 'discovery' | 'rest' | 'sustainability'
  label: string
  route: string
  position: [number, number, number]
  color: string
}

type TimeTheme = {
  skyTop: string
  skyBottom: string
  ambient: string
  directional: string
  ground: string
  intensity: number
  night: boolean
}

const ZONES: Zone[] = [
  { id: 'wellness', label: 'Wellness', route: '/guest/wellness', position: [-8, 3, -8], color: '#97aebb' },
  { id: 'discovery', label: 'Discovery', route: '/guest/discovery', position: [8, 5, -14], color: '#4f6650' },
  { id: 'rest', label: 'Rest', route: '/guest/housekeeping', position: [0, 3, -4], color: '#c0ac8e' },
  { id: 'sustainability', label: 'Sustainability', route: '/guest/sustainability', position: [12, 2.5, 2], color: '#4f6650' },
]

function getTimeTheme(hour: number): TimeTheme {
  if (hour >= 6 && hour < 10) {
    return {
      skyTop: '#e8b17b',
      skyBottom: '#f3f0e8',
      ambient: '#ffd9ad',
      directional: '#ffb15f',
      ground: '#2f4638',
      intensity: 1.0,
      night: false,
    }
  }
  if (hour >= 10 && hour < 17) {
    return {
      skyTop: '#9eb8c8',
      skyBottom: '#edf3f6',
      ambient: '#d9ecf4',
      directional: '#d3e8f6',
      ground: '#345241',
      intensity: 1.2,
      night: false,
    }
  }
  if (hour >= 17 && hour < 20) {
    return {
      skyTop: '#c6784d',
      skyBottom: '#e8c79e',
      ambient: '#e9c092',
      directional: '#d97d3a',
      ground: '#2d463a',
      intensity: 0.9,
      night: false,
    }
  }
  return {
    skyTop: '#121f34',
    skyBottom: '#1f2f46',
    ambient: '#7c9ab9',
    directional: '#90a9cf',
    ground: '#1a2e28',
    intensity: 0.45,
    night: true,
  }
}

function CinematicCamera() {
  useFrame(({ camera, clock }) => {
    const t = clock.getElapsedTime()
    const descent = Math.max(0, 1 - t / 20)
    const baseY = 36 * descent + 8
    const baseZ = 64 * descent + 18
    const driftX = Math.sin(t * 0.18) * 5
    const driftY = Math.cos(t * 0.12) * 1.2

    camera.position.lerp(new THREE.Vector3(driftX, baseY + driftY, baseZ), 0.02)
    camera.lookAt(0, 3.5, -6)
  })

  return null
}

function Terrain({ theme }: { theme: TimeTheme }) {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.6, 0]} receiveShadow>
        <planeGeometry args={[240, 240, 1, 1]} />
        <meshStandardMaterial color={theme.ground} roughness={0.95} metalness={0.02} />
      </mesh>
      <mesh position={[0, 12, -42]} castShadow>
        <coneGeometry args={[34, 30, 6]} />
        <meshStandardMaterial color={theme.night ? '#25394f' : '#526e60'} roughness={0.85} />
      </mesh>
      <mesh position={[-26, 10, -36]} castShadow>
        <coneGeometry args={[24, 24, 6]} />
        <meshStandardMaterial color={theme.night ? '#233145' : '#5f7b67'} roughness={0.85} />
      </mesh>
      <mesh position={[28, 9, -30]} castShadow>
        <coneGeometry args={[20, 21, 6]} />
        <meshStandardMaterial color={theme.night ? '#223146' : '#5c755f'} roughness={0.85} />
      </mesh>
    </>
  )
}

function ZoneAnchors({
  hovered,
  setHovered,
  onSelect,
}: {
  hovered: Zone['id'] | null
  setHovered: (value: Zone['id'] | null) => void
  onSelect: (route: string) => void
}) {
  return (
    <>
      {ZONES.map((zone) => {
        const active = hovered === zone.id
        return (
          <group key={zone.id} position={zone.position}>
            <mesh
              onPointerOver={() => setHovered(zone.id)}
              onPointerOut={() => setHovered(null)}
              onClick={() => onSelect(zone.route)}
              castShadow
            >
              <icosahedronGeometry args={[active ? 0.95 : 0.7, 0]} />
              <meshStandardMaterial
                color={zone.color}
                emissive={zone.color}
                emissiveIntensity={active ? 1.3 : 0.65}
                roughness={0.3}
                metalness={0.1}
              />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.7, 0]}>
              <ringGeometry args={[1.8, 2.05, 64]} />
              <meshBasicMaterial color={zone.color} transparent opacity={active ? 0.95 : 0.45} />
            </mesh>
            {active ? (
              <Html center position={[0, 1.9, 0]} distanceFactor={18}>
                <div
                  style={{
                    background: 'rgba(15,28,24,0.72)',
                    border: '1px solid rgba(255,255,255,0.18)',
                    borderRadius: 999,
                    padding: '8px 14px',
                    color: 'var(--color-fog)',
                    fontFamily: 'var(--font-sans)',
                    letterSpacing: '0.08em',
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {zone.label}
                </div>
              </Html>
            ) : null}
          </group>
        )
      })}
    </>
  )
}

export function AlpineLobby() {
  const router = useRouter()
  const [hovered, setHovered] = useState<Zone['id'] | null>(null)
  const [transitioning, setTransitioning] = useState(false)
  const theme = useMemo(() => getTimeTheme(new Date().getHours()), [])

  const selecting = useRef(false)
  const handleSelect = (route: string) => {
    if (selecting.current) return
    selecting.current = true
    setTransitioning(true)
    window.setTimeout(() => {
      router.push(route)
    }, 300)
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', background: theme.skyBottom }}>
      <Canvas shadows camera={{ position: [0, 40, 72], fov: 44, near: 0.1, far: 500 }}>
        <color attach="background" args={[theme.skyTop]} />
        <fog attach="fog" args={[theme.skyBottom, 50, 220]} />

        <ambientLight color={theme.ambient} intensity={theme.intensity} />
        <directionalLight
          position={theme.night ? [32, 44, 26] : [26, 38, 22]}
          color={theme.directional}
          intensity={theme.night ? 0.8 : 1.25}
          castShadow
        />

        {theme.night ? <Stars radius={200} depth={90} count={3000} factor={4} saturation={0} fade speed={0.3} /> : null}

        <CinematicCamera />
        <Terrain theme={theme} />
        <ZoneAnchors hovered={hovered} setHovered={setHovered} onSelect={handleSelect} />
      </Canvas>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: `radial-gradient(ellipse at 50% 75%, rgba(0,0,0,0) 0%, rgba(15,28,24,0.34) 100%)`,
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: transitioning ? 1 : 0,
          transition: 'opacity var(--duration-cinematic) var(--ease-cinematic)',
          background: 'rgba(10,16,14,0.72)',
        }}
      />
    </div>
  )
}
