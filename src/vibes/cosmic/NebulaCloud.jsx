import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { usePlayerStore } from '../../store/playerStore'

const COUNT = 700

export default function NebulaCloud() {
  const pointsRef = useRef()
  const amplitude = usePlayerStore((s) => s.amplitude)
  const frequencyBands = usePlayerStore((s) => s.frequencyBands)

  const state = useMemo(() => {
    const pos   = new Float32Array(COUNT * 3)
    const color = new Float32Array(COUNT * 3)
    const vel   = []
    const life  = new Float32Array(COUNT)
    const maxL  = new Float32Array(COUNT)
    const hues  = new Float32Array(COUNT)

    for (let i = 0; i < COUNT; i++) {
      const theta = Math.random() * Math.PI * 2
      const r = 0.5 + Math.random() * 2.5
      pos[i * 3]     = Math.cos(theta) * r
      pos[i * 3 + 1] = (Math.random() - 0.5) * 2
      pos[i * 3 + 2] = Math.sin(theta) * r

      const speed = 0.002 + Math.random() * 0.005
      const drift = (Math.random() - 0.5) * 0.001
      vel.push({ vx: -Math.sin(theta) * speed, vy: drift, vz: Math.cos(theta) * speed })

      life[i] = Math.random() * 4
      maxL[i] = 3 + Math.random() * 4
      // hue range: 200–320 = blue → purple → pink → magenta
      hues[i] = 0.55 + Math.random() * 0.35
    }

    return { pos, color, vel, life, maxL, hues }
  }, [])

  useFrame(({ clock }, delta) => {
    if (!pointsRef.current) return
    const { pos, color, vel, life, maxL, hues } = state
    const t = clock.getElapsedTime()
    const bass = (frequencyBands[0] + frequencyBands[1] + frequencyBands[2]) / 3
    const beat = 1 + amplitude * 1.8

    for (let i = 0; i < COUNT; i++) {
      life[i] += delta * (0.25 + amplitude * 0.4)

      if (life[i] > maxL[i]) {
        const theta = Math.random() * Math.PI * 2
        const r = 0.4 + Math.random() * 2.8
        pos[i * 3]     = Math.cos(theta) * r
        pos[i * 3 + 1] = (Math.random() - 0.5) * 2
        pos[i * 3 + 2] = Math.sin(theta) * r
        const speed = 0.002 + Math.random() * 0.006 + bass * 0.008
        vel[i].vx = -Math.sin(theta) * speed
        vel[i].vy = (Math.random() - 0.5) * 0.001
        vel[i].vz = Math.cos(theta) * speed
        life[i] = 0
        maxL[i] = 3 + Math.random() * 4
        hues[i] = (0.55 + Math.random() * 0.35 + t * 0.01) % 1
      }

      // slow orbit swirl
      const px = pos[i * 3]
      const pz = pos[i * 3 + 2]
      const dist = Math.sqrt(px * px + pz * pz) + 0.001
      const swirl = 0.0004 * beat
      vel[i].vx += -pz / dist * swirl
      vel[i].vz +=  px / dist * swirl
      vel[i].vx *= 0.999
      vel[i].vz *= 0.999

      pos[i * 3]     += vel[i].vx * beat
      pos[i * 3 + 1] += vel[i].vy
      pos[i * 3 + 2] += vel[i].vz * beat

      const lifeFrac = life[i] / maxL[i]
      const brightness = Math.sin(lifeFrac * Math.PI)
      const hue = (hues[i] + t * 0.008) % 1
      const c = new THREE.Color().setHSL(hue, 0.9, 0.25 + brightness * 0.45)
      color[i * 3]     = c.r
      color[i * 3 + 1] = c.g
      color[i * 3 + 2] = c.b
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true
    pointsRef.current.geometry.attributes.color.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={state.pos}   count={COUNT} itemSize={3} />
        <bufferAttribute attach="attributes-color"    array={state.color} count={COUNT} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.055}
        vertexColors
        transparent
        opacity={0.75}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
