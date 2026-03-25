import { useState } from 'react'
import { useAudioEngine } from '../../hooks/useAudioEngine'
import { useDraggable } from '../../hooks/useDraggable'
import TitleBar from './TitleBar'
import TrackDisplay from './TrackDisplay'
import Controls from './Controls'
import SeekBar from './SeekBar'
import VolumeSlider from './VolumeSlider'
import SearchWindow from './SearchWindow'
import PlaylistWindow from './PlaylistWindow'
import styles from './PlayerWindow.module.css'

function DraggablePanel({ title, initialPos, children, style }) {
  const { pos, onMouseDown, onTouchStart } = useDraggable(initialPos)
  const [minimized, setMinimized] = useState(false)

  return (
    <div
      className={styles.panel}
      style={{ left: pos.x, top: pos.y, ...style }}
    >
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

export default function PlayerWindow() {
  const { seek } = useAudioEngine()

  return (
    <>
      <DraggablePanel title="VYPLAYER v1.0" initialPos={{ x: 20, y: 60 }}>
        <TrackDisplay />
        <SeekBar onSeek={seek} />
        <Controls />
        <VolumeSlider />
      </DraggablePanel>

      <DraggablePanel title="PLAYLIST" initialPos={{ x: 20, y: 280 }}>
        <PlaylistWindow />
      </DraggablePanel>

      <DraggablePanel title="SEARCH" initialPos={{ x: 20, y: 440 }}>
        <SearchWindow />
      </DraggablePanel>
    </>
  )
}
