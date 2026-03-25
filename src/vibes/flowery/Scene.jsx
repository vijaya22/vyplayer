import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { usePlayerStore } from '../../store/playerStore'
import Petals from './Petals'

function FloatingLights() {
  const l1 = useRef()
  const l2 = useRef()
  const l3 = useRef()
  const amplitude = usePlayerStore((s) => s.amplitude)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const pulse = 1 + amplitude * 0.6
    if (l1.current) {
      l1.current.position.set(Math.sin(t * 0.2) * 4, Math.cos(t * 0.15) * 2, 1)
      l1.current.intensity = 2.5 * pulse
    }
    if (l2.current) {
      l2.current.position.set(Math.cos(t * 0.25) * 3, Math.sin(t * 0.2) * 3, 0)
      l2.current.intensity = 2 * pulse
    }
    if (l3.current) {
      l3.current.position.set(Math.sin(t * 0.18 + 2) * 3, Math.cos(t * 0.3) * 1.5, 2)
      l3.current.intensity = 1.5 * pulse
    }
  })

  return (
    <>
      <pointLight ref={l1} color="#ff88bb" distance={14} decay={2} />
      <pointLight ref={l2} color="#cc88ff" distance={12} decay={2} />
      <pointLight ref={l3} color="#ffccdd" distance={10} decay={2} />
    </>
  )
}

export default function FloweryScene() {
  return (
    <>
      <color attach="background" args={['#0d0510']} />
      <fog attach="fog" args={['#0d0510', 8, 20]} />

      <ambientLight intensity={0.4} color="#220011" />
      <FloatingLights />

      <Petals />

      <Sparkles
        count={60}
        scale={12}
        size={1.5}
        speed={0.25}
        color="#ffddee"
        opacity={0.6}
      />

      <EffectComposer>
        <Bloom intensity={1.2} luminanceThreshold={0.15} luminanceSmoothing={0.9} />
        <Vignette eskil={false} offset={0.25} darkness={0.75} />
      </EffectComposer>
    </>
  )
}
