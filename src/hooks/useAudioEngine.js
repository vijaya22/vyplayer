import { useEffect, useRef } from 'react'
import { usePlayerStore } from '../store/playerStore'

export function useAudioEngine() {
  const audioRef = useRef(null)
  const contextRef = useRef(null)
  const analyserRef = useRef(null)
  const sourceRef = useRef(null)
  const rafRef = useRef(null)

  const { currentTrack, isPlaying, volume, setPlaying, setProgress, setDuration, setAmplitude, setFrequencyBands, nextTrack } =
    usePlayerStore()

  // Init audio element once
  useEffect(() => {
    const audio = new Audio()
    audio.crossOrigin = 'anonymous'
    audio.preload = 'metadata'
    audioRef.current = audio

    audio.addEventListener('ended', () => {
      nextTrack()
    })

    return () => {
      audio.pause()
      cancelAnimationFrame(rafRef.current)
      contextRef.current?.close()
    }
  }, [])

  // Setup Web Audio API analyser
  function ensureContext() {
    if (contextRef.current) return

    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const analyser = ctx.createAnalyser()
    analyser.fftSize = 64
    analyser.smoothingTimeConstant = 0.8

    const source = ctx.createMediaElementSource(audioRef.current)
    source.connect(analyser)
    analyser.connect(ctx.destination)

    contextRef.current = ctx
    analyserRef.current = analyser
    sourceRef.current = source
  }

  // Track change
  useEffect(() => {
    if (!currentTrack?.previewUrl || !audioRef.current) return
    audioRef.current.src = currentTrack.previewUrl
    audioRef.current.load()
    if (isPlaying) {
      ensureContext()
      contextRef.current?.resume()
      audioRef.current.play().catch(console.error)
    }
  }, [currentTrack])

  // Play/pause
  useEffect(() => {
    if (!audioRef.current || !currentTrack) return
    if (isPlaying) {
      ensureContext()
      contextRef.current?.resume()
      audioRef.current.play().catch(console.error)
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying])

  // Volume
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  // Analysis loop
  useEffect(() => {
    const audio = audioRef.current

    function tick() {
      rafRef.current = requestAnimationFrame(tick)

      if (audio) {
        setProgress(audio.duration ? audio.currentTime / audio.duration : 0)
        setDuration(audio.duration || 0)
      }

      if (!analyserRef.current) {
        setAmplitude(0)
        setFrequencyBands(new Array(16).fill(0))
        return
      }

      const bufferLength = analyserRef.current.frequencyBinCount
      const data = new Uint8Array(bufferLength)
      analyserRef.current.getByteFrequencyData(data)

      // Overall amplitude
      const avg = data.reduce((a, b) => a + b, 0) / bufferLength
      setAmplitude(avg / 255)

      // 16 frequency bands
      const bandsPerBin = Math.floor(bufferLength / 16)
      const bands = Array.from({ length: 16 }, (_, i) => {
        const slice = data.slice(i * bandsPerBin, (i + 1) * bandsPerBin)
        const bandAvg = slice.reduce((a, b) => a + b, 0) / slice.length
        return bandAvg / 255
      })
      setFrequencyBands(bands)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  function seek(ratio) {
    if (!audioRef.current || !audioRef.current.duration) return
    audioRef.current.currentTime = ratio * audioRef.current.duration
  }

  return { seek }
}
