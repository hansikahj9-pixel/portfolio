import { useFrame, Canvas } from '@react-three/fiber';
import { useRef, useMemo, useEffect, useState } from 'react';
import { OrthographicCamera } from '@react-three/drei';
import * as THREE from 'three';
import { liquidSilkShader } from '../shaders/liquidSilkShader';


function LiquidSilkMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  // Use a fixed resolution for state to avoid 0px calculations
  const [resolution, setResolution] = useState(() => new THREE.Vector2(window.innerWidth, window.innerHeight));

  useEffect(() => {
    const handleResize = () => {
      setResolution(new THREE.Vector2(window.innerWidth, window.innerHeight));
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uResolution: { value: resolution }
  }), []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      
      // Force update resolution from window to bypass layout collapse
      materialRef.current.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
      
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
      id="liquid-silk-container"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw', 
        height: '100vh', 
        zIndex: -1, // Sits behind content but ahead of global app background if any
        pointerEvents: 'none',
        background: '#08050f',
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
        style={{ 
          width: '100vw', 
          height: '100vh', 
          display: 'block'
        }}
        onCreated={({ gl }) => {
          gl.setClearColor('#08050f', 1);
        }}
      >
        <OrthographicCamera makeDefault left={-1} right={1} top={1} bottom={-1} near={0.1} far={10} position={[0, 0, 1]} />
        <LiquidSilkMesh />
      </Canvas>
    </div>
  );
}


