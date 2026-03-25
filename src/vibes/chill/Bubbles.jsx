import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { usePlayerStore } from '../../store/playerStore'

const COUNT = 200

export default function Bubbles() {
  const pointsRef = useRef()
  const amplitude = usePlayerStore((s) => s.amplitude)

  const [positions, velocities, offsets] = useMemo(() => {
    const pos = new Float32Array(COUNT * 3)
    const vel = new Float32Array(COUNT)
    const off = new Float32Array(COUNT)
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 12
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6
      vel[i] = 0.15 + Math.random() * 0.35
      off[i] = Math.random() * Math.PI * 2
    }
    return [pos, vel, off]
  }, [])

  useFrame(({ clock }, delta) => {
    if (!pointsRef.current) return
    const pos = pointsRef.current.geometry.attributes.position.array
    const t = clock.getElapsedTime()
    const speed = 1 + amplitude * 2

    for (let i = 0; i < COUNT; i++) {
      pos[i * 3 + 1] += delta * vel[i] * speed
      pos[i * 3]     += Math.sin(t * 0.4 + off[i]) * delta * 0.08

      if (pos[i * 3 + 1] > 4.5) {
        pos[i * 3 + 1] = -4.5
        pos[i * 3]     = (Math.random() - 0.5) * 12
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={COUNT}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#aaddff"
        transparent
        opacity={0.55}
        sizeAttenuation
      />
    </points>
  )
}
