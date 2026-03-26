import { useFrame } from '@react-three/fiber'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { usePlayerStore } from '../../store/playerStore'
import NeonTunnel from './NeonTunnel'
import ElectricBurst from './ElectricBurst'

function HypeCamera() {
  const amplitude = usePlayerStore((s) => s.amplitude)

  useFrame(({ camera, clock }) => {
    const t = clock.getElapsedTime()
    // Fly toward tunnel, oscillate back — creates the rush feeling
    camera.position.z = 2.8 + Math.sin(t * 0.35) * 0.9
    camera.position.x = Math.sin(t * 0.18) * 0.25
    camera.position.y = Math.cos(t * 0.13) * 0.15
    // On heavy bass, camera jumps slightly closer
    camera.position.z -= amplitude * 0.3
    camera.lookAt(0, 0, -4)
  })
  return null
}

export default function HypeScene() {
  return (
    <>
      <color attach="background" args={['#050005']} />
      <ambientLight intensity={0.05} />

      <HypeCamera />
      <NeonTunnel />
      <ElectricBurst />

      <EffectComposer>
        <Bloom intensity={4.5} luminanceThreshold={0.02} luminanceSmoothing={0.85} mipmapBlur />
        <Vignette eskil={false} offset={0.05} darkness={0.82} />
      </EffectComposer>
    </>
  )
}
