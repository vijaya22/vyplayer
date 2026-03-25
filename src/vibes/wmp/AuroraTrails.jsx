import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { usePlayerStore } from '../../store/playerStore'

const TRAIL_COUNT = 6
const POINTS_PER_TRAIL = 80

export default function AuroraTrails() {
  const groupRef = useRef()
  const amplitude = usePlayerStore((s) => s.amplitude)

  const trails = useMemo(() =>
    Array.from({ length: TRAIL_COUNT }, (_, i) => {
      const positions = new Float32Array(POINTS_PER_TRAIL * 3)
      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

      const hue = i / TRAIL_COUNT
      const material = new THREE.LineBasicMaterial({
        color: new THREE.Color().setHSL(hue, 1, 0.6),
        transparent: true,
        opacity: 0.55,
      })

      return {
        geometry,
        material,
        positions,
        phase: (i / TRAIL_COUNT) * Math.PI * 2,
        speed: 0.18 + i * 0.07,
        radius: 1.8 + i * 0.25,
        tilt: (i / TRAIL_COUNT) * Math.PI,
        hue,
      }
    }), [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const pulse = 1 + amplitude * 0.8

    trails.forEach((trail) => {
      const pos = trail.positions
      for (let j = 0; j < POINTS_PER_TRAIL; j++) {
        const frac = j / POINTS_PER_TRAIL
        const angle = frac * Math.PI * 4 + t * trail.speed + trail.phase
        const r = (trail.radius + Math.sin(frac * Math.PI * 3 + t) * 0.4) * pulse

        const x = Math.cos(angle) * r
        const y = Math.sin(frac * Math.PI * 2 + t * 0.3) * 1.8
        const z = Math.sin(angle) * r * Math.cos(trail.tilt)

        pos[j * 3]     = x
        pos[j * 3 + 1] = y
        pos[j * 3 + 2] = z
      }
      trail.geometry.attributes.position.needsUpdate = true

      // Cycle hue over time
      const hue = (trail.hue + t * 0.05) % 1
      trail.material.color.setHSL(hue, 1, 0.6)
      trail.material.opacity = 0.4 + amplitude * 0.4
    })
  })

  return (
    <group ref={groupRef}>
      {trails.map((trail, i) => (
        <primitive key={i} object={new THREE.Line(trail.geometry, trail.material)} />
      ))}
    </group>
  )
}
