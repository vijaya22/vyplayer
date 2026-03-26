import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { FogExp2 } from 'three'
import RainDrops from './RainDrops'
import RainRipples from './RainRipples'

function SceneFog() {
  useFrame(({ scene }) => {
    if (!scene.fog) {
      scene.fog = new FogExp2('#060c18', 0.12)
    }
  })
  return null
}

function SlowCamera() {
  useFrame(({ camera, clock }) => {
    const t = clock.getElapsedTime()
    camera.position.x = Math.sin(t * 0.04) * 0.3
    camera.position.y = Math.cos(t * 0.03) * 0.15
    camera.lookAt(0, 0, 0)
  })
  return null
}

export default function SadScene() {
  return (
    <>
      <color attach="background" args={['#030608']} />
      <ambientLight intensity={0.04} />

      {/* Warm lantern — single dim light source */}
      <pointLight position={[0, 1.5, 0.5]} intensity={1.2} color="#ffcc66" distance={6} decay={2} />

      <SceneFog />
      <SlowCamera />

      <RainDrops />
      <RainRipples />

      <EffectComposer>
        <Bloom intensity={0.6} luminanceThreshold={0.18} luminanceSmoothing={0.9} mipmapBlur />
        <Vignette eskil={false} offset={0.1} darkness={0.95} />
      </EffectComposer>
    </>
  )
}
