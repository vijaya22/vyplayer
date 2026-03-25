import { create } from 'zustand'

export const usePlayerStore = create((set) => ({
  // Playback state
  isPlaying: false,
  currentTrack: null,
  playlist: [],
  currentIndex: -1,
  volume: 0.8,
  progress: 0,       // 0-1
  duration: 0,

  // Audio analysis
  amplitude: 0,
  frequencyBands: new Array(16).fill(0),

  // Actions
  setPlaying: (isPlaying) => set({ isPlaying }),
  setTrack: (track, index) => set({ currentTrack: track, currentIndex: index, progress: 0 }),
  setPlaylist: (playlist) => set({ playlist }),
  setVolume: (volume) => set({ volume }),
  setProgress: (progress) => set({ progress }),
  setDuration: (duration) => set({ duration }),
  setAmplitude: (amplitude) => set({ amplitude }),
  setFrequencyBands: (frequencyBands) => set({ frequencyBands }),

  nextTrack: () =>
    set((s) => {
      if (!s.playlist.length) return {}
      const nextIndex = (s.currentIndex + 1) % s.playlist.length
      return { currentTrack: s.playlist[nextIndex], currentIndex: nextIndex, progress: 0 }
    }),

  prevTrack: () =>
    set((s) => {
      if (!s.playlist.length) return {}
      const prevIndex = (s.currentIndex - 1 + s.playlist.length) % s.playlist.length
      return { currentTrack: s.playlist[prevIndex], currentIndex: prevIndex, progress: 0 }
    }),
}))
