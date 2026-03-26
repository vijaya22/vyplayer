import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { usePlayerStore } from '../../store/playerStore'

const BAR_COUNT = 32
const RADIUS    = 1.4
const BASE_H    = 0.04
const MAX_H     = 0.55

export default function FreqRing() {
  const meshRefs   = useRef([])
  const frequencyBands = usePlayerStore((s) => s.frequencyBands)
  const amplitude      = usePlayerStore((s) => s.amplitude)

  // Interpolated band values for smooth animation
  const smooth = useMemo(() => new Float32Array(BAR_COUNT), [])

  const barData = useMemo(() =>
    Array.from({ length: BAR_COUNT }, (_, i) => {
      const angle = (i / BAR_COUNT) * Math.PI * 2
      return { angle, x: Math.cos(angle) * RADIUS, z: Math.sin(angle) * RADIUS }
    }),
  [])

  useFrame(() => {
    barData.forEach((bar, i) => {
      const mesh = meshRefs.current[i]
      if (!mesh) return

      // Map bar index to frequency band (16 bands, mirror both halves)
      const bandIdx = Math.floor((i / BAR_COUNT) * 16) % 16
      const target  = frequencyBands[bandIdx] ?? 0

      // Smooth lerp — slow to keep it calm
      smooth[i] += (target - smooth[i]) * 0.06

      const h = BASE_H + smooth[i] * MAX_H
      mesh.scale.y = h / BASE_H  // scale the unit-height bar

      // Subtle opacity with amplitude
      mesh.material.opacity = 0.25 + smooth[i] * 0.5
    })
  })

  return (
    <group rotation-y={0}>
      {barData.map((bar, i) => (
        <mesh
          key={i}
          ref={(el) => (meshRefs.current[i] = el)}
          position={[bar.x, 0, bar.z]}
          rotation={[0, -bar.angle, 0]}
        >
          {/* Unit-height bar, scaled on Y in useFrame */}
          <boxGeometry args={[0.025, BASE_H, 0.025]} />
          <meshBasicMaterial
            color="#d4c090"
            transparent
            opacity={0.25}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  )
}
