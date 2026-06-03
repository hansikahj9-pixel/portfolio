import { useFrame, Canvas, useThree } from '@react-three/fiber';
import { useRef, useMemo, useEffect, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { Html } from '@react-three/drei';

// Import Generated Inspiration Images for Nordic Knots Moodboard
import nordicMain from '../assets/nordic_moodboard_main.png';
import nordicKnots from '../assets/nordic_knots_inspiration.png';
import nordicMythology from '../assets/nordic_mythology_inspiration.png';

const nordicSlides = [
  {
    title: "NORDIC KNOTS",
    subtitle: "THE INSPIRATION",
    desc: "A mini womenswear collection bridging ancient heritage and modern silhouettes. The garments explore the infinite flow of Nordic knots and the ethereal, structured forms of Norse mythology.",
    image: nordicMain
  },
  {
    title: "THE TEXTILE CONCEPT",
    subtitle: "NORDIC KNOTS",
    desc: "An exploration of endless interlacing lines, representing the threads of fate spun by the Norns. Heavy, tactile fabrics are crafted to mimic the physical curves of ancient runic stone carvings.",
    image: nordicKnots
  },
  {
    title: "THE SILHOUETTE CONCEPT",
    subtitle: "NORSE MYTHOLOGY",
    desc: "Draped, protective, and sculptural silhouettes inspired by the cosmic structure of Yggdrasil, armor plating of Valkyries, and the fluid, mist-shrouded landscapes of the northern realms.",
    image: nordicMythology
  }
];

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
    // uMouse is normalized [-1.0, 1.0]. We scale it to match the wider pos.xy range [-24.0, 24.0].
    float distToMouse = distance(pos.xy, uMouse * 24.0);
    
    // Smooth tapering influence based on distance from the cursor (radius = 8.5 units)
    float influence = smoothstep(8.5, 0.0, distToMouse);
    
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
    float normR = r / 30.0;                 // Normalized radius
    
    // Palette Definitions
    vec3 colPink = vec3(0.92, 0.25, 0.82);   // Vibrant Magenta / Purple-Pink
    vec3 colPurple = vec3(0.68, 0.20, 0.95); // Neon Violet / Indigo-Purple
    vec3 colGold = vec3(0.96, 0.68, 0.28);   // Warm Amber / Golden Orange
    vec3 colMint = vec3(0.38, 0.88, 0.62);   // Soft Mint Green / Pale Teal
    vec3 colIndigo = vec3(0.12, 0.08, 0.48); // Deep valley shadows
    
    // 50% Pink reduction replaced with Green, Silver, and White
    vec3 colSilver = vec3(0.72, 0.72, 0.75); // Silver
    vec3 colWhite = vec3(0.98, 0.98, 1.00);  // White
    vec3 colGreen = vec3(0.28, 0.85, 0.52);  // Vibrant Green
    vec3 colGreenSilverWhite = mix(colGreen, mix(colSilver, colWhite, 0.5), 0.5);
    vec3 colPinkReplaced = mix(colPink, colGreenSilverWhite, 0.5);
    
    // Base mix: height deforms from deep Indigo (shadow) to the replaced Pink (crests)
    vec3 color = mix(colIndigo, colPinkReplaced, smoothstep(0.08, 0.82, normHeight));
    
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
    
    // Decreased background animation opacity by an additional 40% (alpha * 0.28 instead of 0.48) so shapes are highly visible
    gl_FragColor = vec4(finalColor, alpha * 0.28);
  }
