import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { usePlayerStore } from '../../store/playerStore'

const RING_COUNT = 12
const COLORS = ['#ff00ff', '#00ffff', '#ffee00', '#ff4400', '#00ff88']

export default function NeonTunnel() {
  const groupRef = useRef()
  const ringRefs = useRef([])
  const amplitude    = usePlayerStore((s) => s.amplitude)
  const frequencyBands = usePlayerStore((s) => s.frequencyBands)

  const rings = useMemo(() =>
    Array.from({ length: RING_COUNT }, (_, i) => ({
      z: -10 + i * 1.4,
      speed: 0.4 + Math.random() * 0.8,
      dir: i % 2 === 0 ? 1 : -1,
      color: COLORS[i % COLORS.length],
      baseRadius: 0.9 + (i % 3) * 0.25,
    })),
  [])

  useFrame(({ clock }, delta) => {
    const t    = clock.getElapsedTime()
    const bass = (frequencyBands[0] + frequencyBands[1] + frequencyBands[2]) / 3
    const beat = 1 + amplitude * 2.5

    rings.forEach((ring, i) => {
      const mesh = ringRefs.current[i]
      if (!mesh) return

      // Spin
      mesh.rotation.z += delta * ring.speed * ring.dir * (1 + bass * 2)

      // Pulse scale with beat
      const pulse = ring.baseRadius * (1 + amplitude * 0.5 + bass * 0.4)
      mesh.scale.setScalar(pulse)

      // Colour brightness flicker on bass
      mesh.material.opacity = 0.55 + amplitude * 0.4
    })

    // Whole group: slow forward drift (tunnel fly-through feel)
    if (groupRef.current) {
      groupRef.current.position.z = Math.sin(t * 0.25) * 0.8
    }
  })

  return (
    <group ref={groupRef}>
      {rings.map((ring, i) => (
        <mesh
          key={i}
          ref={(el) => (ringRefs.current[i] = el)}
          position={[0, 0, ring.z]}
        >
          <torusGeometry args={[ring.baseRadius, 0.018, 8, 80]} />
          <meshBasicMaterial
            color={ring.color}
            transparent
            opacity={0.6}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  )
}
