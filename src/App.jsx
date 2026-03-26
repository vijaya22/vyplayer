import { Suspense } from 'react'
import { usePlayerStore } from './store/playerStore'
import { VIBES } from './vibes'
import Scene from './components/scene/Scene'
import VibeSelector from './components/shared/VibeSelector'
import { useAudioEngine } from './hooks/useAudioEngine'

export default function App() {
  // Mount once here so audio survives vibe switches
  useAudioEngine()

  const vibeId = usePlayerStore((s) => s.vibe)
  const active = VIBES.find((v) => v.id === vibeId) ?? VIBES[0]
  const { PlayerUI } = active

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', background: '#000' }}>
      <Scene />
      <VibeSelector />
      <Suspense fallback={null}>
        <PlayerUI />
      </Suspense>
    </div>
  )
}
