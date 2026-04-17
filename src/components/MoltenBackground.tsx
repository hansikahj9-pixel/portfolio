import { useFrame, useThree, Canvas } from '@react-three/fiber';
import { useRef, useMemo, useEffect } from 'react';
import { OrthographicCamera } from '@react-three/drei';
import * as THREE from 'three';
import { moltenMaterialShader } from '../shaders/moltenMaterial';

function MoltenMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree();

  // Initialize uniforms with the actual size from the start
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uResolution: { value: new THREE.Vector2(size.width, size.height) }
  }), []); // Only initialize once

  // Ensure uResolution is always in sync with R3F's internal size state
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uResolution.value.set(size.width, size.height);
    }
  }, [size.width, size.height]);

  useEffect(() => {
    const updateMouse = (e: PointerEvent) => {
      // Use window coordinates for global tracking, but normalized to current viewport
      const x = e.clientX / window.innerWidth;
      const y = 1.0 - (e.clientY / window.innerHeight);
      
      if (materialRef.current) {
        materialRef.current.uniforms.uMouse.value.set(x, y);
      }
    };

    window.addEventListener('pointermove', updateMouse);
    window.addEventListener('pointerdown', updateMouse);

    return () => {
      window.removeEventListener('pointermove', updateMouse);
      window.removeEventListener('pointerdown', updateMouse);
    };
  }, []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh ref={meshRef}>
      {/* Use static 2x2 sizing paired with OrthographicCamera to prevent layout lag */}
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        fragmentShader={moltenMaterialShader.fragmentShader}
        vertexShader={moltenMaterialShader.vertexShader}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  );
}

export default function MoltenBackground() {
  return (
    <div className="molten-background-container" style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100vw', 
      height: '100vh', 
      zIndex: -1, // Underlying layer
      pointerEvents: 'none',
      touchAction: 'none'
    }}>
      {/* Direct Canvas eliminates View portal measurement lag */}
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ width: '100%', height: '100%' }}
      >
        <OrthographicCamera makeDefault left={-1} right={1} top={1} bottom={-1} near={0} far={1} position={[0, 0, 1]} />
        <MoltenMesh />
      </Canvas>
    </div>
  );
}
