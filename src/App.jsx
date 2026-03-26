import { Suspense, useState } from 'react'
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

  if (showLanding) {
    return <LandingPage onSelect={handleSelect} />
  }

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', background: '#000' }}>
      <Scene />
      <VibeSelector />
      <Suspense fallback={null}>
        <PlayerUI />
      </Suspense>
      {/* Back to landing */}
      <button
        onClick={() => setShowLanding(true)}
        style={{
          position: 'fixed',
          top: 16,
          right: 16,
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: 8,
          color: '#aaa',
          cursor: 'pointer',
          fontSize: 12,
          fontFamily: 'system-ui, sans-serif',
          letterSpacing: '0.1em',
          padding: '6px 12px',
          textTransform: 'uppercase',
          backdropFilter: 'blur(8px)',
          zIndex: 200,
        }}
      >
        ← Vibes
      </button>
    </div>
  )
}
