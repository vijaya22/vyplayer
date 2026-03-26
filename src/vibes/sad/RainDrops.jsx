import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { usePlayerStore } from '../../store/playerStore'

const COUNT = 1200
const TILT = 0.12 // slight wind angle in radians

export default function RainDrops() {
  const meshRef = useRef()
  const amplitude = usePlayerStore((s) => s.amplitude)

  const { drops, dummy } = useMemo(() => {
    const drops = Array.from({ length: COUNT }, () => ({
      x: (Math.random() - 0.5) * 8,
      y: (Math.random() - 0.5) * 7,
      z: (Math.random() - 0.5) * 5,
      speed: 2.5 + Math.random() * 2,
    }))
    return { drops, dummy: new THREE.Object3D() }
  }, [])

  useFrame((_, delta) => {
    if (!meshRef.current) return
    const beat = 1 + amplitude * 2.2

    for (let i = 0; i < COUNT; i++) {
      const d = drops[i]
      d.y -= d.speed * beat * delta

      if (d.y < -3.5) {
        d.y = 3.5 + Math.random() * 2
        d.x = (Math.random() - 0.5) * 8
        d.z = (Math.random() - 0.5) * 5
      }

      dummy.position.set(d.x, d.y, d.z)
      dummy.rotation.set(0, 0, TILT)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[null, null, COUNT]}>
      <boxGeometry args={[0.007, 0.18, 0.002]} />
      <meshBasicMaterial
        color="#a8d0f0"
        transparent
        opacity={0.45}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </instancedMesh>
  )
}
