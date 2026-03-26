import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { usePlayerStore } from '../../store/playerStore'

export default function BreathOrb() {
  const orbRef  = useRef()
  const haloRef = useRef()
  const amplitude = usePlayerStore((s) => s.amplitude)

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime()

    if (orbRef.current) {
      // Slow rotation on all axes
      orbRef.current.rotation.x += delta * 0.08
      orbRef.current.rotation.y += delta * 0.12
      orbRef.current.rotation.z += delta * 0.05

      // Gentle breathing — sine wave + subtle amplitude nudge
      const breath = 1 + Math.sin(t * 0.6) * 0.06 + amplitude * 0.12
      orbRef.current.scale.setScalar(breath)
    }

    if (haloRef.current) {
      const breath = 1 + Math.sin(t * 0.6 + 0.3) * 0.04 + amplitude * 0.08
      haloRef.current.scale.setScalar(breath)
      haloRef.current.material.opacity = 0.06 + amplitude * 0.08
    }
  })

  return (
    <group>
      {/* Wireframe icosahedron */}
      <mesh ref={orbRef}>
        <icosahedronGeometry args={[0.65, 1]} />
        <meshBasicMaterial
          color="#e8d5a8"
          wireframe
          transparent
          opacity={0.55}
        />
      </mesh>

      {/* Soft outer halo sphere */}
      <mesh ref={haloRef}>
        <sphereGeometry args={[0.9, 16, 16]} />
        <meshBasicMaterial
          color="#f0e4c0"
          transparent
          opacity={0.06}
          side={THREE.BackSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}