`;

// ── CUSTOM SHADERS FOR ORGANIC IRIDESCENT METALLIC CHROMATIC TORUS ──

const torusVertexShader = `
  uniform float uPhase;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec3 vWorldPosition;
  
  void main() {
    // 3D Organic Fluid deformation on Torus geometry (Static wavy shape)
    float angle = atan(position.y, position.x);
    
    // Wavy deformation using uPhase for distinct static organic contours per mesh
    float wave = sin(angle * 3.0 + uPhase) * 0.28 
               + cos(position.z * 2.5 - uPhase) * 0.18
               + sin(position.x * 0.6 + position.y * 0.6 + uPhase) * 0.14;
               
    // Displace vertex along its local normal vector to shape irregular static curves
    vec3 displaced = position + normal * wave * 0.72;
    
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
  uniform float uPhase;
  
  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);
    
    // 1. Fresnel factor: 1.0 when viewing edge-on (grazing), 0.0 when viewing head-on
    float fresnel = pow(1.0 - max(0.0, dot(normal, viewDir)), 3.0);
    
    // 2. High-Contrast Dark Chrome mapping
    // Creates liquid metallic silver and space-gray banding
    float chromeBanding = sin(normal.x * 2.8 + normal.y * 2.8 + normal.z * 1.5) * 0.5 + 0.5;
    
    // Core metallic colors
    vec3 colCharcoal = vec3(0.08, 0.08, 0.09); // Deep dark space-gray shadow
    vec3 colSilver = vec3(0.72, 0.72, 0.75);   // Polished liquid silver
    
    // Subtle holographic color shift in grazing transition areas (combines soft pink-violet & teal-cyan)
    vec3 colHoloPink = vec3(0.72, 0.35, 0.72);
    vec3 colHoloBlue = vec3(0.35, 0.58, 0.82);
    vec3 holoColor = mix(colHoloBlue, colHoloPink, sin(normal.z * 4.0 + uPhase) * 0.5 + 0.5);
    
    // Base mix: High contrast chrome banding
    vec3 baseColor = mix(colCharcoal, colSilver, chromeBanding);
    
    // Blend subtle holographic iridescence into the grazing Fresnel margins (dark chrome effect)
    baseColor = mix(baseColor, holoColor, fresnel * 0.38);
    
    // 3. Specular highlights for shiny metallic glass surface
    vec3 lightDir = normalize(vec3(0.5, 1.6, 0.9)); // Top-front sharp light source
    vec3 halfDir = normalize(lightDir + viewDir);
    float spec = pow(max(0.0, dot(normal, halfDir)), 48.0); // High power shininess
    
    // Extremely bright, solid white crest highlights matching the user screenshot
    vec3 specularHighlight = vec3(1.0) * spec * 1.65;
    
    // 4. Rim glow on edge boundaries
    float rim = pow(1.0 - max(0.0, dot(normal, viewDir)), 4.0);
    vec3 rimGlow = vec3(0.9, 0.9, 1.0) * rim * 0.32;
    
    // Final Composite
    vec3 finalColor = baseColor + specularHighlight + rimGlow;
    
    // 100% OPAQUE (Solid, no transparency)
    gl_FragColor = vec4(finalColor, 1.0);
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
        
        // Spread coordinates evenly across a wider 2D plane (x: -24 to 24, y: -24 to 24) to fill the camera view
        const x = (u - 0.5) * 48.0;
        const y = (v - 0.5) * 48.0;
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
  rotation?: [number, number, number];
  onClick?: () => void;
  label: string;
}

function LiquidTorus({ 
  position, 
  scale, 
  phase, 
  rotation = [-0.74, 0, 0],
  onClick,
  label
}: LiquidTorusProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const [hovered, setHovered] = useState(false);

  // 1. Torus Uniforms (Static phase config)
  const uniforms = useMemo(() => ({
    uPhase: { value: phase },
  }), [phase]);

  // Set the mouse cursor to a pointer when hovering over a clickable torus
  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [hovered]);

  return (
    <mesh 
      ref={meshRef} 
      position={position}
      scale={scale}
      rotation={rotation}
      onClick={onClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => {
        setHovered(false);
      }}
    >
      {/* 
        Torus Geometry:
        - Torus radius increased to 5.8, tube radius 0.95
        - Inside radius = 5.8 - 0.95 = 4.85 (a 36.6% increase over 3.55, matching the 35% requirement)
        - Outer radius = 5.8 + 0.95 = 6.75
      */}
      <torusGeometry args={[5.8, 0.95, 64, 128]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={torusVertexShader}
        fragmentShader={torusFragmentShader}
        uniforms={uniforms}
        transparent={false}
        depthWrite={true}
        depthTest={true}
        side={THREE.DoubleSide}
      />
      {/* Centered clean geometric sans-serif label inside the torus hole */}
      <Html center distanceFactor={14}>
        <div className={`cyber-hud-label ${hovered ? 'hovered' : ''}`}>
          <span className="hud-title">{label}</span>
        </div>
      </Html>
    </mesh>
  );
}


const cyberStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;700;800&display=swap');

  .cyber-hud-label {
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    pointer-events: none;
    user-select: none;
    text-align: center;
    width: 320px;
    padding: 10px;
    transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  }
  .cyber-hud-label.hovered {
    transform: scale(1.12);
  }
  .hud-title {
    font-size: 1.55rem;
    font-weight: 800;
    letter-spacing: -0.01em;
    text-transform: uppercase;
    color: #ffffff;
    text-shadow: none;
    transition: transform 0.4s ease;
  }
  .cyber-hud-label.hovered .hud-title {
    transform: scale(1.05);
  }

  /* Centered Glassmorphic Modal styles */
  .cyber-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.15);
    z-index: 999;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  }
  .cyber-modal-overlay.active {
    opacity: 1;
    pointer-events: auto;
  }
  .cyber-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0.96);
    width: 85vw;
    height: 85vh;
    max-width: 1600px;
    max-height: 1000px;
    background: rgba(217, 217, 217, 0.20);
    backdrop-filter: blur(3px);
    -webkit-backdrop-filter: blur(3px);
    border: 1px solid rgba(255, 255, 255, 0.35);
    border-radius: 40px;
    box-shadow: 0 30px 70px rgba(0, 0, 0, 0.35);
    z-index: 1000;
    display: flex;
    flex-direction: column;
    padding: 40px;
    box-sizing: border-box;
    opacity: 0;
    pointer-events: none;
    transition: transform 0.45s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.45s ease;
  }
  @media (max-width: 768px) {
    .cyber-modal {
      width: 92vw;
      height: 82vh;
      padding: 30px;
      border-radius: 20px;
    }
  }
  .cyber-modal.active {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
    pointer-events: auto;
  }
  .cyber-modal-close {
    position: absolute;
    top: 30px;
    right: 30px;
    background: transparent;
    border: none;
    color: #ffffff;
    font-size: 1.8rem;
    cursor: pointer;
    line-height: 1;
    transition: all 0.3s ease;
    border-radius: 50%;
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .cyber-modal-close:hover {
    background: rgba(255, 255, 255, 0.15);
  }
  .cyber-modal-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    color: #ffffff;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .cyber-modal-title {
    font-size: 2.2rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    text-transform: uppercase;
    color: #ffffff;
    border-bottom: 1px solid rgba(255, 255, 255, 0.12);
    padding-bottom: 15px;
    margin-bottom: 15px;
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
  }
  .cyber-modal-subtitle {
    font-size: 0.8rem;
    letter-spacing: 0.18em;
    color: #00ffaa;
    font-weight: 700;
    text-transform: uppercase;
    margin-bottom: 30px;
    text-shadow: 0 0 5px rgba(0, 255, 170, 0.3);
  }
  .cyber-modal-body {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px dashed rgba(255, 255, 255, 0.15);
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.03);
  }
  .cyber-modal-placeholder {
    font-size: 0.8rem;
    color: #8c8c95;
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
  }

  /* Nordic Custom Modal Styling */
  .nordic-modal-content {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
    gap: 40px;
    position: relative;
    box-sizing: border-box;
  }
  @media (max-width: 1024px) {
    .nordic-modal-content {
      flex-direction: column-reverse;
      gap: 20px;
      overflow-y: auto;
    }
  }
  
  .nordic-left-pane {
    flex: 1.2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    padding-right: 20px;
    z-index: 2;
  }
  @media (max-width: 1024px) {
    .nordic-left-pane {
      flex: none;
      padding-right: 0;
      padding-bottom: 20px;
    }
  }

  .nordic-right-pane {
    flex: 1.5;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 2;
    overflow: hidden;
    border-radius: 24px;
    border: 1px solid rgba(255, 255, 255, 0.25);
    background: rgba(0, 0, 0, 0.2);
    box-shadow: inset 0 0 40px rgba(0, 0, 0, 0.4);
    aspect-ratio: 16/10;
  }
  @media (max-width: 1024px) {
    .nordic-right-pane {
      width: 100%;
      height: 300px;
      flex: none;
      aspect-ratio: auto;
    }
  }

  .nordic-mood-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.95;
    animation: nordicFadeIn 0.6s cubic-bezier(0.25, 1, 0.5, 1) forwards;
  }
  @keyframes nordicFadeIn {
    from {
      opacity: 0;
      transform: scale(1.04);
    }
    to {
      opacity: 0.95;
      transform: scale(1);
    }
  }

  .nordic-rune-bg {
    position: absolute;
    top: 50%;
    left: 5%;
    transform: translateY(-50%);
    font-size: 18rem;
    font-weight: 800;
    color: rgba(255, 255, 255, 0.025);
    font-family: monospace, serif;
    pointer-events: none;
    user-select: none;
    z-index: 1;
    letter-spacing: -0.1em;
  }

  .nordic-title-wrap {
    margin-bottom: 25px;
    border-left: 3px solid rgba(255, 255, 255, 0.3);
    padding-left: 20px;
    position: relative;
  }

  .nordic-slide-subtitle {
    font-size: 0.85rem;
    letter-spacing: 0.3em;
    color: #00ffaa;
    text-transform: uppercase;
    font-weight: 700;
    margin-bottom: 6px;
    text-shadow: 0 0 10px rgba(0, 255, 170, 0.25);
  }

  .nordic-runic-divider {
    font-family: monospace, serif;
    font-size: 0.75rem;
    letter-spacing: 0.6em;
    color: rgba(255, 255, 255, 0.35);
    margin: 12px 0;
    user-select: none;
    pointer-events: none;
    text-shadow: 0 0 5px rgba(255,255,255,0.1);
  }

  .nordic-slide-title {
    font-size: 2.8rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    text-transform: uppercase;
    color: #ffffff;
    line-height: 1.1;
  }
  @media (max-width: 768px) {
    .nordic-slide-title {
      font-size: 2rem;
    }
  }

  .nordic-slide-desc {
    font-size: 1.05rem;
    line-height: 1.65;
    color: rgba(255, 255, 255, 0.85);
    margin-bottom: 40px;
    font-weight: 400;
    z-index: 2;
  }
  @media (max-width: 768px) {
    .nordic-slide-desc {
      font-size: 0.95rem;
      margin-bottom: 20px;
    }
  }

  .nordic-nav-container {
    display: flex;
    align-items: center;
    gap: 25px;
    margin-top: auto;
    z-index: 2;
  }
  @media (max-width: 1024px) {
    .nordic-nav-container {
      margin-top: 20px;
    }
  }

  .nordic-arrow-btn {
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: #ffffff;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.35s cubic-bezier(0.25, 1, 0.5, 1);
    font-size: 1rem;
  }

  .nordic-arrow-btn:hover {
    background: #ffffff;
    color: #111115;
    border-color: #ffffff;
    box-shadow: 0 10px 25px rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
  }
  
  .nordic-arrow-btn:active {
    transform: translateY(0);
  }

  .nordic-dots {
    display: flex;
    gap: 12px;
  }

  .nordic-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.25);
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .nordic-dot.active {
    background: #00ffaa;
    width: 28px;
    border-radius: 4px;
    box-shadow: 0 0 10px rgba(0, 255, 170, 0.5);
  }

  /* Corner graphics inspired by vintage runes/knots */
  .nordic-corner {
    position: absolute;
    width: 30px;
    height: 30px;
    border: 1.5px solid rgba(255, 255, 255, 0.25);
    pointer-events: none;
    z-index: 10;
  }
  .nordic-corner-tl {
    top: 25px;
    left: 25px;
    border-right: none;
    border-bottom: none;
  }
  .nordic-corner-tr {
    top: 25px;
    right: 25px;
    border-left: none;
    border-bottom: none;
  }
  .nordic-corner-bl {
    bottom: 25px;
    left: 25px;
    border-right: none;
    border-top: none;
  }
  .nordic-corner-br {
    bottom: 25px;
    right: 25px;
    border-left: none;
    border-top: none;
  }
