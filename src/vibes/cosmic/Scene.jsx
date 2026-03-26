import { useFrame } from '@react-three/fiber'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import StarField from './StarField'
import NebulaCloud from './NebulaCloud'
import PulseOrb from './PulseOrb'

function SlowCamera() {
  useFrame(({ camera, clock }) => {
    const t = clock.getElapsedTime()
    camera.position.x = Math.sin(t * 0.06) * 0.5
    camera.position.y = Math.cos(t * 0.04) * 0.25
    camera.lookAt(0, 0, 0)
  })
  return null
}

export default function CosmicScene() {
  return (
    <>
      <color attach="background" args={['#000008']} />
      <ambientLight intensity={0.05} />
      <pointLight position={[0, 0, 0]} intensity={2} color="#aa66ff" distance={8} decay={2} />

      <SlowCamera />
      <StarField />
      <NebulaCloud />
      <PulseOrb />

      <EffectComposer>
        <Bloom intensity={3.0} luminanceThreshold={0.04} luminanceSmoothing={0.92} mipmapBlur />
        <Vignette eskil={false} offset={0.1} darkness={0.88} />
      </EffectComposer>
    </>
  )
}
