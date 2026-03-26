import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'

const COUNT = 180

export default function DustMotes() {
  const meshRef = useRef()

  const { positions, speeds, phases } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3)
    const speeds = new Float32Array(COUNT)
    const phases = new Float32Array(COUNT)
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 14
      positions[i * 3 + 1] = (Math.random() - 0.5) * 9
      positions[i * 3 + 2] = (Math.random() - 0.5) * 7
      speeds[i]  = 0.015 + Math.random() * 0.025
      phases[i]  = Math.random() * Math.PI * 2
    }
    return { positions, speeds, phases }
  }, [])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const pos = meshRef.current.geometry.attributes.position
    const t = clock.getElapsedTime()
    for (let i = 0; i < COUNT; i++) {
      pos.array[i * 3 + 1] += speeds[i] * 0.012
      pos.array[i * 3]     += Math.sin(t * 0.25 + phases[i]) * 0.0008
      if (pos.array[i * 3 + 1] > 4.5) pos.array[i * 3 + 1] = -4.5
    }
    pos.needsUpdate = true
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={COUNT}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.022}
        color="#d4a850"
        transparent
        opacity={0.45}
        sizeAttenuation
      />
    </points>
  )
}
