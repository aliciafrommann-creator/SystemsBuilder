'use client'
import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import * as THREE from 'three'

const PATH = [new THREE.Vector3(0,80,160),new THREE.Vector3(10,50,120),new THREE.Vector3(-5,30,80),new THREE.Vector3(8,16,50),new THREE.Vector3(-4,10,28),new THREE.Vector3(2,6,16),new THREE.Vector3(0,4,8),new THREE.Vector3(0,3,4),new THREE.Vector3(0,2.5,1)]
const TGTS = [new THREE.Vector3(0,0,0),new THREE.Vector3(0,0,0),new THREE.Vector3(0,8,0),new THREE.Vector3(0,4,0),new THREE.Vector3(0,4,0),new THREE.Vector3(0,3,0),new THREE.Vector3(0,2,0),new THREE.Vector3(0,2,-2),new THREE.Vector3(0,2,-8)]
const camCurve = new THREE.CatmullRomCurve3(PATH)
const tgtCurve = new THREE.CatmullRomCurve3(TGTS)

export function CameraRig() {
  const { camera } = useThree()
  const scroll = useScroll()
  const tPos  = useRef(new THREE.Vector3())
  const tLook = useRef(new THREE.Vector3())
  const cLook = useRef(new THREE.Vector3(0,0,0))

  useFrame(() => {
    camCurve.getPoint(scroll.offset, tPos.current)
    tgtCurve.getPoint(scroll.offset, tLook.current)
    camera.position.lerp(tPos.current, 0.06)
    cLook.current.lerp(tLook.current, 0.06)
    camera.lookAt(cLook.current)
  })
  return null
}
