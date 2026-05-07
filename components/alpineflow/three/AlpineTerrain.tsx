'use client'
import { useMemo } from 'react'
import * as THREE from 'three'
import { DayPreset } from '@/lib/alpineflow/timeOfDay'

function noise(x:number,z:number):number{ const s=Math.sin(x*127.1+z*311.7)*43758.5453; return s-Math.floor(s) }
function sn(x:number,z:number):number{ return (noise(x-1,z-1)+noise(x+1,z-1)+noise(x-1,z+1)+noise(x+1,z+1))/16+(noise(x-1,z)+noise(x+1,z)+noise(x,z-1)+noise(x,z+1))/8+noise(x,z)/4 }
function fbm(x:number,z:number):number{ let v=0,a=0.5,f=1; for(let i=0;i<5;i++){v+=sn(x*f,z*f)*a;a*=0.5;f*=2.1} return v }

export function AlpineTerrain({ preset }: { preset: DayPreset }) {
  const geo = useMemo(() => {
    const size=400, segs=128
    const g = new THREE.PlaneGeometry(size,size,segs,segs)
    g.rotateX(-Math.PI/2)
    const pos = g.attributes.position as THREE.BufferAttribute
    const colors = new Float32Array(pos.count*3)
    const col=new THREE.Color(), tc=new THREE.Color(preset.terrainColor), sc=new THREE.Color(preset.snowColor), rc=new THREE.Color('#6a5848')
    for(let i=0;i<pos.count;i++){
      const x=pos.getX(i)/size, z=pos.getZ(i)/size
      const d=Math.sqrt(x*x+z*z), flat=Math.max(0,1-d*3.5)
      const h=(fbm(x*3+0.5,z*3+0.5)*60+Math.pow(Math.abs(x),2)*30+Math.pow(Math.abs(z),2)*20-10*Math.exp(-d*d*8))*(1-flat*0.9)
      pos.setY(i,h-2)
      if(h>30)col.copy(sc); else if(h>15)col.lerpColors(rc,sc,(h-15)/15); else if(h>2)col.lerpColors(tc,rc,(h-2)/13); else col.copy(tc)
      colors[i*3]=col.r; colors[i*3+1]=col.g; colors[i*3+2]=col.b
    }
    g.computeVertexNormals()
    g.setAttribute('color',new THREE.BufferAttribute(colors,3))
    return g
  },[preset.terrainColor,preset.snowColor])

  return <mesh geometry={geo} receiveShadow><meshLambertMaterial vertexColors /></mesh>
}

export function AlpineMeadow({ preset }: { preset: DayPreset }) {
  return <mesh rotation={[-Math.PI/2,0,0]} position={[0,-1.8,0]} receiveShadow><planeGeometry args={[40,40]} /><meshLambertMaterial color={preset.terrainColor} /></mesh>
}
