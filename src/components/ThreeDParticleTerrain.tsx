import { useFrame, Canvas, useThree } from '@react-three/fiber';
import { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

// ── CUSTOM SHADERS FOR EXACT COLOR, CURVES, AND CIRCULAR 3D MOTION ──

const particleVertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  varying vec3 vColor;
  
  void main() {
    vec3 pos = position;
    
    // 1. Calculate Polar Coordinates for Circular Flow
    float r = length(pos.xy);
    float theta = atan(pos.y, pos.x);
    
    // 2. Circular 3D Wave Dynamics
    // Main circular wave spinning and rippling outward
    float wave1 = sin(r * 0.28 - uTime * 0.95 + theta * 1.5);
    
    // Counter-rotating harmonic wave for natural organic contours
    float wave2 = cos(r * 0.12 + uTime * 0.45 - theta * 2.5);
    
    // Fine-scale undulating detail
    float wave3 = sin(pos.x * 0.08 + pos.y * 0.08 + uTime * 0.35);
    
    // Interactive mouse displacement (local ripple)
    float distToMouse = distance(pos.xy, uMouse * 30.0 - vec2(15.0));
    float mouseForce = smoothstep(8.0, 0.0, distToMouse) * 1.5;
    float mouseWave = sin(distToMouse * 0.5 - uTime * 2.0) * mouseForce;
    
    // Combine waves for a complex height terrain (3D depth)
    float height = (wave1 * 2.2 + wave2 * 0.8 + wave3 * 0.4 + mouseWave) * 0.85;
    pos.z = height;
    
    // 3. WebGL ModelView Projection
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // 4. Point Size Depth Attenuation (Spherical sizing based on distance)
    gl_PointSize = clamp(13.0 * (320.0 / max(0.1, -mvPosition.z)), 1.0, 64.0);
    
    // 5. Precise Color Mapping matching the attached gradient image
    float normHeight = (height + 2.5) / 5.0; // Range [0, 1]
    float normR = r / 22.0;                 // Normalized radius
    
    // Palette Definitions
    vec3 colPink = vec3(0.92, 0.25, 0.82);   // Vibrant Magenta / Purple-Pink
    vec3 colPurple = vec3(0.68, 0.20, 0.95); // Neon Violet / Indigo-Purple
    vec3 colGold = vec3(0.96, 0.68, 0.28);   // Warm Amber / Golden Orange
    vec3 colMint = vec3(0.38, 0.88, 0.62);   // Soft Mint Green / Pale Teal
    vec3 colIndigo = vec3(0.12, 0.08, 0.48); // Deep valley shadows
    
    // Base mix: height deforms from deep Indigo (shadow) to bright Pink (crests)
    vec3 color = mix(colIndigo, colPink, smoothstep(0.08, 0.82, normHeight));
    
    // Swirling Gold/Amber on the mid-slope curves
    float goldenSlope = sin(r * 0.20 - uTime * 0.7 + theta * 2.0) * 0.5 + 0.5;
    color = mix(color, colGold, goldenSlope * 0.52 * (1.0 - smoothstep(0.75, 1.0, normHeight)));
    
    // Blend Neon Purple into transitional regions
    float purpleFactor = smoothstep(0.25, 0.65, normHeight);
    color = mix(color, colPurple, purpleFactor * 0.35);
    
    // Mint Green accentuating the outer edges and lower quadrants (exactly like the reference image)
    float edgeFactor = smoothstep(0.15, 0.95, normR);
    float bottomBias = smoothstep(4.0, -14.0, pos.y);
    color = mix(color, colMint, edgeFactor * bottomBias * 0.88);
    
    vColor = color;
  }
`;

const particleFragmentShader = `
  varying vec3 vColor;
  
  void main() {
    // Transform square billboard into soft glowing circle
    vec2 temp = gl_PointCoord - vec2(0.5);
    float dist = length(temp);
    
    // Discard pixels outside boundary
    if (dist > 0.5) {
      discard;
    }
    
    // Radial glow feathering
    float alpha = smoothstep(0.5, 0.08, dist);
    
    // Bright white-hot core in the center of the particle
    float core = smoothstep(0.18, 0.0, dist) * 0.65;
    vec3 finalColor = mix(vColor, vec3(1.0), core);
    
    gl_FragColor = vec4(finalColor, alpha * 0.90);
  }
`;

function ParticleGridMesh() {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree();

  // 1. Generate High-Density Grid Geometry
  const positions = useMemo(() => {
    const gridSize = 180; // 180 x 180 points = 32,400 particles
    const totalCount = gridSize * gridSize;
    const posArray = new Float32Array(totalCount * 3);
    
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const u = i / (gridSize - 1);
        const v = j / (gridSize - 1);
        
        // Spread coordinates evenly across 2D plane (x: -16 to 16, y: -16 to 16)
        const x = (u - 0.5) * 32.0;
        const y = (v - 0.5) * 32.0;
        const z = 0.0;
        
        const idx = (i * gridSize + j) * 3;
        posArray[idx] = x;
        posArray[idx + 1] = y;
        posArray[idx + 2] = z;
      }
    }
    return posArray;
  }, []);

  // 2. Uniforms Setup
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.0, 0.0) },
    uResolution: { value: new THREE.Vector2(1, 1) }
  }), []);

  // 3. Dynamic Mouse Tracking
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      // Normalize mouse positions to range [-1.0, 1.0]
      const targetX = (e.clientX / window.innerWidth) * 2.0 - 1.0;
      const targetY = (1.0 - (e.clientY / window.innerHeight)) * 2.0 - 1.0;
      
      // Smoothly interpolate the mouse uniform values
      gsap.to(uniforms.uMouse.value, {
        x: targetX,
        y: targetY,
        duration: 0.8,
        ease: 'power2.out'
      });
    };
    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMove);
  }, [uniforms]);

  // 4. Per-Frame Shader Updates
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      materialRef.current.uniforms.uResolution.value.set(size.width, size.height);
    }
    
    // Slow rotational drift for extra 3D parallax depth
    if (pointsRef.current) {
      pointsRef.current.rotation.z = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={particleVertexShader}
        fragmentShader={particleFragmentShader}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function ThreeDParticleTerrain() {
  return (
    <div className="td-canvas-wrapper" style={{ pointerEvents: 'auto' }}>
      <Canvas
        // Camera positioned at a 3D perspective looking down the terrain slope
        camera={{ position: [0, -11, 12], fov: 55, near: 0.1, far: 50 }}
        dpr={Math.min(window.devicePixelRatio, 2)}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance"
        }}
        style={{ width: '100vw', height: '100vh', background: '#000000' }}
      >
        <ParticleGridMesh />
      </Canvas>
    </div>
  );
}
