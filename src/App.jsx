import { Suspense, useState, useCallback } from 'react'
import { usePlayerStore } from './store/playerStore'
import { VIBES } from './vibes'
import Scene from './components/scene/Scene'
import VibeSelector from './components/shared/VibeSelector'
import LandingPage from './components/LandingPage'
import { useAudioEngine } from './hooks/useAudioEngine'

export default function App() {
  // Mount once here so audio survives vibe switches
  useAudioEngine()

  const [showLanding, setShowLanding] = useState(true)
  const vibeId = usePlayerStore((s) => s.vibe)
  const setVibe = usePlayerStore((s) => s.setVibe)
  const active = VIBES.find((v) => v.id === vibeId) ?? VIBES[0]
  const { PlayerUI } = active

  function handleSelect(id) {
    setVibe(id)
    setShowLanding(false)
  }

  // When a track is selected from search on the landing page, enter player view
  const handleSearchTrackSelect = useCallback(() => {
    if (showLanding) setShowLanding(false)
  }, [showLanding])

  if (showLanding) {
    return (
      <>
        <VibeSelector
          showVibeButtons={false}
          onTrackSelect={handleSearchTrackSelect}
        />
        <LandingPage onSelect={handleSelect} />
      </>
    )
  }

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', background: '#000' }}>
      <Scene />
      <VibeSelector
        onBack={() => setShowLanding(true)}
        onTrackSelect={handleSearchTrackSelect}
      />
      <Suspense fallback={null}>
        <PlayerUI />
      </Suspense>
    </div>
  )
}
