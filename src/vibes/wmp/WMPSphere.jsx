import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { usePlayerStore } from '../../store/playerStore'

export default function WMPSphere() {
  const meshRef = useRef()
  const frequencyBands = usePlayerStore((s) => s.frequencyBands)
  const amplitude = usePlayerStore((s) => s.amplitude)

  const geometry = useMemo(() => new THREE.SphereGeometry(1.4, 80, 80), [])
  const originalPositions = useMemo(
    () => Float32Array.from(geometry.attributes.position.array),
    [geometry]
  )

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()
    const pos = geometry.attributes.position.array

    for (let i = 0; i < pos.length; i += 3) {
      const ox = originalPositions[i]
      const oy = originalPositions[i + 1]
      const oz = originalPositions[i + 2]

      // Map vertex to a frequency band by its angle around Y axis
      const angle = Math.atan2(oz, ox)
      const bandIndex = Math.floor(((angle + Math.PI) / (Math.PI * 2)) * 16)
      const freq = frequencyBands[Math.min(bandIndex, 15)] ?? 0

      const spike = 1 + freq * 1.2 + Math.sin(t * 3 + oy * 4 + angle * 2) * 0.04 * (1 + amplitude)
      pos[i]     = ox * spike
      pos[i + 1] = oy * spike
      pos[i + 2] = oz * spike
    }

    geometry.attributes.position.needsUpdate = true
    geometry.computeVertexNormals()

    // Hue cycles with time + amplitude
    const hue = ((t * 0.08) % 1)
    meshRef.current.material.color.setHSL(hue, 1, 0.55)
    meshRef.current.material.emissive.setHSL((hue + 0.5) % 1, 1, 0.08 + amplitude * 0.2)
  })

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial
        wireframe={false}
        metalness={0.3}
        roughness={0.4}
        side={THREE.FrontSide}
      />
    </mesh>
  )
}