`;

export default function ThreeDParticleTerrain() {
  const [selectedProject, setSelectedProject] = useState<{ label: string; subLabel: string } | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  // Reset active slide when opening a new project
  useEffect(() => {
    setActiveSlide(0);
  }, [selectedProject]);

  return (
    <div className="td-canvas-wrapper" style={{ pointerEvents: 'auto' }}>
      <style dangerouslySetInnerHTML={{ __html: cyberStyles }} />
      <Canvas
        // Camera positioned at the 3D perspective angle looking down the sloped grid
        camera={{ position: [0, -15, 17], fov: 55, near: 0.1, far: 60 }}
        dpr={Math.min(window.devicePixelRatio, 2)}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance"
        }}
        style={{ width: '100vw', height: '100vh', background: '#000000' }}
      >
        <ParticleGridMesh />
        
        {/* ── 3 identical front-facing monumental static chrome-silver toruses (zero overlap, 100% opaque) ── */}
        {/* Top Torus: Scaled and rotated to match the other two shapes exactly as requested */}
        <LiquidTorus 
          position={[0.0, 6.2, 3.5]} 
          scale={[1.11, 1.11, 1.11]} 
          phase={1.5} 
          rotation={[-0.895, 0, 0]} 
          onClick={() => setSelectedProject({ label: "Nordic Knots", subLabel: "Nordic Knots Collection" })}
          label="Nordic Knots"
        />
        
        {/* Bottom Left Torus: Positioned higher at Y=-4.0 to prevent screen cutoff, pushed to Z=3.5 to render strictly on top */}
        <LiquidTorus 
          position={[-8.8, -4.0, 3.5]} 
          scale={[0.88, 0.88, 0.88]} 
          phase={1.5} 
          rotation={[-0.553, 0, 0]} 
          onClick={() => setSelectedProject({ label: "Stained Glass", subLabel: "Stained Glass Dress" })}
          label="Stained Glass"
        />
        
        {/* Bottom Right Torus: Positioned higher at Y=-4.0 to prevent screen cutoff, pushed to Z=3.5 to render strictly on top */}
        <LiquidTorus 
          position={[8.8, -4.0, 3.5]} 
          scale={[0.88, 0.88, 0.88]} 
          phase={1.5} 
          rotation={[-0.553, 0, 0]} 
          onClick={() => setSelectedProject({ label: "Metallic Dress", subLabel: "Metallic Dress" })}
          label="Metallic Dress"
        />
      </Canvas>

      {/* Sleek glassmorphic centered modal */}
      <div 
        className={`cyber-modal-overlay ${selectedProject ? 'active' : ''}`}
        onClick={() => setSelectedProject(null)}
      />
      <div className={`cyber-modal ${selectedProject ? 'active' : ''}`}>
        <button className="cyber-modal-close" onClick={() => setSelectedProject(null)}>
          ✕
        </button>
        {selectedProject?.label === "Nordic Knots" ? (
          <div className="nordic-modal-content">
            {/* Corner frames inspired by vintage Norse woodcarvings */}
            <div className="nordic-corner nordic-corner-tl" />
            <div className="nordic-corner nordic-corner-tr" />
            <div className="nordic-corner nordic-corner-bl" />
            <div className="nordic-corner nordic-corner-br" />
            
            {/* Runes background watermark */}
            <div className="nordic-rune-bg">ᛟ ᛉ ᚛</div>

            <div className="nordic-left-pane">
              <div className="nordic-title-wrap">
                <div className="nordic-slide-subtitle">
                  {nordicSlides[activeSlide].subtitle}
                </div>
                <div className="nordic-runic-divider">᚛ ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ ᚷ ᚹ ᚜</div>
                <div className="nordic-slide-title">
                  {nordicSlides[activeSlide].title}
                </div>
              </div>
              <p className="nordic-slide-desc">
                {nordicSlides[activeSlide].desc}
              </p>
              
              <div className="nordic-nav-container">
                <button 
                  className="nordic-arrow-btn"
                  onClick={() => setActiveSlide((prev) => (prev === 0 ? nordicSlides.length - 1 : prev - 1))}
                  aria-label="Previous slide"
                >
                  ←
                </button>
                <div className="nordic-dots">
                  {nordicSlides.map((_, idx) => (
                    <div 
                      key={idx}
                      className={`nordic-dot ${idx === activeSlide ? 'active' : ''}`}
                      onClick={() => setActiveSlide(idx)}
                    />
                  ))}
                </div>
                <button 
                  className="nordic-arrow-btn"
                  onClick={() => setActiveSlide((prev) => (prev === nordicSlides.length - 1 ? 0 : prev + 1))}
                  aria-label="Next slide"
                >
                  →
                </button>
              </div>
            </div>

            <div className="nordic-right-pane">
              <img 
                src={nordicSlides[activeSlide].image} 
                alt={nordicSlides[activeSlide].title}
                className="nordic-mood-img"
                key={activeSlide}
              />
            </div>
          </div>
        ) : (
          <div className="cyber-modal-content">
            <div className="cyber-modal-title">{selectedProject?.label}</div>
            <div className="cyber-modal-subtitle">{selectedProject?.subLabel}</div>
            <div className="cyber-modal-body">
              <span className="cyber-modal-placeholder">// SECURE_CONTENT_LOCK_ACTIVE</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
