import { useRef, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { usePlayerStore } from '../../store/playerStore'

function createCDTexture() {
  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  const cx = size / 2
  const cy = size / 2
  const R = size / 2 - 4

  // Outer silver rim
  ctx.fillStyle = '#c8ccd8'
  ctx.beginPath()
  ctx.arc(cx, cy, R, 0, Math.PI * 2)
  ctx.fill()

  // Rainbow iridescent grooves
  for (let i = 80; i >= 0; i--) {
    const t = i / 80
    const radius = R * 0.32 + R * 0.63 * t
    const hue = (t * 300 + 180) % 360
    ctx.strokeStyle = `hsla(${hue}, 90%, 65%, 0.55)`
    ctx.lineWidth = 3.5
    ctx.beginPath()
    ctx.arc(cx, cy, radius, 0, Math.PI * 2)
    ctx.stroke()
  }

  // Label circle
  const labelGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 0.32)
  labelGrad.addColorStop(0, '#1a1a3a')
  labelGrad.addColorStop(0.7, '#12122a')
  labelGrad.addColorStop(1, '#0a0a1a')
  ctx.fillStyle = labelGrad
  ctx.beginPath()
  ctx.arc(cx, cy, R * 0.32, 0, Math.PI * 2)
  ctx.fill()

  // Label text
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#00ffaa'
  ctx.font = 'bold 28px monospace'
  ctx.fillText('VYPLAYER', cx, cy - 14)
  ctx.fillStyle = '#6666aa'
  ctx.font = '13px monospace'
  ctx.fillText('▶  YOUR  VIBE', cx, cy + 10)
  ctx.fillStyle = '#334'
  ctx.font = '10px monospace'
  ctx.fillText('℗ 2025', cx, cy + 26)

  // Center spindle hole
  ctx.fillStyle = '#000'
  ctx.beginPath()
  ctx.arc(cx, cy, R * 0.055, 0, Math.PI * 2)
  ctx.fill()

  // Spindle ring highlight
  ctx.strokeStyle = '#555'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.arc(cx, cy, R * 0.09, 0, Math.PI * 2)
  ctx.stroke()

  return new THREE.CanvasTexture(canvas)
}

export default function SpinningCD() {
  const groupRef = useRef()
  const isPlaying = usePlayerStore((s) => s.isPlaying)
  const amplitude = usePlayerStore((s) => s.amplitude)
  const texture = useMemo(() => createCDTexture(), [])

  useEffect(() => {
    if (groupRef.current) groupRef.current.rotation.x = 0.3 // slight tilt for depth
  }, [])

  useFrame((_, delta) => {
    if (!groupRef.current) return
    const speed = isPlaying ? 0.6 + amplitude * 1.5 : 0.15
    groupRef.current.rotation.z -= delta * speed
  })

  return (
    <group ref={groupRef}>
      {/* CD face — CircleGeometry faces +Z (camera) by default, no rotation needed */}
      <mesh>
        <circleGeometry args={[1.2, 128]} />
        <meshStandardMaterial map={texture} metalness={0.6} roughness={0.15} side={2} />
      </mesh>

      {/* Edge rim using torus so it's naturally oriented */}
      <mesh>
        <torusGeometry args={[1.2, 0.02, 8, 128]} />
        <meshStandardMaterial color="#b0b8c8" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  )
}
