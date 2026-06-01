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
    
    // Interactive mouse/touch displacement (Tactile Cursor-Centric Rising Hills & Ripples)
    // uMouse is normalized [-1.0, 1.0]. We scale it to match the pos.xy range [-16.0, 16.0].
    float distToMouse = distance(pos.xy, uMouse * 16.0);
    
    // Smooth tapering influence based on distance from the cursor (radius = 6.5 units)
    float influence = smoothstep(6.5, 0.0, distToMouse);
    
    // The interactive curves rise up to 2.8 units directly under the cursor/touch
    float mouseRise = influence * 2.8;
    
    // Smooth concentric ripple propagating outward from the cursor
    float mouseRipple = sin(distToMouse * 1.2 - uTime * 3.5) * 0.52 * influence;
    
    // Combine waves for a complex height terrain (3D depth) with active mouse/touch deformation
    float height = (wave1 * 2.2 + wave2 * 0.8 + wave3 * 0.4) * 0.85 + mouseRise + mouseRipple;
    pos.z = height;
    
    // 3. WebGL ModelView Projection
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // 4. Point Size Depth Attenuation (Refined multiplier for distinct elegant points)
    gl_PointSize = clamp(2.0 * (320.0 / max(0.1, -mvPosition.z)), 1.0, 16.0);
    
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

// ── CUSTOM SHADERS FOR ORGANIC IRIDESCENT METALLIC CHROMATIC TORUS ──

