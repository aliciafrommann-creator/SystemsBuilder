'use client'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { DayPreset } from '@/lib/alpineflow/timeOfDay'

// Window positions — [x, y, z] in hotel local space
const FRONT_WINS = [
  [-4.5, 1.2, 4.06], [-2.2, 1.2, 4.06], [0, 1.2, 4.06], [2.2, 1.2, 4.06], [4.5, 1.2, 4.06],
  [-3.8, 3.3, 4.06], [-1.5, 3.3, 4.06], [1.5, 3.3, 4.06], [3.8, 3.3, 4.06],
  [-2.4, 5.1, 4.06], [0, 5.1, 4.06], [2.4, 5.1, 4.06],
]
const SIDE_WINS = [
  [9.06, 1.2,  0.5], [9.06, 1.2, -1.5], [9.06, 3.3,  0.5], [9.06, 3.3, -1.5],
]

export function AlpineHotel({ preset, scrollProgress }: { preset: DayPreset; scrollProgress: number }) {
  const smoke0 = useRef<THREE.Mesh>(null)
  const smoke1 = useRef<THREE.Mesh>(null)
  const smoke2 = useRef<THREE.Mesh>(null)
  const lantern1 = useRef<THREE.PointLight>(null)
  const lantern2 = useRef<THREE.PointLight>(null)
  const lobbyLight = useRef<THREE.PointLight>(null)

  const isNight  = preset.uiDark
  const wEmit    = isNight ? '#f5c84a' : '#fff8d0'
  const wEmitInt = isNight ? 2.8 : 0.35
  const hotspots = scrollProgress > 0.45 && scrollProgress < 0.85

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    // Smoke drifts upward and sways
    ;[smoke0, smoke1, smoke2].forEach((r, i) => {
      if (!r.current) return
      r.current.position.y = 6.5 + i * 0.55 + Math.sin(t * 0.35 + i * 2.1) * 0.4
      r.current.position.x = -1.9 + Math.sin(t * 0.22 + i * 1.2) * 0.3
      ;(r.current.material as THREE.MeshBasicMaterial).opacity =
        (isNight ? 0.38 : 0.14) * (1 - i * 0.22)
    })
    // Lantern flicker
    const flicker = isNight ? 1.2 + Math.sin(t * 9.3) * 0.18 + Math.sin(t * 7.1) * 0.08 : 0.15
    if (lantern1.current) lantern1.current.intensity = flicker
    if (lantern2.current) lantern2.current.intensity = flicker
    if (lobbyLight.current) lobbyLight.current.intensity = isNight ? 2.0 : 0.25
  })

  return (
    <group position={[0, -1.8, -4]}>

      {/* ── Main body ── */}
      <mesh position={[0, 1.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[12, 3.2, 8]} />
        <meshLambertMaterial color="#e8ddd0" />
      </mesh>
      {/* 1st floor */}
      <mesh position={[0, 3.8, 0.5]} castShadow receiveShadow>
        <boxGeometry args={[10.5, 2.4, 7.5]} />
        <meshLambertMaterial color="#ddd2c4" />
      </mesh>
      {/* Attic */}
      <mesh position={[0, 5.6, 0.8]} castShadow receiveShadow>
        <boxGeometry args={[8, 1.8, 6.5]} />
        <meshLambertMaterial color="#d8ccbe" />
      </mesh>
      {/* Roof eave */}
      <mesh position={[0, 7.0, 0.5]} castShadow>
        <boxGeometry args={[11.5, 0.28, 8.5]} />
        <meshLambertMaterial color="#4a4038" />
      </mesh>
      {/* Main roof */}
      <mesh position={[0, 8.2, 0.5]} castShadow>
        <coneGeometry args={[6.8, 2.4, 4]} />
        <meshLambertMaterial color="#3a3028" />
      </mesh>

      {/* ── Dormers ── */}
      {([-2.5, 0, 2.5] as number[]).map((x, i) => (
        <group key={i} position={[x, 7.8, 3.2]}>
          <mesh castShadow>
            <boxGeometry args={[1.2, 1.0, 0.65]} />
            <meshLambertMaterial color="#ddd2c4" />
          </mesh>
          <mesh position={[0, 0.72, 0]}>
            <coneGeometry args={[0.88, 0.62, 4]} />
            <meshLambertMaterial color="#3a3028" />
          </mesh>
          <mesh position={[0, 0, 0.33]}>
            <boxGeometry args={[0.65, 0.55, 0.05]} />
            <meshStandardMaterial color="#b89030" emissive={wEmit} emissiveIntensity={wEmitInt * 0.7} />
          </mesh>
        </group>
      ))}

      {/* ── Right wing ── */}
      <mesh position={[9, 1.4, -0.5]} castShadow receiveShadow>
        <boxGeometry args={[6, 2.8, 7]} />
        <meshLambertMaterial color="#e0d5c8" />
      </mesh>
      <mesh position={[9, 3.2, -0.5]} castShadow receiveShadow>
        <boxGeometry args={[5, 1.8, 6]} />
        <meshLambertMaterial color="#d8ccbe" />
      </mesh>
      <mesh position={[9, 4.4, -0.5]} castShadow>
        <coneGeometry args={[3.8, 1.8, 4]} />
        <meshLambertMaterial color="#3a3028" />
      </mesh>

      {/* ── Left wing / spa ── */}
      <mesh position={[-9, 1.0, -0.5]} castShadow receiveShadow>
        <boxGeometry args={[4.5, 2, 6]} />
        <meshLambertMaterial color="#e2d8cc" />
      </mesh>
      <mesh position={[-9, 2.5, -0.5]} castShadow>
        <coneGeometry args={[3.2, 1.4, 4]} />
        <meshLambertMaterial color="#3a3028" />
      </mesh>

      {/* ── Balcony rail ── */}
      {([-4, -2, 0, 2, 4] as number[]).map((x, i) => (
        <mesh key={i} position={[x, 1.1, 4.15]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 1.2, 5]} />
          <meshLambertMaterial color="#6a4828" />
        </mesh>
      ))}
      <mesh position={[0, 1.7, 4.15]}>
        <boxGeometry args={[10, 0.08, 0.08]} />
        <meshLambertMaterial color="#6a4828" />
      </mesh>

      {/* ── Chimney ── */}
      <mesh position={[-2, 8.2, 0]} castShadow>
        <boxGeometry args={[0.7, 2.8, 0.7]} />
        <meshLambertMaterial color="#5a4838" />
      </mesh>
      <mesh position={[-2, 9.7, 0]}>
        <boxGeometry args={[0.9, 0.15, 0.9]} />
        <meshLambertMaterial color="#3a2818" />
      </mesh>

      {/* ── Smoke ── */}
      <mesh ref={smoke0} position={[-1.9, 6.5, 0]}>
        <sphereGeometry args={[0.3, 8, 8]} />
        <meshBasicMaterial color="#c8c0b8" transparent opacity={0.18} />
      </mesh>
      <mesh ref={smoke1} position={[-1.9, 7.05, 0]}>
        <sphereGeometry args={[0.42, 8, 8]} />
        <meshBasicMaterial color="#cac2ba" transparent opacity={0.12} />
      </mesh>
      <mesh ref={smoke2} position={[-1.9, 7.6, 0]}>
        <sphereGeometry args={[0.55, 8, 8]} />
        <meshBasicMaterial color="#ccc4bc" transparent opacity={0.08} />
      </mesh>

      {/* ── Entry porch ── */}
      <mesh position={[0, 0.4, 5.0]} castShadow receiveShadow>
        <boxGeometry args={[4.5, 0.8, 2]} />
        <meshLambertMaterial color="#c8b898" />
      </mesh>
      <mesh position={[0, 2.85, 5.45]}>
        <boxGeometry args={[4, 0.2, 1.2]} />
        <meshLambertMaterial color="#4a3828" />
      </mesh>
      {([-1.8, 1.8] as number[]).map((x, i) => (
        <mesh key={i} position={[x, 1.55, 5.65]} castShadow>
          <cylinderGeometry args={[0.12, 0.14, 3.1, 6]} />
          <meshLambertMaterial color="#8a6848" />
        </mesh>
      ))}

      {/* ── Door ── */}
      <mesh position={[0, 1.4, 4.06]}>
        <boxGeometry args={[1.4, 2.6, 0.1]} />
        <meshLambertMaterial color="#5a3820" />
      </mesh>
      <mesh position={[0, 1.3, 4.12]}>
        <boxGeometry args={[1.1, 2.2, 0.08]} />
        <meshLambertMaterial color="#3a2810" />
      </mesh>

      {/* ── Front windows ── */}
      {FRONT_WINS.map(([x, y, z], i) => (
        <group key={i}>
          <mesh position={[x as number, y as number, z as number]}>
            <boxGeometry args={[0.95, 1.12, 0.05]} />
            <meshStandardMaterial color="#b89030" emissive={wEmit} emissiveIntensity={wEmitInt} transparent opacity={0.9} />
          </mesh>
          <mesh position={[x as number, y as number, (z as number) - 0.01]}>
            <boxGeometry args={[1.08, 1.26, 0.04]} />
            <meshLambertMaterial color="#5a3820" />
          </mesh>
        </group>
      ))}

      {/* ── Side windows (right wing) ── */}
      {SIDE_WINS.map(([x, y, z], i) => (
        <group key={i}>
          <mesh position={[x as number, y as number, z as number]}>
            <boxGeometry args={[0.05, 1.12, 0.95]} />
            <meshStandardMaterial color="#b89030" emissive={wEmit} emissiveIntensity={wEmitInt} transparent opacity={0.9} />
          </mesh>
          <mesh position={[(x as number) - 0.01, y as number, z as number]}>
            <boxGeometry args={[0.04, 1.26, 1.08]} />
            <meshLambertMaterial color="#5a3820" />
          </mesh>
        </group>
      ))}

      {/* ── Interior lobby light ── */}
      <pointLight ref={lobbyLight} position={[0, 2.2, 1.5]} color="#f5c84a" intensity={isNight ? 2.0 : 0.25} distance={14} decay={2} />

      {/* ── Entry lanterns ── */}
      <group position={[-2.2, 2.9, 5.1]}>
        <mesh><sphereGeometry args={[0.14, 8, 8]} /><meshBasicMaterial color="#f5d080" /></mesh>
        <pointLight ref={lantern1} color="#f5c060" intensity={isNight ? 1.2 : 0.15} distance={9} decay={2} />
      </group>
      <group position={[2.2, 2.9, 5.1]}>
        <mesh><sphereGeometry args={[0.14, 8, 8]} /><meshBasicMaterial color="#f5d080" /></mesh>
        <pointLight ref={lantern2} color="#f5c060" intensity={isNight ? 1.2 : 0.15} distance={9} decay={2} />
      </group>

      {/* ── Path lanterns ── */}
      {([[−3, 5], [0, 7], [3, 8.5]] as [number,number][]).map(([x, z], i) => (
        <group key={i} position={[x, -1.6, z]}>
          <mesh castShadow><cylinderGeometry args={[0.05, 0.05, 1.4, 5]} /><meshLambertMaterial color="#5a4030" /></mesh>
          <mesh position={[0, 0.82, 0]}><sphereGeometry args={[0.11, 7, 7]} /><meshBasicMaterial color="#f5d080" /></mesh>
          <pointLight position={[0, 0.82, 0]} color="#f5c060" intensity={isNight ? 0.7 : 0.08} distance={6} decay={2} />
        </group>
      ))}

      {/* ── Terrace ── */}
      <mesh position={[0, -1.3, 6.8]} receiveShadow>
        <boxGeometry args={[8, 0.14, 3.2]} />
        <meshLambertMaterial color="#b8a890" />
      </mesh>
      {([[−2.5, 7.8], [0, 7.8], [2.5, 7.8]] as [number,number][]).map(([x, z], i) => (
        <group key={i} position={[x, -1.3, z]}>
          <mesh castShadow position={[0, 0.05, 0]}>
            <cylinderGeometry args={[0.38, 0.38, 0.07, 9]} />
            <meshLambertMaterial color="#c8a888" />
          </mesh>
          {([[−0.32,0],[0.32,0],[0,−0.32],[0,0.32]] as [number,number][]).map(([cx, cz], ci) => (
            <mesh key={ci} castShadow position={[cx, -0.32, cz]}>
              <boxGeometry args={[0.28, 0.55, 0.28]} />
              <meshLambertMaterial color="#9a7858" />
            </mesh>
          ))}
        </group>
      ))}

      {/* ── 3D Hotspot labels ── */}
      {hotspots && [
        { l: 'Check In',    p: [0,    4.2, 5.5] as [number,number,number], href: '/guest' },
        { l: 'Wellness Spa',p: [-9,   2.8, 1.5] as [number,number,number], href: '/guest/wellness' },
        { l: 'Terrace',     p: [0,    0.4, 8.0] as [number,number,number], href: '/guest' },
        { l: 'Restaurant',  p: [9,    2.8, 1.5] as [number,number,number], href: '/guest/discovery' },
      ].map(hs => (
        <Html key={hs.l} position={hs.p} center distanceFactor={18}>
          <a href={hs.href}>
            <div style={{
              background: 'rgba(8,18,14,0.92)',
              border: '1px solid rgba(201,169,110,0.55)',
              borderRadius: 100,
              padding: '5px 16px',
              color: 'rgba(250,250,247,0.95)',
              fontFamily: 'var(--font-sans)',
              fontWeight: 300,
              fontSize: 11,
              letterSpacing: '0.09em',
              whiteSpace: 'nowrap',
              backdropFilter: 'blur(18px)',
              cursor: 'pointer',
              boxShadow: '0 4px 24px rgba(0,0,0,0.45), 0 0 0 0.5px rgba(201,169,110,0.2)',
            }}>
              ↑ {hs.l}
            </div>
          </a>
        </Html>
      ))}
    </group>
  )
}
