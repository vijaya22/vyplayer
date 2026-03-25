import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { usePlayerStore } from '../../store/playerStore'

const BAR_COUNT = 16
const BAR_WIDTH = 0.12
const GAP = 0.05

export default function VUMeter() {
  const barsRef = useRef([])
  const frequencyBands = usePlayerStore((s) => s.frequencyBands)

  useFrame(() => {
    barsRef.current.forEach((bar, i) => {
      if (!bar) return
      const target = (frequencyBands[i] ?? 0) * 3
      bar.scale.y += (target - bar.scale.y) * 0.2
      bar.position.y = -2 + bar.scale.y / 2
      const t = i / BAR_COUNT
      bar.material.color.setHSL(0.33 - t * 0.33, 1, 0.5)
    })
  })

  return (
    <group position={[-(BAR_COUNT * (BAR_WIDTH + GAP)) / 2, -2, 0]}>
      {Array.from({ length: BAR_COUNT }).map((_, i) => (
        <mesh
          key={i}
          ref={(el) => (barsRef.current[i] = el)}
          position={[i * (BAR_WIDTH + GAP), 0, 0]}
        >
          <boxGeometry args={[BAR_WIDTH, 1, BAR_WIDTH]} />
          <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={0.5} />
        </mesh>
      ))}
    </group>
  )
}
