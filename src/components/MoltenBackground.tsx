import { useFrame, useThree, Canvas } from '@react-three/fiber';
import { useRef, useMemo, useEffect } from 'react';
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
    uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
  }), []);

  useEffect(() => {
    // Force initial resolution update on mount to avoid 323px-width bug
    if (materialRef.current) {
      materialRef.current.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
    }
    // 1. EVENT LISTENING LOGIC (FINAL DIRECTIVE)
    // Universal standard that captures both mouse movement and finger touch simultaneously
    const updateMouse = (e: PointerEvent) => {
      // 2. COORDINATE MAPPING (FINAL DIRECTIVE)
      const x = e.clientX / window.innerWidth;
      const y = 1.0 - (e.clientY / window.innerHeight);
      
      if (materialRef.current) {
        // Direct update for better responsiveness
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
      // Update time
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      
      // Update resolution
      materialRef.current.uniforms.uResolution.value.set(size.width, size.height);
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
        transparent
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
      pointerEvents: 'none', // Ensure it doesn't block interactions,
      touchAction: 'none'    // 3. CSS OVERRIDE (FINAL DIRECTIVE)
    }}>
      <Canvas
        key="molten-canvas-global"
        camera={{ position: [0, 0, 1] }}
        dpr={[1, 2]} // High-resolution handle
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
      >
        <MoltenMesh />
      </Canvas>
    </div>
  );
}
