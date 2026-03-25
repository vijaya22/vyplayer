import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { usePlayerStore } from '../../store/playerStore'

const BAR_COUNT = 64

export default function FreqRing() {
  const barsRef = useRef([])
  const frequencyBands = usePlayerStore((s) => s.frequencyBands)
  const amplitude = usePlayerStore((s) => s.amplitude)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    barsRef.current.forEach((bar, i) => {
      if (!bar) return
      const bandIndex = Math.floor((i / BAR_COUNT) * 16)
      const freq = frequencyBands[bandIndex] ?? 0
      const height = 0.05 + freq * 2.5

      bar.scale.y += (height - bar.scale.y) * 0.25
      bar.position.y = -2.8 + bar.scale.y / 2

      const hue = (i / BAR_COUNT + t * 0.05) % 1
      bar.material.color.setHSL(hue, 1, 0.55)
      bar.material.emissiveIntensity = 0.3 + amplitude * 0.5
    })
  })

  const bars = useMemo(() =>
    Array.from({ length: BAR_COUNT }, (_, i) => {
      const angle = (i / BAR_COUNT) * Math.PI * 2
      return { angle, x: Math.cos(angle) * 3.2, z: Math.sin(angle) * 3.2 }
    }), [])

  return (
    <group>
      {bars.map((b, i) => (
        <mesh
          key={i}
          ref={(el) => (barsRef.current[i] = el)}
          position={[b.x, -2.8, b.z]}
          rotation={[0, -b.angle, 0]}
        >
          <boxGeometry args={[0.08, 1, 0.08]} />
          <meshStandardMaterial
            color="#00aaff"
            emissive="#0044ff"
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}
    </group>
  )
}
