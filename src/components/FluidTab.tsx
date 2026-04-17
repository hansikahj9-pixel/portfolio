import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame, useThree, Canvas } from '@react-three/fiber';
import { View, OrthographicCamera } from '@react-three/drei';
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
  const { size } = useThree();

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

  // Sync resolution during first few frames
  useEffect(() => {
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.ShaderMaterial;
      mat.uniforms.uResolution.value.set(size.width, size.height);
    }
  }, [size.width, size.height]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.ShaderMaterial;
    mat.uniforms.uTime.value = clock.getElapsedTime();

    smoothMouse.current.lerp(mouseRef.current, 0.1);
    mat.uniforms.uMouse.value.copy(smoothMouse.current);
  });

  return (
    <mesh 
      ref={meshRef} 
      onPointerMove={(e) => {
        if (e.uv) {
          mouseRef.current.set(e.uv.x, e.uv.y);
        }
      }}
    >
      <planeGeometry args={[2, 2]} />
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
          zIndex: 0, 
          pointerEvents: 'none'
        }}
      >
        <View style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
          <OrthographicCamera makeDefault left={-1} right={1} top={1} bottom={-1} near={0} far={1} position={[0, 0, 1]} />
          <FluidMesh colors={colors} />
        </View>
      </div>
      <span className="fluid-tab-label" style={{ position: 'relative', zIndex: 10 }}>{label}</span>
      <div className="fluid-tab-border" />
    </Link>
  );
}
