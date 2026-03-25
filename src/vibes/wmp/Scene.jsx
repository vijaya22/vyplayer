import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { usePlayerStore } from '../../store/playerStore'
import AlchemyParticles from './AlchemyParticles'

function SlowCamera() {
  useFrame(({ camera, clock }) => {
    const t = clock.getElapsedTime()
    camera.position.x = Math.sin(t * 0.07) * 0.4
    camera.position.y = Math.cos(t * 0.05) * 0.2
    camera.lookAt(0, 0, 0)
  })
  return null
}

export default function WMPScene() {
  return (
    <>
      <color attach="background" args={['#000005']} />
      <ambientLight intensity={0.1} />

      <SlowCamera />
      <AlchemyParticles />

      <EffectComposer>
        <Bloom intensity={2.5} luminanceThreshold={0.05} luminanceSmoothing={0.95} mipmapBlur />
        <Vignette eskil={false} offset={0.15} darkness={0.9} />
      </EffectComposer>
    </>
  )
}
