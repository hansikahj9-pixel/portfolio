import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useMemo, useEffect } from 'react';
import { View } from '@react-three/drei';
import * as THREE from 'three';
import { moltenMaterialShader } from '../shaders/moltenMaterial';

function MoltenMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { size, viewport } = useThree();

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
      {/* Use dynamic viewport sizing to prevent initial stretching */}
      <planeGeometry args={[viewport.width, viewport.height]} />
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
      <View style={{ width: '100%', height: '100%' }}>
        <MoltenMesh />
      </View>
    </div>
  );
}
