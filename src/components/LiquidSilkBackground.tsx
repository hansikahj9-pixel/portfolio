import { useFrame, useThree, Canvas } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import { OrthographicCamera } from '@react-three/drei';
import * as THREE from 'three';
import { liquidSilkShader } from '../shaders/liquidSilkShader';

function LiquidSilkMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree();

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uResolution: { value: new THREE.Vector2(size.width, size.height) }
  }), []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      materialRef.current.uniforms.uResolution.value.set(state.size.width, state.size.height);
      
      const targetX = (state.pointer.x + 1) / 2;
      const targetY = (state.pointer.y + 1) / 2;
      
      materialRef.current.uniforms.uMouse.value.x += (targetX - materialRef.current.uniforms.uMouse.value.x) * 0.05;
      materialRef.current.uniforms.uMouse.value.y += (targetY - materialRef.current.uniforms.uMouse.value.y) * 0.05;
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        fragmentShader={liquidSilkShader.fragmentShader}
        vertexShader={liquidSilkShader.vertexShader}
        uniforms={uniforms}
        transparent={true}
      />
    </mesh>
  );
}

export default function LiquidSilkBackground() {
  return (
    <div 
      className="fixed inset-0 z-[-1] overflow-hidden" 
      style={{ 
        width: '100vw', 
        height: '100vh', 
        minWidth: '100vw', 
        minHeight: '100vh',
        pointerEvents: 'none',
        background: '#12041c' 
      }}
    >
      <style>{`
        .liquid-silk-container canvas {
          width: 100vw !important;
          height: 100vh !important;
          position: fixed !important;
          top: 0;
          left: 0;
        }
      `}</style>
      <Canvas 
        className="liquid-silk-container"
        orthographic 
        camera={{ position: [0, 0, 1], zoom: 1 }}
        gl={{ antialias: true, alpha: true }}
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <OrthographicCamera makeDefault left={-1} right={1} top={1} bottom={-1} near={0.1} far={10} position={[0, 0, 1]} />
        <LiquidSilkMesh />
      </Canvas>
    </div>
  );
}
