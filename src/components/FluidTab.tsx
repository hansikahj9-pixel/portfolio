import { useRef, useMemo, useState } from 'react';
import { useFrame, useThree, Canvas } from '@react-three/fiber';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import { fluidVertexShader, gradientFluidFragmentShader } from '../shaders/fluidShader';

interface FluidTabProps {
  to: string;
  label: string;
  colors: [string, string, string];
}

function FluidMesh({ colors }: { colors: [string, string, string] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const mouseRef = useRef(new THREE.Vector2(0.5, 0.5));
  const smoothMouse = useRef(new THREE.Vector2(0.5, 0.5));
  const { size, viewport } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uColor1: { value: new THREE.Color(colors[0]) },
      uColor2: { value: new THREE.Color(colors[1]) },
      uColor3: { value: new THREE.Color(colors[2]) },
    }),
    [colors]
  );

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.ShaderMaterial;
    mat.uniforms.uTime.value = clock.getElapsedTime();
    mat.uniforms.uResolution.value.set(size.width, size.height);

    smoothMouse.current.lerp(mouseRef.current, 0.1);
    mat.uniforms.uMouse.value.copy(smoothMouse.current);
  });

  const handlePointerMove = (e: any) => {
    const x = e.uv.x;
    const y = e.uv.y;
    mouseRef.current.set(x, y);
  };

  return (
    <mesh 
      ref={meshRef} 
      onPointerMove={handlePointerMove}
      scale={[viewport.width, viewport.height, 1]}
    >
      <planeGeometry />
      <shaderMaterial
        vertexShader={fluidVertexShader}
        fragmentShader={gradientFluidFragmentShader}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  );
}

export default function FluidTab({ to, label, colors }: FluidTabProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link 
      to={to} 
      className={`fluid-tab-box ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ isolation: 'isolate' }}
    >
      <div 
        className="fluid-tab-canvas-wrapper" 
        style={{ 
          position: 'absolute', 
          inset: 0, 
          zIndex: 1, 
          pointerEvents: 'none',
          opacity: 1 // Force full opacity
        }}
      >
        <Canvas
          orthographic
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          style={{ width: '100%', height: '100%' }}
        >
          <FluidMesh colors={colors} />
        </Canvas>
      </div>
      <span className="fluid-tab-label">{label}</span>
      <div className="fluid-tab-border" />
    </Link>
  );
}
