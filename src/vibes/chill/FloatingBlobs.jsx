import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { usePlayerStore } from '../../store/playerStore'

const BLOBS = [
  { pos: [-2.5,  0.5, -1.0], baseSize: 0.9, speed: 0.25, phase: 0.0, color: '#003d99' },
  { pos: [ 2.2, -0.8, -2.0], baseSize: 0.6, speed: 0.40, phase: 1.2, color: '#005580' },
  { pos: [ 0.0,  1.8, -1.5], baseSize: 0.7, speed: 0.30, phase: 2.5, color: '#004466' },
  { pos: [-1.2, -1.5, -0.5], baseSize: 0.5, speed: 0.50, phase: 3.7, color: '#006699' },
  { pos: [ 1.8,  1.2, -2.5], baseSize: 0.8, speed: 0.28, phase: 4.9, color: '#002255' },
  { pos: [ 0.5, -2.0, -1.2], baseSize: 0.4, speed: 0.60, phase: 0.8, color: '#007799' },
  { pos: [-2.0,  1.8, -2.0], baseSize: 0.55, speed: 0.35, phase: 5.5, color: '#004488' },
]

export default function FloatingBlobs() {
  const refs = useRef([])
  const amplitude = usePlayerStore((s) => s.amplitude)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    refs.current.forEach((mesh, i) => {
      if (!mesh) return
      const b = BLOBS[i]
      mesh.position.x = b.pos[0] + Math.cos(t * b.speed * 0.7 + b.phase) * 0.3
      mesh.position.y = b.pos[1] + Math.sin(t * b.speed + b.phase) * 0.5
      const scale = b.baseSize + amplitude * 0.25
      mesh.scale.setScalar(scale)
    })
  })

  return (
    <>
      {BLOBS.map((b, i) => (
        <mesh key={i} ref={(el) => (refs.current[i] = el)} position={b.pos}>
          <sphereGeometry args={[1, 24, 24]} />
          <meshStandardMaterial
            color={b.color}
            transparent
            opacity={0.18}
            roughness={0.05}
            metalness={0.4}
          />
        </mesh>
      ))}
    </>
  )
}
