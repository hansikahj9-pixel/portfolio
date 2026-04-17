import { useRef, useMemo, useState } from 'react';
import { useFrame, useThree, Canvas } from '@react-three/fiber';
import { OrthographicCamera } from '@react-three/drei';
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
      uResolution: { value: new THREE.Vector2(Math.max(size.width, 1.0), Math.max(size.height, 1.0)) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uColor1: { value: new THREE.Color(colors[0]) },
      uColor2: { value: new THREE.Color(colors[1]) },
      uColor3: { value: new THREE.Color(colors[2]) },
    }),
    [colors]
  );

  useFrame(({ clock, size }) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.ShaderMaterial;
    mat.uniforms.uTime.value = clock.getElapsedTime();
    mat.uniforms.uResolution.value.set(
      Math.max(size.width, 1.0),
      Math.max(size.height, 1.0)
    );

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
        {/* Direct Canvas renders immediately without global dependency */}
        <Canvas 
          style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
        >
          <OrthographicCamera makeDefault left={-1} right={1} top={1} bottom={-1} near={0} far={1} position={[0, 0, 1]} />
          <FluidMesh colors={colors} />
        </Canvas>
      </div>
      <span className="fluid-tab-label" style={{ position: 'relative', zIndex: 10 }}>{label}</span>
      <div className="fluid-tab-border" />
    </Link>
  );
}