const torusVertexShader = `
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec3 vWorldPosition;
  
  void main() {
    // 3D Organic Fluid deformation on Torus geometry
    // Calculate polar angle on the horizontal plane of the torus tube
    float angle = atan(position.y, position.x);
    
    // Smooth wavy deformation based on trigonometric harmonics and time
    float wave = sin(angle * 3.0 + uTime * 0.95) * 0.24 
               + cos(position.z * 2.5 - uTime * 0.7) * 0.16
               + sin(position.x * 0.6 + position.y * 0.6 + uTime * 0.5) * 0.12;
               
    // Displace vertex along its local normal vector to shape irregular curves
    vec3 displaced = position + normal * wave * 0.68;
    
    // standard vertex projection
    vNormal = normalize(normalMatrix * normal);
    vec4 worldPos = modelMatrix * vec4(displaced, 1.0);
    vWorldPosition = worldPos.xyz;
    vViewPosition = cameraPosition - worldPos.xyz;
    
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const torusFragmentShader = `
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec3 vWorldPosition;
  uniform float uTime;
  
  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);
    
    // 1. Fresnel factor: 1.0 when viewing edge-on (grazing), 0.0 when viewing head-on
    float fresnel = pow(1.0 - max(0.0, dot(normal, viewDir)), 2.8);
    
    // 2. Iridescent/holographic color shift calculations matching metallic glass
    float shift = uTime * 0.32 + normal.x * 0.45 + normal.y * 0.45 + vWorldPosition.z * 0.06;
    
    // Palette matching the user's color system & iridescent screenshot
    vec3 colPink = vec3(0.92, 0.25, 0.82);   // Vibrant Magenta
    vec3 colPurple = vec3(0.68, 0.20, 0.95); // Neon Violet / Deep Purple
    vec3 colGold = vec3(0.96, 0.68, 0.28);   // Warm Golden Orange / Pink-Gold
    vec3 colMint = vec3(0.38, 0.88, 0.62);   // Soft Mint Green / Pale Teal
    vec3 colBlue = vec3(0.20, 0.52, 0.95);   // Cyan / Sky Blue (Chromatic reflective glass base)
    
    // Smooth multi-layered color blending shifts
    vec3 baseColor = mix(colBlue, colPink, sin(shift * 1.2) * 0.5 + 0.5);
    baseColor = mix(baseColor, colPurple, cos(shift * 1.8) * 0.4 + 0.4);
    baseColor = mix(baseColor, colMint, fresnel * 0.72);
    baseColor = mix(baseColor, colGold, (1.0 - fresnel) * 0.28);
    
    // 3. Specular highlights for glassmorphic/liquid metallic gloss
    vec3 lightDir = normalize(vec3(0.5, 1.5, 0.8)); // Top-front light
    vec3 halfDir = normalize(lightDir + viewDir);
    float spec = pow(max(0.0, dot(normal, halfDir)), 32.0);
    vec3 specularHighlight = vec3(1.0) * spec * 0.92;
    
    // 4. Rim light glowing edges
    float rim = pow(1.0 - max(0.0, dot(normal, viewDir)), 4.0);
    vec3 rimLight = vec3(0.98, 0.78, 0.98) * rim * 0.45;
    
    // Composite final color
    vec3 finalColor = baseColor + specularHighlight + rimLight;
    
    // Glassmorphic transparency: Higher opacity at grazing edges, translucent center
    float alpha = smoothstep(0.04, 0.88, fresnel) * 0.82 + 0.18;
    
    gl_FragColor = vec4(finalColor, alpha);
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

  // 3. Dynamic Mouse & Touch Tracking
  useEffect(() => {
    const handleMove = (x: number, y: number) => {
      // Normalize client coordinates to range [-1.0, 1.0]
      const targetX = (x / window.innerWidth) * 2.0 - 1.0;
      const targetY = (1.0 - (y / window.innerHeight)) * 2.0 - 1.0;
      
      // Smoothly interpolate the mouse uniform values
      gsap.to(uniforms.uMouse.value, {
        x: targetX,
        y: targetY,
        duration: 0.8,
        ease: 'power2.out'
      });
    };

    const onMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
    };
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

interface LiquidTorusProps {
  position: [number, number, number];
  scale: [number, number, number];
  phase: number;
}

function LiquidTorus({ position, scale, phase }: LiquidTorusProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // 1. Torus Uniforms
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
  }), []);

  // 2. Continuous float, wobble, and rotation per-frame updates
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = time;
    }
    
    if (meshRef.current) {
      // Gentle floating animation
      meshRef.current.position.y = position[1] + Math.sin(time * 0.52 + phase) * 0.32;
      meshRef.current.position.x = position[0] + Math.cos(time * 0.38 + phase) * 0.22;
      
      // Wobble aligned to face camera looking down from [0, -11, 12] (approx -0.74rad pitch)
      meshRef.current.rotation.x = -0.74 + Math.sin(time * 0.25 + phase) * 0.12;
      meshRef.current.rotation.y = Math.cos(time * 0.20 + phase) * 0.12;
      meshRef.current.rotation.z = time * 0.04 + phase; // Slow rotational spin
    }
  });

  return (
    <mesh ref={meshRef} scale={scale}>
      {/* 
        Torus Geometry:
        - Inner opening / radius is maximized to create ample space in the center for text/images.
        - Radius = 4.2 (makes it 10x larger than in reference image)
        - Tube Radius = 0.52 (relatively thin tube for incredibly wide center space)
        - Segments: high segments for ultimate smooth rendering
      */}
      <torusGeometry args={[4.2, 0.52, 64, 128]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={torusVertexShader}
        fragmentShader={torusFragmentShader}
        uniforms={uniforms}
        transparent={true}
        depthWrite={true}
        side={THREE.DoubleSide}
      />
    </mesh>
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
        
        {/* ── 3 monumental floating liquid iridescent toruses covering ~80% of the screen ── */}
        <LiquidTorus position={[-4.2, 3.2, -1.0]} scale={[0.95, 0.95, 0.95]} phase={0.0} />
        <LiquidTorus position={[4.4, -0.6, 0.5]} scale={[1.2, 1.2, 1.2]} phase={2.1} />
        <LiquidTorus position={[-3.8, -4.2, 1.2]} scale={[0.9, 0.9, 0.9]} phase={4.5} />
      </Canvas>
    </div>
  );
}
