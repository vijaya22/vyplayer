import { useEffect } from 'react'
import { usePlayerStore } from '../store/playerStore'
import { VIBES } from '../vibes'

export function useVibeTheme() {
  const vibeId = usePlayerStore((s) => s.vibe)

  useEffect(() => {
    const vibe = VIBES.find((v) => v.id === vibeId)
    if (!vibe?.theme) return

    const root = document.documentElement
    root.setAttribute('data-vibe', vibeId)
    Object.entries(vibe.theme).forEach(([key, val]) => {
      root.style.setProperty(key, val)
    })
  }, [vibeId])
}
