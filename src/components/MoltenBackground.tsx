import { useFrame, useThree, Canvas } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { moltenMaterialShader } from '../shaders/moltenMaterial';

function MoltenMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { size, viewport } = useThree();

  // Memoize uniforms to prevent unnecessary re-creations
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uResolution: { value: new THREE.Vector2(1, 1) }
  }), []);

  useFrame((state) => {
    if (materialRef.current) {
      // Update time
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      
      // Update resolution
      materialRef.current.uniforms.uResolution.value.set(size.width, size.height);
      
      // Smoothly update mouse position
      const targetX = (state.pointer.x + 1) / 2;
      const targetY = (state.pointer.y + 1) / 2;
      
      // Interpolate for organic fluid feel
      materialRef.current.uniforms.uMouse.value.x += (targetX - materialRef.current.uniforms.uMouse.value.x) * 0.1;
      materialRef.current.uniforms.uMouse.value.y += (targetY - materialRef.current.uniforms.uMouse.value.y) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[viewport.width, viewport.height]} />
      <shaderMaterial
        ref={materialRef}
        fragmentShader={moltenMaterialShader.fragmentShader}
        vertexShader={moltenMaterialShader.vertexShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

export default function MoltenBackground() {
  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100vw', 
      height: '100vh', 
      zIndex: -1,
      pointerEvents: 'none' // Ensure it doesn't block interactions
    }}>
      <Canvas
        camera={{ position: [0, 0, 1] }}
        dpr={[1, 2]} // High-resolution handle
        gl={{ antialias: true, alpha: true }}
      >
        <MoltenMesh />
      </Canvas>
    </div>
  );
}
