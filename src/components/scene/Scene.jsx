import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { usePlayerStore } from '../../store/playerStore'
import { VIBES } from '../../vibes'

export default function Scene() {
  const vibeId = usePlayerStore((s) => s.vibe)
  const active = VIBES.find((v) => v.id === vibeId) ?? VIBES[0]
  const { Scene: VibeScene } = active

  return (
    <Canvas
      style={{ position: 'absolute', inset: 0 }}
      camera={{ position: [0, 0, 5], fov: 60 }}
      dpr={[1, 1.5]}
      gl={{ powerPreference: 'high-performance', failIfMajorPerformanceCaveat: false }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener('webglcontextlost', (e) => {
          e.preventDefault()
          window.location.reload()
        })
      }}
    >
      <Suspense fallback={null}>
        <VibeScene />
      </Suspense>
    </Canvas>
  )
}
