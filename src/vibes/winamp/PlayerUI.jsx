import { useState } from 'react'
import { useAudioEngine } from '../../hooks/useAudioEngine'
import { useDraggable } from '../../hooks/useDraggable'
import TitleBar from './ui/TitleBar'
import TrackDisplay from './ui/TrackDisplay'
import Controls from './ui/Controls'
import SeekBar from './ui/SeekBar'
import VolumeSlider from './ui/VolumeSlider'
import SearchWindow from './ui/SearchWindow'
import PlaylistWindow from './ui/PlaylistWindow'
import styles from './ui/PlayerWindow.module.css'

function DraggablePanel({ title, initialPos, children }) {
  const { pos, onMouseDown, onTouchStart } = useDraggable(initialPos)
  const [minimized, setMinimized] = useState(false)

  return (
    <div className={styles.panel} style={{ left: pos.x, top: pos.y }}>
      <TitleBar
        title={title}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        minimized={minimized}
        onMinimize={() => setMinimized((v) => !v)}
      />
      {!minimized && children}
    </div>
  )
}

export default function WinampPlayerUI() {
  const { seek } = useAudioEngine()

  return (
    <>
      <DraggablePanel title="VYPLAYER v1.0" initialPos={{ x: 20, y: 60 }}>
        <TrackDisplay />
        <SeekBar onSeek={seek} />
        <Controls />
        <VolumeSlider />
      </DraggablePanel>

      <DraggablePanel title="PLAYLIST" initialPos={{ x: 20, y: 300 }}>
        <PlaylistWindow />
      </DraggablePanel>

      <DraggablePanel title="SEARCH" initialPos={{ x: 20, y: 460 }}>
        <SearchWindow />
      </DraggablePanel>
    </>
  )
}
