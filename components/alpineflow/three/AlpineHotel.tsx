'use client'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { DayPreset } from '@/lib/alpineflow/timeOfDay'

export function AlpineHotel({ preset, scrollProgress }: { preset: DayPreset; scrollProgress: number }) {
  const smokeRef = useRef<THREE.Mesh>(null)
  const wl = preset.uiDark ? '#f5d080' : 'rgba(245,208,128,0.3)'
  const hotspots = scrollProgress > 0.45 && scrollProgress < 0.85

  useFrame(({clock})=>{
    if(smokeRef.current){
      smokeRef.current.position.y=5.5+Math.sin(clock.elapsedTime*0.4)*0.3
      ;(smokeRef.current.material as THREE.MeshBasicMaterial).opacity=preset.uiDark?0.25:0.1
    }
  })

  const wins=[[-4,1.5,4.06],[-1.5,1.5,4.06],[1.5,1.5,4.06],[4,1.5,4.06],[-3.5,3.6,4.06],[-1,3.6,4.06],[1,3.6,4.06],[3.5,3.6,4.06]]

  return (
    <group position={[0,-1.8,-4]}>
      <mesh position={[0,1.25,0]} castShadow receiveShadow><boxGeometry args={[12,2.5,8]}/><meshLambertMaterial color="#e8ddd0"/></mesh>
      <mesh position={[0,3.5,0.5]} castShadow receiveShadow><boxGeometry args={[10,2,7]}/><meshLambertMaterial color="#ddd2c4"/></mesh>
      <mesh position={[0,5,0.5]} castShadow><boxGeometry args={[11,0.3,7.5]}/><meshLambertMaterial color="#4a4038"/></mesh>
      <mesh position={[0,6.2,0.5]} castShadow><coneGeometry args={[6.2,2.4,4]}/><meshLambertMaterial color="#3a3028"/></mesh>
      <mesh position={[7,1,0]} castShadow receiveShadow><boxGeometry args={[4,2,6]}/><meshLambertMaterial color="#e0d5c8"/></mesh>
      <mesh position={[7,3,0]} castShadow><coneGeometry args={[3.2,1.6,4]}/><meshLambertMaterial color="#3a3028"/></mesh>
      <mesh position={[-2,6,0]} castShadow><boxGeometry args={[0.6,2.2,0.6]}/><meshLambertMaterial color="#5a4838"/></mesh>
      <mesh ref={smokeRef} position={[-2,7.5,0]}><sphereGeometry args={[0.5,8,8]}/><meshBasicMaterial color="#c8c0b8" transparent opacity={0.15}/></mesh>
      <mesh position={[0,0.4,4.5]} castShadow receiveShadow><boxGeometry args={[4,0.8,1.5]}/><meshLambertMaterial color="#c8b898"/></mesh>
      <mesh position={[0,1.4,4.05]}><boxGeometry args={[1.4,2.2,0.1]}/><meshLambertMaterial color="#5a3820"/></mesh>
      <mesh position={[0,1.2,4.1]}><boxGeometry args={[1.1,2,0.08]}/><meshLambertMaterial color="#3a2810"/></mesh>
      {wins.map(([x,y,z],i)=>(<group key={i}><mesh position={[x,y,z as number]}><boxGeometry args={[0.9,1.1,0.05]}/><meshBasicMaterial color={wl}/></mesh><mesh position={[x,y,(z as number)-0.01]}><boxGeometry args={[1,1.2,0.04]}/><meshLambertMaterial color="#5a3820"/></mesh></group>))}
      <mesh position={[0,-1.75,6]} rotation={[-Math.PI/2,0,0]} receiveShadow><planeGeometry args={[2,4]}/><meshLambertMaterial color="#b0a090"/></mesh>
      <mesh position={[-7,-1.3,2]} castShadow><boxGeometry args={[1.5,1,0.6]}/><meshLambertMaterial color="#7a5030"/></mesh>
      {hotspots&&[{l:'Check In',p:[0,4,5.5] as [number,number,number]},{l:'Wellness',p:[7,3,1] as [number,number,number]},{l:'Discover',p:[-8,3,0] as [number,number,number]}].map(hs=>(
        <Html key={hs.l} position={hs.p} center distanceFactor={18}>
          <a href={hs.l==='Check In'?'/guest':hs.l==='Wellness'?'/guest/wellness':'/guest/discovery'}>
            <div style={{ background:'rgba(15,28,24,0.85)', border:'1px solid rgba(201,169,110,0.4)', borderRadius:100, padding:'6px 16px', color:'rgba(250,250,247,0.9)', fontFamily:'var(--font-sans)', fontWeight:300, fontSize:12, letterSpacing:'0.06em', whiteSpace:'nowrap', backdropFilter:'blur(12px)', cursor:'pointer', boxShadow:'0 4px 20px rgba(0,0,0,0.3)' }}>{hs.l}</div>
          </a>
        </Html>
      ))}
    </group>
  )
}
