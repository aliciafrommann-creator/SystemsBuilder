'use client'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { DayPreset } from '@/lib/alpineflow/timeOfDay'

const N=800
export function AlpineParticles({ preset }: { preset: DayPreset }) {
  const ref=useRef<THREE.Points>(null)
  const [pos,vel]=useMemo(()=>{
    const p=new Float32Array(N*3),v=new Float32Array(N*3)
    for(let i=0;i<N;i++){
      p[i*3]=(Math.random()-0.5)*180; p[i*3+1]=Math.random()*80; p[i*3+2]=(Math.random()-0.5)*180
      v[i*3]=(Math.random()-0.5)*0.02; v[i*3+1]=-0.008-Math.random()*0.015; v[i*3+2]=(Math.random()-0.5)*0.01
    }
    return[p,v]
  },[])

  useFrame(()=>{
    if(!ref.current)return
    const p=ref.current.geometry.attributes.position as THREE.BufferAttribute
    for(let i=0;i<N;i++){
      let y=p.getY(i)+vel[i*3+1]
      if(y<-5)y=80+Math.random()*20
      p.setXYZ(i,p.getX(i)+vel[i*3],y,p.getZ(i)+vel[i*3+2])
    }
    p.needsUpdate=true
  })

  return (
    <points ref={ref}>
      <bufferGeometry><bufferAttribute attach="attributes-position" array={pos} count={N} itemSize={3}/></bufferGeometry>
      <pointsMaterial color={new THREE.Color(preset.particleColor)} size={0.25} transparent opacity={preset.particleOpacity} depthWrite={false} sizeAttenuation/>
    </points>
  )
}

export function AlpineMist({ preset }: { preset: DayPreset }) {
  const ref=useRef<THREE.Group>(null)
  const opacity=preset.phase==='dawn'?0.18:preset.phase==='dusk'?0.14:preset.phase==='night'?0.10:preset.phase==='morning'?0.08:0.04
  useFrame(({clock})=>{ if(ref.current)ref.current.children.forEach((c,i)=>{c.position.x+=Math.sin(clock.elapsedTime*0.05+i)*0.01;c.position.z+=Math.cos(clock.elapsedTime*0.04+i*0.5)*0.008}) })
  return (
    <group ref={ref}>
      {[[20,0,15],[-15,0,25],[8,0,-20],[-25,0,-10],[35,0,5],[-8,0,40]].map(([x,y,z],i)=>(
        <mesh key={i} position={[x,y,z as number]}><sphereGeometry args={[6+i*1.5,8,6]}/><meshBasicMaterial color={new THREE.Color(preset.fogColor)} transparent opacity={opacity} depthWrite={false}/></mesh>
      ))}
    </group>
  )
}
