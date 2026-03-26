import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { usePlayerStore } from '../../store/playerStore'

const COUNT = 90

export default function DriftingDots() {
  const pointsRef = useRef()
  const amplitude = usePlayerStore((s) => s.amplitude)

  const { positions, velocities } = useMemo(() => {
    const positions  = new Float32Array(COUNT * 3)
    const velocities = []
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 6
      positions[i * 3 + 1] = (Math.random() - 0.5) * 4
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4
      velocities.push({
        vx: (Math.random() - 0.5) * 0.006,
        vy: (Math.random() - 0.5) * 0.004,
        vz: (Math.random() - 0.5) * 0.004,
      })
    }
    return { positions, velocities }
  }, [])

  useFrame((_, delta) => {
    if (!pointsRef.current) return
    const nudge = 1 + amplitude * 0.4

    for (let i = 0; i < COUNT; i++) {
      positions[i * 3]     += velocities[i].vx * nudge
      positions[i * 3 + 1] += velocities[i].vy * nudge
      positions[i * 3 + 2] += velocities[i].vz * nudge

      // Wrap boundaries
      for (let axis = 0; axis < 3; axis++) {
        const limit = axis === 0 ? 3 : 2
        if (Math.abs(positions[i * 3 + axis]) > limit) {
          positions[i * 3 + axis] *= -0.9
        }
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={COUNT} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color="#c8b880"
        transparent
        opacity={0.35}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}
