import { useState } from 'react'
import { useAudioEngine } from '../../hooks/useAudioEngine'
import { useDraggable } from '../../hooks/useDraggable'
import { usePlayerStore } from '../../store/playerStore'
import TitleBar from './ui/TitleBar'
import TrackDisplay from './ui/TrackDisplay'
import Controls from './ui/Controls'
import SeekBar from './ui/SeekBar'
import VolumeSlider from './ui/VolumeSlider'
import SearchWindow from './ui/SearchWindow'
import PlaylistWindow from './ui/PlaylistWindow'
import styles from './ui/PlayerWindow.module.css'

const TABS = ['PLAYLIST', 'SEARCH']

export default function WinampPlayerUI() {
  const { seek } = useAudioEngine()
  const [tab, setTab] = useState('PLAYLIST')
  const [minimized, setMinimized] = useState(false)
  const { pos, onMouseDown, onTouchStart } = useDraggable({ x: 20, y: 60 })

  // pos === null means mobile: use centered fixed position
  const posStyle = pos
    ? { left: pos.x, top: pos.y }
    : { left: '50%', bottom: 16, transform: 'translateX(-50%)', top: 'auto' }

  return (
    <div className={styles.panel} style={posStyle}>
      <TitleBar
        title="VYPLAYER v1.0"
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        minimized={minimized}
        onMinimize={() => setMinimized((v) => !v)}
      />

      {!minimized && (
        <>
          <TrackDisplay />
          <SeekBar onSeek={seek} />
          <Controls />
          <VolumeSlider />

          {/* Tab bar */}
          <div className={styles.tabBar}>
            {TABS.map((t) => (
              <button
                key={t}
                className={`${styles.tabBtn} ${tab === t ? styles.tabActive : ''}`}
                onClick={() => setTab(t)}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className={styles.tabContent}>
            {tab === 'PLAYLIST' && <PlaylistWindow />}
            {tab === 'SEARCH'   && <SearchWindow />}
          </div>
        </>
      )}
    </div>
  )
}
