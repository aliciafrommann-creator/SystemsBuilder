'use client'
import { Canvas } from '@react-three/fiber'
import { Preload, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei'
import * as THREE from 'three'
import { AlpineScene } from './AlpineScene'
import { getCurrentPreset } from '@/lib/alpineflow/timeOfDay'

export function AlpineLobbyCanvas() {
  const preset = getCurrentPreset()
  return (
    <Canvas
      style={{ width:'100%', height:'100vh', position:'absolute', inset:0 }}
      shadows dpr={[1,2]}
      camera={{ position:[0,80,160], fov:55, near:0.1, far:800 }}
      gl={{ antialias:true, toneMapping:THREE.ACESFilmicToneMapping, toneMappingExposure: preset.phase==='night'?0.5:preset.phase==='golden'?1.2:1.0, outputColorSpace:THREE.SRGBColorSpace }}
    >
      <Preload all />
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
      <AlpineScene />
    </Canvas>
  )
}
