import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { usePlayerStore } from '../../store/playerStore'

export default function CausticLights() {
  const l1 = useRef()
  const l2 = useRef()
  const l3 = useRef()
  const amplitude = usePlayerStore((s) => s.amplitude)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const pulse = 1 + amplitude * 0.8

    if (l1.current) {
      l1.current.position.set(Math.sin(t * 0.3) * 3, Math.cos(t * 0.2) * 2, 1)
      l1.current.intensity = 2 * pulse
    }
    if (l2.current) {
      l2.current.position.set(Math.cos(t * 0.4) * 3, Math.sin(t * 0.35) * 2, 0.5)
      l2.current.intensity = 1.5 * pulse
    }
    if (l3.current) {
      l3.current.position.set(Math.sin(t * 0.25 + 2) * 2, Math.cos(t * 0.45 + 1) * 1.5, 2)
      l3.current.intensity = 1.2 * pulse
    }
  })

  return (
    <>
      <pointLight ref={l1} color="#0099ff" distance={12} decay={2} />
      <pointLight ref={l2} color="#00ffcc" distance={10} decay={2} />
      <pointLight ref={l3} color="#0055ff" distance={8}  decay={2} />
    </>
  )
}
