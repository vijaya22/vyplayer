import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { usePlayerStore } from '../../store/playerStore'

const COUNT = 2500

function randomInCircle(r) {
  const a = Math.random() * Math.PI * 2
  const d = Math.sqrt(Math.random()) * r
  return [Math.cos(a) * d, Math.sin(a) * d]
}

export default function AlchemyParticles() {
  const pointsRef = useRef()

  // Particle state stored in refs to avoid re-renders
  const state = useMemo(() => {
    const pos   = new Float32Array(COUNT * 3)
    const color = new Float32Array(COUNT * 3)
    const vel   = []
    const life  = new Float32Array(COUNT)
    const maxL  = new Float32Array(COUNT)
    const hues  = new Float32Array(COUNT)

    for (let i = 0; i < COUNT; i++) {
      const [x, y] = randomInCircle(0.3)
      pos[i * 3]     = x
      pos[i * 3 + 1] = y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.2

      const angle = Math.atan2(y, x) + (Math.random() - 0.5) * 1.2
      const speed = 0.004 + Math.random() * 0.012
      vel.push({ vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, vz: (Math.random() - 0.5) * 0.002 })

      life[i]  = Math.random()
      maxL[i]  = 1.5 + Math.random() * 2.5
      hues[i]  = Math.random()
    }

    return { pos, color, vel, life, maxL, hues }
  }, [])

  useFrame(({ clock }, delta) => {
    if (!pointsRef.current) return
    const { pos, color, vel, life, maxL, hues } = state
    const t = clock.getElapsedTime()
    const { amplitude, frequencyBands } = usePlayerStore.getState()
    const beat = 1 + amplitude * 2.5

    // Average of lower bands for bass reaction
    const bass = (frequencyBands[0] + frequencyBands[1] + frequencyBands[2]) / 3

    for (let i = 0; i < COUNT; i++) {
      life[i] += delta * (0.4 + amplitude * 0.6)

      if (life[i] > maxL[i]) {
        // Respawn near center
        const [x, y] = randomInCircle(0.2 + bass * 0.5)
        pos[i * 3]     = x
        pos[i * 3 + 1] = y
        pos[i * 3 + 2] = (Math.random() - 0.5) * 0.2
        const angle = Math.atan2(y, x) + (Math.random() - 0.5) * 0.8
        const speed = 0.004 + Math.random() * 0.014 + bass * 0.02
        vel[i].vx = Math.cos(angle) * speed
        vel[i].vy = Math.sin(angle) * speed
        vel[i].vz = (Math.random() - 0.5) * 0.003
        life[i]  = 0
        maxL[i]  = 1.5 + Math.random() * 2.5
        hues[i]  = (t * 0.04 + Math.random() * 0.3) % 1
      }

      // Swirl force — particles curve around the center
      const px = pos[i * 3]
      const py = pos[i * 3 + 1]
      const dist = Math.sqrt(px * px + py * py) + 0.001
      const swirl = 0.0008 * beat
      vel[i].vx += -py / dist * swirl
      vel[i].vy +=  px / dist * swirl

      // Damping
      vel[i].vx *= 0.998
      vel[i].vy *= 0.998

      pos[i * 3]     += vel[i].vx * beat
      pos[i * 3 + 1] += vel[i].vy * beat
      pos[i * 3 + 2] += vel[i].vz

      // Color: hue shifts with life progress, brightness peaks mid-life
      const lifeFrac = life[i] / maxL[i]
      const brightness = Math.sin(lifeFrac * Math.PI)
      const hue = (hues[i] + t * 0.03) % 1
      const c = new THREE.Color().setHSL(hue, 1.0, 0.3 + brightness * 0.55)
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
        size={0.035}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
