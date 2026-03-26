import { useFrame } from '@react-three/fiber'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import Bubbles from './Bubbles'
import FloatingBlobs from './FloatingBlobs'
import CausticLights from './CausticLights'

function SlowCamera() {
  useFrame(({ camera, clock }) => {
    const t = clock.getElapsedTime()
    camera.position.x = Math.sin(t * 0.06) * 0.4
    camera.position.y = Math.cos(t * 0.04) * 0.2
    camera.lookAt(0, 0, 0)
  })
  return null
}

export default function ChillScene() {
  return (
    <>
      <color attach="background" args={['#020b18']} />
      <fog attach="fog" args={['#020b18', 6, 18]} />

      <ambientLight intensity={0.25} color="#003366" />
      <CausticLights />

      <SlowCamera />
      <FloatingBlobs />
      <Bubbles />

      <EffectComposer>
        <Bloom intensity={0.8} luminanceThreshold={0.2} luminanceSmoothing={0.9} mipmapBlur />
        <Vignette eskil={false} offset={0.3} darkness={0.8} />
      </EffectComposer>
    </>
  )
}
