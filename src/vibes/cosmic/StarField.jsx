import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { usePlayerStore } from '../../store/playerStore'

const COUNT = 2500

export default function StarField() {
  const groupRef = useRef()
  const amplitude = usePlayerStore((s) => s.amplitude)

  const positions = useMemo(() => {
    const arr = new Float32Array(COUNT * 3)
    for (let i = 0; i < COUNT; i++) {
      // distribute on a large sphere shell
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 4 + Math.random() * 6
      arr[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      arr[i * 3 + 2] = r * Math.cos(phi)
    }
    return arr
  }, [])

  useFrame((_, delta) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y += delta * 0.012
    groupRef.current.rotation.x += delta * 0.005
    // subtle breathe on beat
    const s = 1 + amplitude * 0.06
    groupRef.current.scale.setScalar(s)
  })

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={positions} count={COUNT} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          size={0.028}
          color="#d0c0ff"
          transparent
          opacity={0.7}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
    </group>
  )
}
