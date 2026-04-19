import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { fluidVertexShader, fluidFragmentShader } from '../shaders/fluidShader';

export default function FluidBackground() {
  const meshRef = useRef<THREE.Mesh>(null);
  const mouseRef = useRef(new THREE.Vector2(0.5, 0.5));
  const smoothMouse = useRef(new THREE.Vector2(0.5, 0.5));
  const { size } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uColor: { value: new THREE.Color('#C3C1B9') },
    }),
    [size.width, size.height]
  );

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.ShaderMaterial;
    mat.uniforms.uTime.value = clock.getElapsedTime();
    mat.uniforms.uResolution.value.set(size.width, size.height);

    smoothMouse.current.lerp(mouseRef.current, 0.05);
    mat.uniforms.uMouse.value.copy(smoothMouse.current);
  });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current.set(
        e.clientX / window.innerWidth,
        1.0 - e.clientY / window.innerHeight
      );
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <mesh ref={meshRef} frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={fluidVertexShader}
        fragmentShader={fluidFragmentShader}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}
