import { Suspense } from 'react'
import { usePlayerStore } from './store/playerStore'
import { VIBES } from './vibes'
import Scene from './components/scene/Scene'
import VibeSelector from './components/shared/VibeSelector'

export default function App() {
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
