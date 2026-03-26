import { useFrame } from '@react-three/fiber'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import BreathOrb from './BreathOrb'
import FreqRing from './FreqRing'
import DriftingDots from './DriftingDots'

function SlowCamera() {
  useFrame(({ camera, clock }) => {
    const t = clock.getElapsedTime()
    camera.position.x = Math.sin(t * 0.05) * 0.3
    camera.position.y = Math.cos(t * 0.04) * 0.18
    camera.lookAt(0, 0, 0)
  })
  return null
}

export default function FocusScene() {
  return (
    <>
      <color attach="background" args={['#080705']} />
      <ambientLight intensity={0.08} color="#fff8e8" />

      <SlowCamera />
      <DriftingDots />
      <FreqRing />
      <BreathOrb />

      <EffectComposer>
        <Bloom intensity={1.2} luminanceThreshold={0.1} luminanceSmoothing={0.95} mipmapBlur />
        <Vignette eskil={false} offset={0.12} darkness={0.85} />
      </EffectComposer>
    </>
  )
}
