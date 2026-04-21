import { useFrame, Canvas } from '@react-three/fiber';
import { useRef, useMemo, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { OrthographicCamera } from '@react-three/drei';
import * as THREE from 'three';

// Shader Imports
import { fluidVertexShader, fluidFragmentShader } from '../shaders/fluidShader';
import { moltenMaterialShader } from '../shaders/moltenMaterial';
import { liquidSilkShader } from '../shaders/liquidSilkShader';

function BackgroundMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const location = useLocation();
  
  // State for the active shader
  const [currentMode, setCurrentMode] = useState<'fluid' | 'molten' | 'silk'>('fluid');

  useEffect(() => {
    const path = location.pathname;
    if (path === '/process') setCurrentMode('silk');
    else if (path === '/inspiration') setCurrentMode('molten');
    else setCurrentMode('fluid');
  }, [location.pathname]);

  // Unified Uniforms
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    uColor: { value: new THREE.Color('#C3C1B9') } // For fluid background
  }), []);

  // Update mouse position globally
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      uniforms.uMouse.value.set(
        e.clientX / window.innerWidth,
        1.0 - e.clientY / window.innerHeight
      );
    };
    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMove);
  }, [uniforms]);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      materialRef.current.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
    }
  });

  // Switch Material based on mode
  const shaderData = useMemo(() => {
    switch (currentMode) {
      case 'silk':
        return {
          vert: liquidSilkShader.vertexShader,
          frag: liquidSilkShader.fragmentShader
        };
      case 'molten':
        return {
          vert: moltenMaterialShader.vertexShader,
          frag: moltenMaterialShader.fragmentShader
        };
      default:
        return {
          vert: fluidVertexShader,
          frag: fluidFragmentShader
        };
    }
  }, [currentMode]);

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        key={currentMode} // Force re-materialize on mode switch
        ref={materialRef}
        vertexShader={shaderData.vert}
        fragmentShader={shaderData.frag}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
      />
    </mesh>
  );
}

export default function BackgroundHub() {
  return (
    <div 
      id="global-background-hub"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw', 
        height: '100vh', 
        zIndex: -1,
        pointerEvents: 'none',
        background: '#000',
        overflow: 'hidden'
      }}
    >
      <Canvas 
        orthographic 
        dpr={[1, 2]}
        camera={{ position: [0, 0, 1], zoom: 1 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance"
        }}
        style={{ width: '100vw', height: '100vh' }}
      >
        <OrthographicCamera makeDefault left={-1} right={1} top={1} bottom={-1} near={0.1} far={10} position={[0, 0, 1]} />
        <BackgroundMesh />
      </Canvas>
    </div>
  );
}
