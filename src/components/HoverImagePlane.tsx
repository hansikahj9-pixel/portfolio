import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { waveVertexShader, waveFragmentShader } from '../shaders/waveShader';

interface HoverImagePlaneProps {
  visible: boolean;
  mouseX: number;
  mouseY: number;
  color: string;
}

export default function HoverImagePlane({
  visible,
  mouseX,
  mouseY,
  color,
}: HoverImagePlaneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const targetPos = useRef(new THREE.Vector3(0, 0, 0));
  const currentOpacity = useRef(0);
  const [texture] = useState(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 640;
    const ctx = canvas.getContext('2d')!;

    // Gradient background
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, color);
    grad.addColorStop(0.5, '#1a1a1a');
    grad.addColorStop(1, color);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add some abstract shapes
    ctx.globalAlpha = 0.15;
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      ctx.arc(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        Math.random() * 120 + 40,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = color;
      ctx.fill();
    }

    // Lines
    ctx.globalAlpha = 0.08;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * (canvas.height / 20));
      ctx.lineTo(canvas.width, i * (canvas.height / 20) + Math.random() * 40);
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  });

  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uOpacity: { value: 0 },
    }),
    [texture]
  );

  useFrame(({ clock, viewport }) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.ShaderMaterial;
    mat.uniforms.uTime.value = clock.getElapsedTime();

    // Convert screen coords to R3F world position
    const x = (mouseX / window.innerWidth) * 2 - 1;
    const y = -(mouseY / window.innerHeight) * 2 + 1;
    targetPos.current.set(
      (x * viewport.width) / 2,
      (y * viewport.height) / 2,
      0
    );

    // Smooth position
    meshRef.current.position.lerp(targetPos.current, 0.1);

    // Smooth opacity
    const targetOpacity = visible ? 1 : 0;
    currentOpacity.current += (targetOpacity - currentOpacity.current) * 0.08;
    mat.uniforms.uOpacity.value = currentOpacity.current;

    // Update mouse UV for shader
    mat.uniforms.uMouse.value.set(
      mouseX / window.innerWidth,
      1.0 - mouseY / window.innerHeight
    );

    meshRef.current.visible = currentOpacity.current > 0.01;
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[3, 3.75, 32, 32]} />
      <shaderMaterial
        vertexShader={waveVertexShader}
        fragmentShader={waveFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
