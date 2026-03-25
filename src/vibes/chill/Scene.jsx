import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import Bubbles from './Bubbles'
import FloatingBlobs from './FloatingBlobs'
import CausticLights from './CausticLights'

export default function ChillScene() {
  return (
    <>
      <color attach="background" args={['#020b18']} />
      <fog attach="fog" args={['#020b18', 6, 18]} />

      <ambientLight intensity={0.25} color="#003366" />
      <CausticLights />

      <FloatingBlobs />
      <Bubbles />

      <EffectComposer>
        <Bloom intensity={0.8} luminanceThreshold={0.2} luminanceSmoothing={0.9} />
        <Vignette eskil={false} offset={0.3} darkness={0.8} />
      </EffectComposer>
    </>
  )
}
