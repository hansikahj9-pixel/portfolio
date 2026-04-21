import { useFrame, useThree, Canvas } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { liquidSilkShader } from '../shaders/liquidSilkShader';

function LiquidSilkMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { size, viewport } = useThree();

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uResolution: { value: new THREE.Vector2(1, 1) }
  }), []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      materialRef.current.uniforms.uResolution.value.set(size.width, size.height);
      
      const targetX = (state.pointer.x + 1) / 2;
      const targetY = (state.pointer.y + 1) / 2;
      
      materialRef.current.uniforms.uMouse.value.x += (targetX - materialRef.current.uniforms.uMouse.value.x) * 0.05;
      materialRef.current.uniforms.uMouse.value.y += (targetY - materialRef.current.uniforms.uMouse.value.y) * 0.05;
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[viewport.width, viewport.height]} />
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
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1 }}>
      <Canvas
        camera={{ position: [0, 0, 1] }}
        dpr={Math.min(window.devicePixelRatio, 2)}
        gl={{ antialias: true, alpha: true }}
      >
        <LiquidSilkMesh />
      </Canvas>
    </div>
  );
}
