'use client'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { DayPreset } from '@/lib/alpineflow/timeOfDay'

function sr(s:number){const v=Math.sin(s)*43758.5453;return v-Math.floor(v)}
const TREES=Array.from({length:280},(_,i)=>{
  const a=sr(i*1.1)*Math.PI*2, r=15+sr(i*1.3)*80, s=0.6+sr(i*0.9)*1.4
  const x=Math.cos(a)*r, z=Math.sin(a)*r
  if(Math.abs(x)<12&&Math.abs(z)<12)return null
  return{x,z,s,rot:sr(i*2.1)*Math.PI*2}
}).filter(Boolean) as {x:number,z:number,s:number,rot:number}[]

export function AlpineTrees({ preset }: { preset: DayPreset }) {
  const tRef=useRef<THREE.InstancedMesh>(null)
  const c1Ref=useRef<THREE.InstancedMesh>(null)
  const c2Ref=useRef<THREE.InstancedMesh>(null)
  const tc=useMemo(()=>new THREE.Color('#2d4a3e'),[]) 
  const tc2=useMemo(()=>{const c=new THREE.Color(preset.terrainColor);c.multiplyScalar(0.7);return c},[preset.terrainColor])

  const applyMatrix=(trunkR:THREE.InstancedMesh|null,can1:THREE.InstancedMesh|null,can2:THREE.InstancedMesh|null)=>{
    if(!trunkR||!can1||!can2)return
    const d=new THREE.Object3D()
    TREES.forEach((t,i)=>{
      d.position.set(t.x,-2+t.s*0.5,t.z); d.rotation.y=t.rot; d.scale.set(t.s*0.06,t.s*1.2,t.s*0.06); d.updateMatrix(); trunkR.setMatrixAt(i,d.matrix)
      d.position.set(t.x,-2+t.s*0.5+t.s,t.z); d.scale.set(t.s*0.9,t.s*1.2,t.s*0.9); d.updateMatrix(); can1.setMatrixAt(i,d.matrix)
      d.position.set(t.x,-2+t.s*0.5+t.s*1.9,t.z); d.rotation.y=t.rot+0.3; d.scale.set(t.s*0.55,t.s*0.9,t.s*0.55); d.updateMatrix(); can2.setMatrixAt(i,d.matrix)
    })
    trunkR.instanceMatrix.needsUpdate=true; can1.instanceMatrix.needsUpdate=true; can2.instanceMatrix.needsUpdate=true
  }

  const n=TREES.length
  const upd=()=>applyMatrix(tRef.current,c1Ref.current,c2Ref.current)
  return (
    <group>
      <instancedMesh ref={tRef}  args={[undefined,undefined,n]} castShadow onUpdate={upd}><cylinderGeometry args={[1,1,1,5]}/><meshLambertMaterial color="#5a3820"/></instancedMesh>
      <instancedMesh ref={c1Ref} args={[undefined,undefined,n]} castShadow onUpdate={upd}><coneGeometry args={[1,1,6]}/><meshLambertMaterial color={tc}/></instancedMesh>
      <instancedMesh ref={c2Ref} args={[undefined,undefined,n]} castShadow onUpdate={upd}><coneGeometry args={[1,1,6]}/><meshLambertMaterial color={tc2}/></instancedMesh>
    </group>
  )
}
