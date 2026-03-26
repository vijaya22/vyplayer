import { useFrame } from '@react-three/fiber'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import CassetteTape from './CassetteTape'
import DustMotes from './DustMotes'

function DriftCamera() {
  useFrame(({ camera, clock }) => {
    const t = clock.getElapsedTime()
    camera.position.x = Math.sin(t * 0.1) * 0.18
    camera.position.y = Math.cos(t * 0.08) * 0.1
    camera.lookAt(0, 0, 0)
  })
  return null
}

export default function CassetteScene() {
  return (
    <>
      <color attach="background" args={['#18120a']} />

      {/* Strong front-facing light to show label colors clearly */}
      <directionalLight position={[0.5, 1, 6]} intensity={3.0} color="#fff8f0" />
      {/* Warm amber fill from upper-left */}
      <pointLight position={[-5, 4, 3]} intensity={2.0} color="#ffcc70" distance={20} decay={2} />
      {/* Subtle cool rim from right */}
      <pointLight position={[5, -1, 3]} intensity={0.6} color="#b0c8ff" distance={14} decay={2} />
      {/* Low ambient */}
      <ambientLight intensity={0.22} color="#ffe0b0" />

      <DriftCamera />
      <CassetteTape />
      <DustMotes />

      <EffectComposer>
        <Bloom intensity={0.35} luminanceThreshold={0.75} luminanceSmoothing={0.9} mipmapBlur />
        <Vignette eskil={false} offset={0.1} darkness={0.6} />
      </EffectComposer>
    </>
  )
}
