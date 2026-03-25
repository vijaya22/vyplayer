import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { usePlayerStore } from '../../store/playerStore'

const COUNT = 140

export default function Petals() {
  const meshRef = useRef()
  const amplitude = usePlayerStore((s) => s.amplitude)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const petals = useMemo(() =>
    Array.from({ length: COUNT }, () => ({
      x: (Math.random() - 0.5) * 16,
      y: (Math.random() - 0.5) * 12,
      z: (Math.random() - 0.5) * 5,
      rotX: Math.random() * Math.PI,
      rotY: Math.random() * Math.PI,
      rotZ: Math.random() * Math.PI,
      fallSpeed: 0.25 + Math.random() * 0.45,
      swaySpeed: 0.2 + Math.random() * 0.35,
      swayAmt:   0.15 + Math.random() * 0.35,
      rotSpeed:  (Math.random() - 0.5) * 1.2,
      phase:     Math.random() * Math.PI * 2,
      scale:     0.5 + Math.random() * 0.8,
    })), [])

  useFrame(({ clock }, delta) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()
    const speed = 1 + amplitude * 1.5

    petals.forEach((p, i) => {
      p.y   -= delta * p.fallSpeed * speed
      p.x   += Math.sin(t * p.swaySpeed + p.phase) * delta * p.swayAmt
      p.rotX += delta * p.rotSpeed
      p.rotZ += delta * p.rotSpeed * 0.6

      if (p.y < -7) {
        p.y = 7
        p.x = (Math.random() - 0.5) * 16
      }

      dummy.position.set(p.x, p.y, p.z)
      dummy.rotation.set(p.rotX, p.rotY, p.rotZ)
      dummy.scale.set(p.scale, p.scale * 0.55, p.scale)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    })

    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[null, null, COUNT]}>
      <circleGeometry args={[0.18, 8]} />
      <meshStandardMaterial
        color="#ffb7c5"
        transparent
        opacity={0.75}
        side={THREE.DoubleSide}
        roughness={0.9}
        emissive="#ff88aa"
        emissiveIntensity={0.15}
      />
    </instancedMesh>
  )
}
