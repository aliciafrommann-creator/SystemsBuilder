'use client'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { DayPreset } from '@/lib/alpineflow/timeOfDay'

function sr(s: number) { const v = Math.sin(s) * 43758.5453; return v - Math.floor(v) }

// 300 trees — clustered for a denser alpine forest feel
const TREES = Array.from({ length: 300 }, (_, i) => {
  const a = sr(i * 1.1) * Math.PI * 2
  const r = 12 + sr(i * 1.3) * 95
  const s = 0.7 + sr(i * 0.9) * 2.0
  const x = Math.cos(a) * r
  const z = Math.sin(a) * r
  // Clear hotel area
  if (Math.abs(x) < 15 && z > -20 && z < 20) return null
  // Cluster coefficient — creates denser patches
  const cx = Math.cos(sr(i * 7.3) * Math.PI * 2) * 18
  const cz = Math.sin(sr(i * 5.1) * Math.PI * 2) * 18
  const clustered = sr(i * 3.7) > 0.55
  return {
    x: clustered ? x * 0.7 + cx * 0.3 : x,
    z: clustered ? z * 0.7 + cz * 0.3 : z,
    s,
    rot: sr(i * 2.1) * Math.PI * 2,
  }
}).filter(Boolean) as { x: number; z: number; s: number; rot: number }[]

const N = TREES.length

const dummy = new THREE.Object3D()

function buildMatrices(
  trunk: THREE.InstancedMesh,
  c1: THREE.InstancedMesh,
  c2: THREE.InstancedMesh,
  c3: THREE.InstancedMesh,
) {
  TREES.forEach((t, i) => {
    // Trunk
    dummy.position.set(t.x, -2 + t.s * 0.6, t.z)
    dummy.rotation.set(0, t.rot, 0)
    dummy.scale.set(t.s * 0.08, t.s * 1.5, t.s * 0.08)
    dummy.updateMatrix()
    trunk.setMatrixAt(i, dummy.matrix)

    // Lower canopy
    dummy.position.set(t.x, -2 + t.s * 1.2, t.z)
    dummy.scale.set(t.s * 1.15, t.s * 1.5, t.s * 1.15)
    dummy.updateMatrix()
    c1.setMatrixAt(i, dummy.matrix)

    // Mid canopy
    dummy.position.set(t.x, -2 + t.s * 2.4, t.z)
    dummy.rotation.set(0, t.rot + 0.25, 0)
    dummy.scale.set(t.s * 0.72, t.s * 1.15, t.s * 0.72)
    dummy.updateMatrix()
    c2.setMatrixAt(i, dummy.matrix)

    // Upper tip
    dummy.position.set(t.x, -2 + t.s * 3.4, t.z)
    dummy.rotation.set(0, t.rot + 0.5, 0)
    dummy.scale.set(t.s * 0.36, t.s * 0.75, t.s * 0.36)
    dummy.updateMatrix()
    c3.setMatrixAt(i, dummy.matrix)
  })
  trunk.instanceMatrix.needsUpdate = true
  c1.instanceMatrix.needsUpdate   = true
  c2.instanceMatrix.needsUpdate   = true
  c3.instanceMatrix.needsUpdate   = true
}

export function AlpineTrees({ preset }: { preset: DayPreset }) {
  const tRef  = useRef<THREE.InstancedMesh>(null)
  const c1Ref = useRef<THREE.InstancedMesh>(null)
  const c2Ref = useRef<THREE.InstancedMesh>(null)
  const c3Ref = useRef<THREE.InstancedMesh>(null)

  const canopy1 = useMemo(() => new THREE.Color('#243d2e'), [])
  const canopy2 = useMemo(() => new THREE.Color('#1c3326'), [])
  const tipColor = useMemo(() => {
    // Snow tips at night/dusk, fresh green in morning/day
    return preset.uiDark ? new THREE.Color(preset.snowColor).multiplyScalar(0.85) : new THREE.Color('#3a5a40')
  }, [preset.uiDark, preset.snowColor])

  // Wind: cheap group-level rotation — all trees sway together like a gust
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (c1Ref.current) c1Ref.current.rotation.x = Math.sin(t * 0.5) * 0.022
    if (c2Ref.current) {
      c2Ref.current.rotation.x = Math.sin(t * 0.62 + 0.4) * 0.032
      c2Ref.current.rotation.z = Math.sin(t * 0.38) * 0.015
    }
    if (c3Ref.current) {
      c3Ref.current.rotation.x = Math.sin(t * 0.75 + 0.8) * 0.048
      c3Ref.current.rotation.z = Math.sin(t * 0.52 + 0.3) * 0.025
    }
  })

  const onUpd = () => {
    if (tRef.current && c1Ref.current && c2Ref.current && c3Ref.current)
      buildMatrices(tRef.current, c1Ref.current, c2Ref.current, c3Ref.current)
  }

  return (
    <group>
      <instancedMesh ref={tRef}  args={[undefined, undefined, N]} castShadow onUpdate={onUpd}>
        <cylinderGeometry args={[1, 1.4, 1, 6]} />
        <meshLambertMaterial color="#5a3820" />
      </instancedMesh>
      <instancedMesh ref={c1Ref} args={[undefined, undefined, N]} castShadow onUpdate={onUpd}>
        <coneGeometry args={[1, 1, 7]} />
        <meshLambertMaterial color={canopy1} />
      </instancedMesh>
      <instancedMesh ref={c2Ref} args={[undefined, undefined, N]} castShadow onUpdate={onUpd}>
        <coneGeometry args={[1, 1, 7]} />
        <meshLambertMaterial color={canopy2} />
      </instancedMesh>
      <instancedMesh ref={c3Ref} args={[undefined, undefined, N]} castShadow onUpdate={onUpd}>
        <coneGeometry args={[1, 1, 5]} />
        <meshLambertMaterial color={tipColor} />
      </instancedMesh>
    </group>
  )
}
