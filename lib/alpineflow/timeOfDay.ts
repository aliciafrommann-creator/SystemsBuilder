export type DayPhase = 'dawn' | 'morning' | 'day' | 'golden' | 'dusk' | 'night'

export interface DayPreset {
  phase: DayPhase
  label: string
  skyTop: string; skyHorizon: string; skyGround: string
  sunPosition: [number, number, number]
  sunIntensity: number; sunColor: string
  ambientIntensity: number; ambientColor: string
  fogColor: string; fogNear: number; fogFar: number
  starsVisible: boolean; starsOpacity: number
  terrainColor: string; snowColor: string
  particleColor: string; particleOpacity: number
  uiDark: boolean
}

export const DAY_PRESETS: Record<DayPhase, DayPreset> = {
  dawn:   { phase:'dawn',   label:'Dawn',         skyTop:'#1a1f3c', skyHorizon:'#e8956a', skyGround:'#c47040', sunPosition:[-2,0.05,-1], sunIntensity:0.6,  sunColor:'#f9c886', ambientIntensity:0.4, ambientColor:'#c4b5e8', fogColor:'#e8c4a0', fogNear:20,  fogFar:120, starsVisible:true,  starsOpacity:0.3, terrainColor:'#2a3828', snowColor:'#dce8f0', particleColor:'#f9c886', particleOpacity:0.4, uiDark:true  },
  morning:{ phase:'morning',label:'Morning',      skyTop:'#4a7fa5', skyHorizon:'#c8dff0', skyGround:'#b0c8d8', sunPosition:[-1,0.3,-1],  sunIntensity:1.2,  sunColor:'#fff5e0', ambientIntensity:0.7, ambientColor:'#d8eaf5', fogColor:'#c8dff0', fogNear:30,  fogFar:200, starsVisible:false, starsOpacity:0,   terrainColor:'#3a5040', snowColor:'#f0f4f8', particleColor:'#d8eaf5', particleOpacity:0.3, uiDark:false },
  day:    { phase:'day',    label:'Day',           skyTop:'#2d6fa5', skyHorizon:'#8fc4e8', skyGround:'#6aaccb', sunPosition:[0,1,0],      sunIntensity:1.6,  sunColor:'#fff8f0', ambientIntensity:0.9, ambientColor:'#f0f4f8', fogColor:'#c0d8e8', fogNear:60,  fogFar:300, starsVisible:false, starsOpacity:0,   terrainColor:'#4a6850', snowColor:'#f8fafb', particleColor:'#ffffff', particleOpacity:0.15,uiDark:false },
  golden: { phase:'golden', label:'Golden Hour',  skyTop:'#2a3060', skyHorizon:'#e8834a', skyGround:'#c05820', sunPosition:[2,0.1,-1],   sunIntensity:1.0,  sunColor:'#f5a040', ambientIntensity:0.6, ambientColor:'#e8c88a', fogColor:'#e8a870', fogNear:25,  fogFar:150, starsVisible:false, starsOpacity:0,   terrainColor:'#3a4830', snowColor:'#f8e8d0', particleColor:'#f5a040', particleOpacity:0.5, uiDark:true  },
  dusk:   { phase:'dusk',   label:'Dusk',          skyTop:'#1a1838', skyHorizon:'#8a4060', skyGround:'#6a2840', sunPosition:[3,-0.1,-1],  sunIntensity:0.3,  sunColor:'#d06080', ambientIntensity:0.35,ambientColor:'#9080b0', fogColor:'#6a5878', fogNear:15,  fogFar:100, starsVisible:true,  starsOpacity:0.5, terrainColor:'#282e28', snowColor:'#d0c8d8', particleColor:'#c090b0', particleOpacity:0.4, uiDark:true  },
  night:  { phase:'night',  label:'Night',         skyTop:'#080c18', skyHorizon:'#0e1a28', skyGround:'#0a1418', sunPosition:[0,-1,0],     sunIntensity:0.05, sunColor:'#c8d8f0', ambientIntensity:0.2, ambientColor:'#1a2840', fogColor:'#0e1a28', fogNear:10,  fogFar:80,  starsVisible:true,  starsOpacity:1.0, terrainColor:'#1a2020', snowColor:'#b8c8d8', particleColor:'#c8d8f0', particleOpacity:0.6, uiDark:true  },
}

export function getPhaseFromHour(h: number): DayPhase {
  if (h>=4&&h<6)  return 'dawn'
  if (h>=6&&h<10) return 'morning'
  if (h>=10&&h<16)return 'day'
  if (h>=16&&h<19)return 'golden'
  if (h>=19&&h<21)return 'dusk'
  return 'night'
}

export function getCurrentPreset(): DayPreset {
  return DAY_PRESETS[getPhaseFromHour(new Date().getHours())]
}
