'use client'
import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import * as THREE from 'three'

// Dramatic alpine descent: high aerial → sweeping bank → valley dive → through canopy → hotel door
const PATH = [
  new THREE.Vector3(  0,  80, 160),  // aerial overview
  new THREE.Vector3( 42,  58, 118),  // bank right
  new THREE.Vector3(-22,  36,  82),  // sweep left, valley
  new THREE.Vector3(  8,  20,  54),  // diving fast
  new THREE.Vector3(-10,   9,  34),  // through tree tops
  new THREE.Vector3(  5,   5,  19),  // close to canopy
  new THREE.Vector3( -2, 3.8,  11),  // approach clearing
  new THREE.Vector3(  0, 3.2,   5),  // hotel vista
  new THREE.Vector3(  0, 2.5, 0.5),  // at the door
]
const TGTS = [
  new THREE.Vector3(  0,  10,   0),
  new THREE.Vector3(-12,   5,   0),
  new THREE.Vector3( 10,  12,   0),
  new THREE.Vector3(  0,   5,   0),
  new THREE.Vector3(  0,   4,   0),
  new THREE.Vector3(  0, 3.5,   0),
  new THREE.Vector3(  0, 2.8,   0),
  new THREE.Vector3(  0, 2.2,  -2),
  new THREE.Vector3(  0,   2,  -8),
]
const camCurve = new THREE.CatmullRomCurve3(PATH)
const tgtCurve = new THREE.CatmullRomCurve3(TGTS)

export function CameraRig() {
  const { camera } = useThree()
  const scroll = useScroll()
  const tPos  = useRef(new THREE.Vector3())
  const tLook = useRef(new THREE.Vector3())
  const cLook = useRef(new THREE.Vector3(0, 10, 0))

  useFrame(({ clock }) => {
    const t = scroll.offset
    camCurve.getPoint(t, tPos.current)
    tgtCurve.getPoint(t, tLook.current)

    // Subtle breathing motion near ground — simulates footsteps
    const proximity = Math.max(0, t - 0.45) * 1.8
    tPos.current.y += Math.sin(clock.elapsedTime * 1.4) * 0.05 * proximity

    camera.position.lerp(tPos.current, 0.07)
    cLook.current.lerp(tLook.current, 0.07)
    camera.lookAt(cLook.current)

    // Camera roll during the banking sections in the first half of the descent
    const roll = Math.sin(t * Math.PI * 1.5) * 0.045 * Math.max(0, 1 - t * 2.2)
    camera.up.set(Math.sin(roll), Math.cos(roll), 0)
  })
  return null
}
