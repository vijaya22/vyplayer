import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { usePlayerStore } from '../../store/playerStore'

const COUNT = 1000

export default function ElectricBurst() {
  const pointsRef = useRef()
  const amplitude      = usePlayerStore((s) => s.amplitude)
  const frequencyBands = usePlayerStore((s) => s.frequencyBands)

  const state = useMemo(() => {
    const pos   = new Float32Array(COUNT * 3)
    const color = new Float32Array(COUNT * 3)
    const vel   = []
    const life  = new Float32Array(COUNT)
    const maxL  = new Float32Array(COUNT)
    const hues  = new Float32Array(COUNT)

    for (let i = 0; i < COUNT; i++) {
      // spawn at center with random outward direction
      const theta = Math.random() * Math.PI * 2
      const phi   = Math.acos(2 * Math.random() - 1)
      const speed = 2 + Math.random() * 6
      vel.push({
        vx: Math.sin(phi) * Math.cos(theta) * speed,
        vy: Math.sin(phi) * Math.sin(theta) * speed,
        vz: Math.cos(phi) * speed * 0.4,
      })

      pos[i * 3] = pos[i * 3 + 1] = pos[i * 3 + 2] = 0
      life[i] = Math.random()
      maxL[i] = 0.4 + Math.random() * 0.8
      // neon hue range: skip green-only, keep cyan/yellow/magenta/red
      hues[i] = Math.random()
    }
    return { pos, color, vel, life, maxL, hues }
  }, [])

  useFrame(({ clock }, delta) => {
    if (!pointsRef.current) return
    const { pos, color, vel, life, maxL, hues } = state
    const t    = clock.getElapsedTime()
    const bass = (frequencyBands[0] + frequencyBands[1] + frequencyBands[2]) / 3
    const beat = 1 + amplitude * 3.5

    for (let i = 0; i < COUNT; i++) {
      life[i] += delta * (1.2 + amplitude * 2)

      if (life[i] > maxL[i]) {
        // respawn at center
        pos[i * 3] = (Math.random() - 0.5) * 0.1
        pos[i * 3 + 1] = (Math.random() - 0.5) * 0.1
        pos[i * 3 + 2] = (Math.random() - 0.5) * 0.05

        const theta = Math.random() * Math.PI * 2
        const phi   = Math.acos(2 * Math.random() - 1)
        const speed = 2 + Math.random() * 7 + bass * 6
        vel[i].vx = Math.sin(phi) * Math.cos(theta) * speed
        vel[i].vy = Math.sin(phi) * Math.sin(theta) * speed
        vel[i].vz = Math.cos(phi) * speed * 0.35
        life[i] = 0
        maxL[i] = 0.3 + Math.random() * 0.7
        hues[i] = (t * 0.15 + Math.random()) % 1
      }

      pos[i * 3]     += vel[i].vx * beat * delta
      pos[i * 3 + 1] += vel[i].vy * beat * delta
      pos[i * 3 + 2] += vel[i].vz * beat * delta

      // Neon color — high saturation, full brightness, fade near end of life
      const lifeFrac = life[i] / maxL[i]
      const brightness = Math.pow(1 - lifeFrac, 0.5)
      const c = new THREE.Color().setHSL(hues[i], 1.0, brightness * 0.55)
      color[i * 3]     = c.r
      color[i * 3 + 1] = c.g
      color[i * 3 + 2] = c.b
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true
    pointsRef.current.geometry.attributes.color.needsUpdate    = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={state.pos}   count={COUNT} itemSize={3} />
        <bufferAttribute attach="attributes-color"    array={state.color} count={COUNT} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
