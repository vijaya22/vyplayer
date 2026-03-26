import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { usePlayerStore } from '../../store/playerStore'

export default function PulseOrb() {
  const coreRef   = useRef()
  const haloRef   = useRef()
  const ring1Ref  = useRef()
  const ring2Ref  = useRef()
  const ring3Ref  = useRef()

  const amplitude     = usePlayerStore((s) => s.amplitude)
  const frequencyBands = usePlayerStore((s) => s.frequencyBands)

  useFrame(({ clock }, delta) => {
    const t    = clock.getElapsedTime()
    const bass = (frequencyBands[0] + frequencyBands[1] + frequencyBands[2]) / 3
    const beat = 1 + amplitude * 2.2

    // Core: pulse size + hue shift
    if (coreRef.current) {
      const s = (0.18 + amplitude * 0.22) * beat
      coreRef.current.scale.setScalar(s)
      coreRef.current.material.emissiveIntensity = 1.2 + amplitude * 3
    }

    // Halo: bigger, softer
    if (haloRef.current) {
      const s = (0.32 + amplitude * 0.35) * beat
      haloRef.current.scale.setScalar(s)
      haloRef.current.material.opacity = 0.08 + amplitude * 0.12
    }

    // Orbiting rings at different tilts — each rotates at its own speed
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += delta * 0.4 * (1 + bass)
      ring1Ref.current.rotation.x = Math.sin(t * 0.2) * 0.4
      const rs = 0.5 + amplitude * 0.4
      ring1Ref.current.scale.setScalar(rs)
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y += delta * 0.28 * (1 + bass)
      ring2Ref.current.rotation.z = t * 0.15
      const rs = 0.7 + amplitude * 0.5
      ring2Ref.current.scale.setScalar(rs)
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x += delta * 0.18 * (1 + bass)
      ring3Ref.current.rotation.y = t * 0.1
      const rs = 0.9 + amplitude * 0.6
      ring3Ref.current.scale.setScalar(rs)
    }
  })

  return (
    <group>
      {/* Core glowing sphere */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color="#cc88ff"
          emissive="#aa44ff"
          emissiveIntensity={1.5}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Soft outer halo */}
      <mesh ref={haloRef}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial
          color="#dd88ff"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Ring 1 — tight, magenta */}
      <mesh ref={ring1Ref} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.55, 0.012, 8, 80]} />
        <meshBasicMaterial
          color="#ff44cc"
          transparent
          opacity={0.7}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Ring 2 — medium, purple */}
      <mesh ref={ring2Ref} rotation={[0.6, 0.4, 0]}>
        <torusGeometry args={[0.75, 0.008, 8, 80]} />
        <meshBasicMaterial
          color="#8844ff"
          transparent
          opacity={0.55}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Ring 3 — wide, cyan-blue */}
      <mesh ref={ring3Ref} rotation={[1.0, 0.8, 0.3]}>
        <torusGeometry args={[1.0, 0.006, 8, 80]} />
        <meshBasicMaterial
          color="#4488ff"
          transparent
          opacity={0.4}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}
