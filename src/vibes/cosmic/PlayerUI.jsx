// TODO: build vibe-specific UI
import VibeSelector from '../../components/shared/VibeSelector'
import { useAudioEngine } from '../../hooks/useAudioEngine'

export default function PlayerUI() {
  useAudioEngine()
  return (
    <div style={{ position: 'fixed', bottom: 20, left: 20, zIndex: 10 }}>
      <VibeSelector />
    </div>
  )
}
