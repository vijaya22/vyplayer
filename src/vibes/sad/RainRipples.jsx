import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { usePlayerStore } from '../../store/playerStore'

const POOL = 14
const FLOOR_Y = -3.2
const MAX_AGE = 1.8

export default function RainRipples() {
  const ringRefs = useRef([])
  const frequencyBands = usePlayerStore((s) => s.frequencyBands)
  const amplitude = usePlayerStore((s) => s.amplitude)

  const state = useMemo(() => ({
    rings: Array.from({ length: POOL }, () => ({
      age: MAX_AGE + 1, // start dead
      x: 0,
      z: 0,
      maxAge: MAX_AGE,
    })),
    prevBass: 0,
    spawnTimer: 0,
  }), [])

  useFrame((_, delta) => {
    const bass = (frequencyBands[0] + frequencyBands[1] + frequencyBands[2]) / 3

    // Spawn ripples: on bass spikes or on a timer proportional to amplitude
    state.spawnTimer -= delta
    const bassSpike = bass > 0.35 && state.prevBass < 0.35
    const timerSpawn = state.spawnTimer <= 0

    if (bassSpike || timerSpawn) {
      // Find a dead ring to reuse
      const dead = state.rings.find((r) => r.age > r.maxAge)
      if (dead) {
        dead.age = 0
        dead.x = (Math.random() - 0.5) * 5
        dead.z = (Math.random() - 0.5) * 3.5
        dead.maxAge = 1.2 + Math.random() * 0.8
      }
      state.spawnTimer = 0.08 + Math.random() * 0.12 - amplitude * 0.06
    }
    state.prevBass = bass

    // Animate each ring
    state.rings.forEach((ring, i) => {
      ring.age += delta
      const mesh = ringRefs.current[i]
      if (!mesh) return

      if (ring.age > ring.maxAge) {
        mesh.visible = false
        return
      }

      const t = ring.age / ring.maxAge
      mesh.visible = true
      mesh.position.set(ring.x, FLOOR_Y, ring.z)
      const s = 0.15 + t * 2.2
      mesh.scale.set(s, s, 1)
      mesh.material.opacity = (1 - t) * 0.5
    })
  })

  return (
    <>
      {Array.from({ length: POOL }, (_, i) => (
        <mesh
          key={i}
          ref={(el) => (ringRefs.current[i] = el)}
          rotation-x={-Math.PI / 2}
          visible={false}
        >
          <torusGeometry args={[0.28, 0.012, 6, 48]} />
          <meshBasicMaterial
            color="#6aaee0"
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </>
  )
}
