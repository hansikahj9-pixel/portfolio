import { useFrame, Canvas, useThree } from '@react-three/fiber';
import { useRef, useMemo, useEffect, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { Html } from '@react-three/drei';
import { motion } from 'framer-motion';

// Import Generated Inspiration Images for Nordic Knots Moodboard
import nordicMain from '../assets/nordic_moodboard_main.png';
import nordicKnots from '../assets/nordic_knots_inspiration.png';

// Import Substance Sampler Fabric Screenshots (Original viewport views showing interface)
import fabric106 from '../assets/browswear/Screenshot (106).png';
import fabric107 from '../assets/browswear/Screenshot (107).png';
import fabric109 from '../assets/browswear/Screenshot (109).png';
import fabric111 from '../assets/browswear/Screenshot (111).png';
import fabric113 from '../assets/browswear/Screenshot (113).png';
import fabric190 from '../assets/browswear/Screenshot (190).png';
import fabric193 from '../assets/browswear/Screenshot (193).png';
import fabric195 from '../assets/browswear/Screenshot (195).png';

// Import Looks Turnarounds (Original Browzwear turnaround models)
import look6 from '../assets/browswear/6.jpg';
import look7 from '../assets/browswear/7.jpg';
import look9 from '../assets/browswear/9.jpg';
import look10 from '../assets/browswear/10.jpg';
import look11 from '../assets/browswear/11.jpg';
import look12 from '../assets/browswear/12.jpg';

// Import Looks Photoshoots (The custom photoshoot layouts created by Hansika)
import look6_1 from '../assets/browswear/6.1.png';
import look7_1 from '../assets/browswear/7.1.png';
import look8_1 from '../assets/browswear/8.1.png';
import look9_1 from '../assets/browswear/9.1.png';
import look10_1 from '../assets/browswear/10.1.png';
import look11_1 from '../assets/browswear/11.1.png';

const fabricExperiments = [
  {
    name: "EXPERIMENT 01: WIREFRAME GRID MESH",
    material: "Adobe Substance R&D — Structural Opacity Study",
    desc: "Initial study of a perforated mesh structure with raw geometric openings. Developed to test pattern repeat sizes, vector alignment, and opacity map thresholds for the digital fabric base layer.",
    image: fabric106
  },
  {
    name: "EXPERIMENT 02: VOLUMETRIC EMBOSS STUDY",
    material: "Adobe Substance R&D — Height Displacement Test",
    desc: "High-density height mapping test to push depth boundaries. This R&D file explored displacement limits to ensure Norse carved reliefs remain structural and do not flatten under simulated physics.",
    image: fabric107
  },
  {
    name: "EXPERIMENT 03: INTERLACING LACE STRUCTURE",
    material: "Adobe Substance R&D — Crochet & Netting Study",
    desc: "A hybrid digital material merging organic woodcarving patterns with a micro-net background. Developed to simulate a crocheted or knitted lace effect for secondary flowing panels.",
    image: fabric109
  },
  {
    name: "EXPERIMENT 04: HORIZONTAL RUNIC VECTORS",
    material: "Adobe Substance R&D — Normal Map Specifications",
    desc: "Testing horizontal runic boundaries and linear geometries. Investigated normal map lighting responses to make sure the runic borders catch specular highlights during movement.",
    image: fabric111
  },
  {
    name: "EXPERIMENT 05: WARM COPPER RELIEF",
    material: "Adobe Substance R&D — Metallic Sheen & Tone Study",
    desc: "Sheen and warm metallic reflection testing. Explored earthy copper and brass tones (representing historical Norse metal ornaments) before finalizing the collection's deep woad-indigo palette.",
    image: fabric113
  }
];

const finalFabrics = [
  {
    name: "FABRIC 01: PERFORATED KNOTWORK MESH",
    material: "Lightweight Technical Mesh / Spandex Overlay",
    desc: "The final Perforated Knotwork Mesh. Designed in Substance by mapping runic vector opacity masks onto a fine woven nylon normal map, producing a lightweight, chainmail-inspired draping layer.",
    image: fabric190
  },
  {
    name: "FABRIC 02: EMBOSSED VIKING RELIEF (FRONT)",
    material: "Heavy Boiled Wool / Structural Outerwear Felt",
    desc: "The final Embossed Viking Relief fabric. Boasts deeply embossed zoomorphic carvings. In Substance 3D Sampler, this was built by blending a custom height-map carving vector into a felted wool texture base.",
    image: fabric193
  },
  {
    name: "FABRIC 03: EMBOSSED VIKING RELIEF (DETAIL)",
    material: "Boiled Wool / Localized Satin Sheen Coating",
    desc: "Detailed close-up showing how low-angle specular light catches the raised carved edges. Outlines how custom height map displacements translate ancient Norse carvings into highly tactile garment panels.",
    image: fabric195
  }
];

const nordicScrollLooks = [
  {
    num: "I",
    title: "LOOK 01: THE KNOTWORK DRAPE",
    subtitle: "GARMENT STYLING & COLORWAYS",
    desc: "An asymmetrical draped dress featuring interlocking panel vectors. The organic knot lines guide the drape lines across the bodice, creating a fluid silhouette that shifts dynamically with movement.",
    tagLeft: "WOAD INDIGO / SLATE CHARCOAL",
    shootLeft: look6_1,
    turnLeft: look6,
    tagRight: "CRIMSON MADDER RED",
    shootRight: look7_1,
    turnRight: look7
  },
  {
    num: "II",
    title: "LOOK 02: VALKYRIE SHIELD BODICE",
    subtitle: "STRUCTURED ACTIVE WEAR",
    desc: "A structured bodice garment referencing historical Norse protective armor. Layered shoulder straps and wrapped waist panels provide structural support while maintaining flexibility.",
    tagLeft: "ICE FJORD BLUE / SLATE TEAL",
    shootLeft: look8_1,
    turnLeft: look9,
    tagRight: "CRIMSON MADDER RED",
    shootRight: look9_1,
    turnRight: look10
  },
  {
    num: "III",
    title: "LOOK 03: URNES CARVED COAT",
    subtitle: "OUTERWEAR & SHELL SYSTEMS",
    desc: "A heavy relief-paneled outerwear coat utilizing the custom Embossed Viking Relief fabric. High-volume shoulder contours and mesh-insert panels reference the scaling of Norse mythological archetypes.",
    tagLeft: "VIKING NAVY / FJORD BLUE",
    shootLeft: look10_1,
    turnLeft: look11,
    tagRight: "WEATHERED BONE / MIST GREY",
    shootRight: look11_1,
    turnRight: look12
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
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,500;0,700;1,300&family=Plus+Jakarta+Sans:wght@400;700;800&display=swap');

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
    background: rgba(0, 0, 0, 0.45);
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
    background: #fdfcf7; /* Premium Bone-White Parchment Paper */
    border: 1px solid rgba(0, 0, 0, 0.05);
    border-radius: 40px;
    box-shadow: 0 35px 80px rgba(0, 0, 0, 0.25);
    z-index: 1000;
    display: flex;
    flex-direction: column;
    padding: 0; /* Full bleed layout */
    overflow: hidden;
    box-sizing: border-box;
    opacity: 0;
    pointer-events: none;
    transition: transform 0.45s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.45s ease;
  }
  @media (max-width: 1024px) {
    .cyber-modal {
      width: 92vw;
      height: 85vh;
      border-radius: 24px;
    }
  }
  .cyber-modal.active {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
    pointer-events: auto;
  }
  .cyber-modal-close {
    position: absolute;
    top: 25px;
    right: 25px;
    background: rgba(35, 39, 36, 0.04);
    border: 1px solid rgba(35, 39, 36, 0.1);
    color: #232724;
    font-size: 1.5rem;
    cursor: pointer;
    line-height: 1;
    transition: all 0.3s ease;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1100;
  }
  .cyber-modal-close:hover {
    background: rgba(35, 39, 36, 0.1);
    color: #cca353;
    border-color: rgba(197, 160, 89, 0.3);
  }
  .cyber-modal-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    color: #232724;
    font-family: 'Plus Jakarta Sans', sans-serif;
    padding: 50px;
    box-sizing: border-box;
  }
  .cyber-modal-title {
    font-size: 2.2rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    text-transform: uppercase;
    color: #232724;
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
    padding-bottom: 15px;
    margin-bottom: 15px;
  }
  .cyber-modal-subtitle {
    font-size: 0.8rem;
    letter-spacing: 0.18em;
    color: #cca353;
    font-weight: 700;
    text-transform: uppercase;
    margin-bottom: 30px;
  }
  .cyber-modal-body {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px dashed rgba(0, 0, 0, 0.1);
    border-radius: 16px;
    background: rgba(0, 0, 0, 0.02);
  }
  .cyber-modal-placeholder {
    font-size: 0.8rem;
    color: #8c8c95;
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
  }

  /* ── NORDIC SCROLL PAGE STYLING ── */
  .nordic-scroll-page {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    background: #090e1a; /* Deep Woad Indigo base */
    background-image: 
      /* Distressed Grain Overlay */
      url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.02'/%3E%3C/svg%3E"),
      /* Intricate Runic Knotwork Mesh */
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Cpath d='M60 0 L120 60 L60 120 L0 60 Z' fill='none' stroke='rgba(197, 160, 89, 0.025)' stroke-width='0.75'/%3E%3Ccircle cx='60' cy='60' r='10' fill='none' stroke='rgba(34, 139, 115, 0.02)' stroke-width='0.5'/%3E%3Cpath d='M60 20 L100 60 L60 100 L20 60 Z' fill='none' stroke='rgba(197, 160, 89, 0.012)' stroke-width='0.5'/%3E%3C/svg%3E"),
      /* Dynamic Aurora Borealis Gradient Blends */
      radial-gradient(circle at 80% 15%, rgba(46, 196, 182, 0.15) 0%, rgba(0, 0, 0, 0) 55%),
      radial-gradient(circle at 15% 45%, rgba(138, 79, 255, 0.12) 0%, rgba(0, 0, 0, 0) 65%),
      radial-gradient(circle at 75% 75%, rgba(34, 139, 115, 0.14) 0%, rgba(0, 0, 0, 0) 50%),
      radial-gradient(circle at 20% 90%, rgba(255, 184, 0, 0.06) 0%, rgba(0, 0, 0, 0) 45%),
      linear-gradient(135deg, #090e1a 0%, #0c1824 35%, #152535 70%, #0b111e 100%);
    color: #e5e4de; /* Bone white text */
    padding: 80px 80px 120px 80px;
    box-sizing: border-box;
    position: relative;
    scrollbar-width: thin;
    scrollbar-color: rgba(197, 160, 89, 0.25) rgba(9, 14, 26, 0.2);
  }

  .nordic-scroll-page::-webkit-scrollbar {
    width: 8px;
  }
  .nordic-scroll-page::-webkit-scrollbar-track {
    background: rgba(9, 14, 26, 0.2);
  }
  .nordic-scroll-page::-webkit-scrollbar-thumb {
    background: rgba(197, 160, 89, 0.2);
    border-radius: 4px;
  }
  .nordic-scroll-page::-webkit-scrollbar-thumb:hover {
    background: rgba(197, 160, 89, 0.4);
  }

  /* Fixed runes borders */
  .nordic-side-border {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 40px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    color: rgba(197, 160, 89, 0.06);
    font-family: monospace, serif;
    font-size: 1.1rem;
    pointer-events: none;
    user-select: none;
    z-index: 3;
    writing-mode: vertical-rl;
    text-orientation: upright;
    letter-spacing: 0.6em;
  }
  .nordic-side-border.left {
    left: 20px;
  }
  .nordic-side-border.right {
    right: 20px;
  }

  /* Rotating Astrolabe Background Graphics */
  .nordic-bg-graphics-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
    overflow: hidden;
  }
  .nordic-astrolabe {
    position: absolute;
    transform-origin: center center;
    pointer-events: none;
    user-select: none;
  }
  .nordic-astrolabe.outer {
    width: 900px;
    height: 900px;
    top: 15%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation: spinAstrolabeCW 160s linear infinite;
  }
  .nordic-astrolabe.inner {
    width: 600px;
    height: 600px;
    top: 50%;
    left: 15%;
    transform: translate(-50%, -50%);
    animation: spinAstrolabeCCW 120s linear infinite;
  }
  .nordic-astrolabe.bottom-right {
    width: 750px;
    height: 750px;
    top: 80%;
    left: 85%;
    transform: translate(-50%, -50%);
    animation: spinAstrolabeCW 200s linear infinite;
  }
  .runic-text {
    font-family: monospace, serif;
    font-size: 8px;
    fill: rgba(197, 160, 89, 0.08);
    letter-spacing: 2.5px;
  }
  .runic-text.second {
    fill: rgba(46, 196, 182, 0.06);
  }
  @keyframes spinAstrolabeCW {
    from { transform: translate(-50%, -50%) rotate(0deg); }
    to { transform: translate(-50%, -50%) rotate(360deg); }
  }
  @keyframes spinAstrolabeCCW {
    from { transform: translate(-50%, -50%) rotate(0deg); }
    to { transform: translate(-50%, -50%) rotate(-360deg); }
  }

  /* Full-Bleed Overlay Layout Styles */
  .nordic-full-bleed-section {
    position: relative;
    width: 100%;
    height: 660px;
    border-radius: 28px;
    overflow: hidden;
    margin-bottom: 120px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 60px 80px;
    box-sizing: border-box;
    box-shadow: 0 35px 80px rgba(0, 0, 0, 0.55);
    z-index: 2;
  }
  .nordic-full-bleed-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 1;
    opacity: 0.95;
    transition: transform 1.2s cubic-bezier(0.25, 1, 0.5, 1);
  }
  .nordic-full-bleed-section:hover .nordic-full-bleed-bg {
    transform: scale(1.04);
  }
  .nordic-full-bleed-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, rgba(9, 14, 26, 0.5) 0%, rgba(9, 14, 26, 0.8) 100%);
    z-index: 2;
  }
  .nordic-full-bleed-content {
    position: relative;
    z-index: 3;
    max-width: 800px;
    text-align: center;
    color: #fdfcf7;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .nordic-full-bleed-content.left-aligned {
    text-align: left;
    align-items: flex-start;
    margin-right: auto;
    margin-left: 20px;
    max-width: 580px;
    background: rgba(9, 14, 26, 0.72);
    backdrop-filter: blur(25px);
    -webkit-backdrop-filter: blur(25px);
    border: 1px solid rgba(197, 160, 89, 0.25);
    padding: 55px;
    border-radius: 24px;
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.45);
  }

  .nordic-scroll-hero {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-bottom: 120px;
    position: relative;
    z-index: 2;
  }

  .nordic-slide-subtitle {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.8rem;
    letter-spacing: 0.4em;
    color: #cca353;
    text-transform: uppercase;
    font-weight: 700;
    margin-bottom: 10px;
    text-shadow: 0 0 10px rgba(197, 160, 89, 0.15);
  }

  .nordic-runic-divider {
    font-family: monospace, serif;
    font-size: 0.85rem;
    letter-spacing: 0.7em;
    color: rgba(197, 160, 89, 0.4);
    margin: 14px 0;
    user-select: none;
    pointer-events: none;
  }

  .nordic-scroll-main-title {
    font-family: 'Cinzel', serif;
    font-size: 4rem;
    font-weight: 900;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #cca353;
    text-shadow: 0 0 30px rgba(197, 160, 89, 0.15);
    line-height: 1.1;
    margin-top: 10px;
  }

  .nordic-scroll-lead {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.5rem;
    line-height: 1.6;
    color: #cca353;
    opacity: 0.85;
    max-width: 900px;
    margin: 20px auto 40px auto;
  }

  .nordic-hero-img-frame {
    background: #ffffff;
    border: 16px solid #ffffff;
    border-radius: 4px;
    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5);
    max-width: 1000px;
    width: 90%;
    aspect-ratio: 16 / 9;
    overflow: hidden;
    transform: rotate(-0.5deg);
    transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
  }
  .nordic-hero-img-frame:hover {
    transform: rotate(0deg) scale(1.01);
  }
  .nordic-hero-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.95;
    display: block;
  }


  /* Scrolling layout sections */
  .nordic-scroll-section {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 80px;
    margin-bottom: 150px;
    position: relative;
    z-index: 2;
    width: 100%;
  }
  .nordic-scroll-section.reversed {
    flex-direction: row-reverse;
  }
  @media (max-width: 1024px) {
    .nordic-scroll-section, .nordic-scroll-section.reversed {
      flex-direction: column;
      gap: 40px;
      margin-bottom: 100px;
    }
  }

  .nordic-section-left {
    flex: 1;
    max-width: 550px;
  }
  .nordic-section-right {
    flex: 1.2;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  @media (max-width: 1024px) {
    .nordic-section-left, .nordic-section-right {
      max-width: 100%;
      width: 100%;
    }
  }

  .nordic-section-title {
    font-family: 'Cinzel', serif;
    font-size: 2.5rem;
    font-weight: 700;
    color: #cca353;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    line-height: 1.2;
    margin-top: 10px;
    margin-bottom: 20px;
  }

  .nordic-section-desc {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.3rem;
    line-height: 1.7;
    color: #d1cfc7;
    margin-bottom: 30px;
  }

  .nordic-mood-img-container {
    width: 95%;
    height: 95%;
    background: #ffffff;
    border: 12px solid #ffffff;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
    transform: rotate(1.2deg);
    transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .nordic-mood-img-container:hover {
    transform: rotate(0deg) scale(1.01);
  }
  .nordic-mood-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.95;
    display: block;
  }

  /* Collage Section specifics */
  .nordic-scroll-section.collage-section {
    align-items: flex-start;
  }
  .nordic-scroll-section.collage-section .nordic-section-right {
    height: 520px;
    position: relative;
  }

  /* Corner graphics */
  .nordic-corner-svg {
    position: absolute;
    pointer-events: none;
    z-index: 10;
  }
  .nordic-corner-tl {
    top: 25px;
    left: 25px;
  }
  .nordic-corner-bl {
    bottom: 25px;
    left: 25px;
  }

  /* Fabric collage layout styling */
  .nordic-fabric-collage {
    width: 100%;
    height: 100%;
    position: relative;
    box-sizing: border-box;
  }
  
  .fabric-card {
    position: absolute;
    background: #ffffff;
    border: 6px solid #ffffff;
    border-radius: 4px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
    overflow: hidden;
    transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.4s ease, outline 0.3s ease;
    box-sizing: border-box;
    cursor: pointer;
    display: flex;
    flex-direction: column;
  }
  
  .fabric-card:hover {
    transform: rotate(0deg) scale(1.04);
    z-index: 9 !important;
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.5);
  }

  .fabric-card.active {
    transform: rotate(0deg) scale(1.08) !important;
    box-shadow: 0 20px 45px rgba(0, 0, 0, 0.6);
    outline: 2px solid #cca353;
    outline-offset: 4px;
    z-index: 10 !important;
  }

  .fabric-swatch-img {
    width: 100%;
    aspect-ratio: 16 / 9;
    object-fit: cover;
    display: block;
  }

  .fabric-swatch-label {
    background: #ffffff;
    border-top: 1px solid rgba(197, 160, 89, 0.12);
    padding: 6px 0;
    text-align: center;
    font-family: 'Cinzel', serif;
    font-size: 0.65rem;
    font-weight: 700;
    color: #cca353;
    letter-spacing: 0.12em;
    user-select: none;
  }

  /* Slide 5 Final Fabric Swatches coordinates (Spacious 3-card layout) */
  .fabric-card-1 {
    left: 4%;
    top: 10%;
    width: 52%;
    transform: rotate(-3deg);
  }

  .fabric-card-2 {
    left: 46%;
    top: 4%;
    width: 50%;
    transform: rotate(2deg);
  }

  .fabric-card-3 {
    left: 23%;
    top: 44%;
    width: 54%;
    transform: rotate(-1deg);
  }

  /* Slide 4 Experiments Swatches coordinates (Tight fanned 5-card layout) */
  .nordic-experiment-collage .fabric-card-1 {
    left: 3%;
    top: 8%;
    width: 42%;
    transform: rotate(-5deg);
  }

  .nordic-experiment-collage .fabric-card-2 {
    left: 40%;
    top: 3%;
    width: 40%;
    transform: rotate(4deg);
  }

  .nordic-experiment-collage .fabric-card-3 {
    left: 4%;
    top: 44%;
    width: 44%;
    transform: rotate(-3deg);
  }

  .nordic-experiment-collage .fabric-card-4 {
    left: 53%;
    top: 40%;
    width: 42%;
    transform: rotate(5deg);
  }

  .nordic-experiment-collage .fabric-card-5 {
    left: 42%;
    top: 20%;
    width: 41%;
    transform: rotate(-2deg);
  }

  /* Left Pane Fabric Study detailed cards */
  .fabric-study-box {
    margin-top: 25px;
    margin-bottom: 25px;
    padding: 20px 24px;
    background: #141615; /* Dark stone card */
    border-left: 3px solid #cca353;
    border-radius: 0 12px 12px 0;
    border: 1px solid rgba(197, 160, 89, 0.15);
    border-left: 3px solid #cca353;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    animation: slideInText 0.45s cubic-bezier(0.25, 1, 0.5, 1) forwards;
  }

  .fabric-study-type {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.72rem;
    letter-spacing: 0.18em;
    color: #cca353;
    font-weight: 700;
    text-transform: uppercase;
    margin-bottom: 6px;
  }

  .fabric-study-title {
    font-family: 'Cinzel', serif;
    font-size: 1.15rem;
    font-weight: 700;
    color: #e5e4de;
    margin-bottom: 12px;
    letter-spacing: 0.05em;
  }

  .fabric-study-desc {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.15rem;
    line-height: 1.6;
    color: #c0beb5;
  }

  .fabric-study-tabs {
    display: flex;
    gap: 8px;
    margin-top: 24px;
    flex-wrap: wrap;
  }

  .fabric-tab-btn {
    background: transparent;
    border: 1px solid rgba(197, 160, 89, 0.3);
    border-radius: 20px;
    padding: 6px 14px;
    font-family: 'Cinzel', serif;
    font-size: 0.68rem;
    font-weight: 600;
    color: rgba(229, 228, 222, 0.65);
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .fabric-tab-btn:hover, .fabric-tab-btn.active {
    background: #cca353;
    border-color: #cca353;
    color: #0d0f0e;
    box-shadow: 0 0 12px rgba(197, 160, 89, 0.4);
  }

  /* ── CONCEPT A: ASYMMETRIC DOSSIER SCROLL LOOKS STYLING ── */
  .nordic-scroll-look-section {
    display: flex;
    flex-direction: column;
    margin-bottom: 180px;
    position: relative;
    z-index: 2;
    border-top: 1px solid rgba(197, 160, 89, 0.15);
    padding-top: 80px;
    width: 100%;
  }

  .nordic-look-header-block {
    text-align: center;
    margin-bottom: 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
  }

  .nordic-look-bg-num {
    position: absolute;
    font-family: 'Cinzel', serif;
    font-size: 8rem;
    font-weight: 900;
    color: rgba(197, 160, 89, 0.03);
    top: -45px;
    left: 50%;
    transform: translateX(-50%);
    user-select: none;
    pointer-events: none;
    z-index: 1;
  }

  .nordic-scroll-look-title {
    font-family: 'Cinzel', serif;
    font-size: 2.8rem;
    font-weight: 700;
    color: #cca353;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin: 10px 0 20px 0;
    z-index: 2;
  }

  .nordic-scroll-look-desc {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.35rem;
    line-height: 1.7;
    color: #d1cfc7;
    max-width: 850px;
    margin: 0 auto;
    z-index: 2;
  }

  .nordic-look-asymmetric-dossier {
    display: flex;
    flex-direction: column;
    gap: 140px;
    width: 100%;
    margin-top: 20px;
  }

  .dossier-colorway {
    display: flex;
    flex-direction: column;
    width: 100%;
    position: relative;
  }

  .dossier-tag {
    font-family: 'Cinzel', serif;
    font-size: 1.05rem;
    font-weight: 700;
    color: #cca353;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    margin-bottom: 30px;
    border-bottom: 1px dashed rgba(197, 160, 89, 0.2);
    padding-bottom: 12px;
    width: 100%;
  }

  .dossier-collage-container {
    display: flex;
    flex-direction: row;
    position: relative;
    width: 100%;
    height: 480px;
    align-items: center;
  }
  @media (max-width: 768px) {
    .dossier-collage-container {
      flex-direction: column;
      height: auto;
      gap: 40px;
    }
  }

  .dossier-card {
    background: #fdfcf7; /* Polaroid paper border */
    border: 12px solid #fdfcf7;
    border-bottom: 30px solid #fdfcf7; /* Polaroid writing margin */
    border-radius: 4px;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.55);
    position: absolute;
    transition: transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.4s ease, z-index 0.3s ease;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
  }
  @media (max-width: 768px) {
    .dossier-card {
      position: relative !important;
      width: 100% !important;
      left: auto !important;
      right: auto !important;
      top: auto !important;
      transform: none !important;
    }
  }

  .dossier-card:hover {
    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.75);
    z-index: 10 !important;
  }

  .dossier-card.main-photoshoot {
    width: 62%;
    z-index: 2;
  }
  
  .left-heavy .dossier-card.main-photoshoot {
    left: 0;
    transform: rotate(-1.5deg);
  }
  
  .right-heavy .dossier-card.main-photoshoot {
    right: 0;
    transform: rotate(1.5deg);
  }
  
  .dossier-card.main-photoshoot:hover {
    transform: scale(1.02) rotate(0deg);
  }

  .dossier-card.detail-turnaround {
    width: 40%;
    z-index: 5;
  }
  
  .left-heavy .dossier-card.detail-turnaround {
    right: 3%;
    top: 5%;
    transform: rotate(3deg);
  }

  .right-heavy .dossier-card.detail-turnaround {
    left: 3%;
    top: 5%;
    transform: rotate(-3deg);
  }

  .dossier-card.detail-turnaround:hover {
    transform: scale(1.04) rotate(0deg);
  }

  /* Tape accent on turnarounds to sell the tactile scrapbook look */
  .dossier-tape {
    position: absolute;
    top: -15px;
    left: 50%;
    transform: translateX(-50%) rotate(-4deg);
    width: 100px;
    height: 25px;
    background: rgba(197, 160, 89, 0.22);
    backdrop-filter: blur(2px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
    z-index: 20;
    pointer-events: none;
    border-left: 2px dashed rgba(197, 160, 89, 0.35);
    border-right: 2px dashed rgba(197, 160, 89, 0.35);
  }

  .dossier-img-frame {
    width: 100%;
    aspect-ratio: 16 / 9;
    overflow: hidden;
    background: #000;
  }

  .dossier-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.94;
    display: block;
    transition: opacity 0.3s ease;
  }
  .dossier-card:hover .dossier-img {
    opacity: 1.0;
  }

  .dossier-caption {
    text-align: center;
    font-family: 'Cinzel', serif;
    font-size: 0.7rem;
    font-weight: 700;
    color: #4a453d;
    letter-spacing: 0.15em;
    margin-top: 12px;
    user-select: none;
  }

  /* Override modal colors for Dark theme */
  .nordic-dark-theme {
    background: linear-gradient(135deg, #090e1a 0%, #0c1824 40%, #152535 100%) !important;
    border: 2px solid rgba(197, 160, 89, 0.35) !important;
    border-radius: 40px !important;
    box-shadow: 0 35px 80px rgba(0, 0, 0, 0.75), inset 0 0 60px rgba(197, 160, 89, 0.05) !important;
  }

  .nordic-dark-theme .cyber-modal-close {
    background: rgba(255, 255, 255, 0.05) !important;
    border: 1px solid rgba(255, 255, 255, 0.15) !important;
    color: #e5e4de !important;
  }

  .nordic-dark-theme .cyber-modal-close:hover {
    background: rgba(197, 160, 89, 0.15) !important;
    color: #cca353 !important;
    border-color: rgba(197, 160, 89, 0.5) !important;
  }

  @keyframes slideInText {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export default function ThreeDParticleTerrain() {
  const [selectedProject, setSelectedProject] = useState<{ label: string; subLabel: string } | null>(null);
  const [activeExpIdx, setActiveExpIdx] = useState(0);
  const [activeFinalIdx, setActiveFinalIdx] = useState(0);

  // Reset indices when selected project changes
  useEffect(() => {
    setActiveExpIdx(0);
    setActiveFinalIdx(0);
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
        
        {/* ── 3 identical front-facing monumental static chrome-silver toruses ── */}
        <LiquidTorus 
          position={[0.0, 6.2, 3.5]} 
          scale={[1.11, 1.11, 1.11]} 
          phase={1.5} 
          rotation={[-0.895, 0, 0]} 
          onClick={() => setSelectedProject({ label: "Nordic Knots", subLabel: "Nordic Knots Collection" })}
          label="Nordic Knots"
        />
        
        <LiquidTorus 
          position={[-8.8, -4.0, 3.5]} 
          scale={[0.88, 0.88, 0.88]} 
          phase={1.5} 
          rotation={[-0.553, 0, 0]} 
          onClick={() => setSelectedProject({ label: "Stained Glass", subLabel: "Stained Glass Dress" })}
          label="Stained Glass"
        />
        
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
      <div className={`cyber-modal ${selectedProject ? 'active' : ''} ${selectedProject?.label === "Nordic Knots" ? "nordic-dark-theme" : ""}`}>
        <button className="cyber-modal-close" onClick={() => setSelectedProject(null)}>
          ✕
        </button>
        {selectedProject?.label === "Nordic Knots" ? (
          <div className="nordic-scroll-page">
            {/* Side borders of runes */}
            <div className="nordic-side-border left">
              ᛟᚦᚨᚱᛞᛗᛚᛝᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛝᛟᛞ
            </div>
            <div className="nordic-side-border right">
              ᛟᚦᚨᚱᛞᛗᛚᛝᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛝᛟᛞ
            </div>

            {/* Rotating Astrolabe Background Graphics */}
            <div className="nordic-bg-graphics-container">
              {/* Outer Ring Astrolabe */}
              <svg className="nordic-astrolabe outer" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(197, 160, 89, 0.03)" strokeWidth="0.5" strokeDasharray="3, 5" />
                <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(46, 196, 182, 0.02)" strokeWidth="0.8" />
                <path id="rune-path-1" d="M 100,20 A 80,80 0 1,1 99.9,20" fill="none" />
                <text className="runic-text">
                  <textPath href="#rune-path-1" startOffset="0%">
                    ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛝᛟᛞᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛝᛟᛞ
                  </textPath>
                </text>
                <path d="M 100 20 L 100 180 M 20 100 L 180 100 M 43.4 43.4 L 156.6 156.6 M 43.4 156.6 L 156.6 43.4" stroke="rgba(197, 160, 89, 0.015)" strokeWidth="0.5" fill="none" />
              </svg>

              {/* Inner Ring Astrolabe with Concentric Triangles */}
              <svg className="nordic-astrolabe inner" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="60" fill="none" stroke="rgba(197, 160, 89, 0.025)" strokeWidth="0.5" />
                <path id="rune-path-2" d="M 100,40 A 60,60 0 1,0 99.9,40" fill="none" />
                <text className="runic-text second">
                  <textPath href="#rune-path-2" startOffset="0%">
                    ᛟᚦᚨᚱᛞᛗᛚᛝᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛝᛟᛞ
                  </textPath>
                </text>
                <path d="M 100 55 L 140 120 L 60 120 Z" stroke="rgba(46, 196, 182, 0.015)" strokeWidth="0.8" fill="none" />
                <path d="M 100 145 L 60 80 L 140 80 Z" stroke="rgba(197, 160, 89, 0.015)" strokeWidth="0.8" fill="none" />
              </svg>

              {/* Bottom Right Supporting Astrolabe */}
              <svg className="nordic-astrolabe bottom-right" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="75" fill="none" stroke="rgba(197, 160, 89, 0.02)" strokeWidth="0.5" />
                <circle cx="100" cy="100" r="70" fill="none" stroke="rgba(197, 160, 89, 0.01)" strokeWidth="0.5" strokeDasharray="5, 10" />
                <path id="rune-path-3" d="M 100,25 A 75,75 0 1,1 99.9,25" fill="none" />
                <text className="runic-text">
                  <textPath href="#rune-path-3" startOffset="0%">
                    ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛝᛟᛞᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾ
                  </textPath>
                </text>
              </svg>
            </div>

            {/* Section 1: Hero (Full-Bleed Cover Layout) */}
            <motion.div 
              className="nordic-full-bleed-section"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <img src={nordicMain} alt="Nordic Knots Hero" className="nordic-full-bleed-bg" />
              <div className="nordic-full-bleed-overlay" />
              
              <div className="nordic-full-bleed-content">
                <div className="nordic-slide-subtitle">WOMENSWEAR COLLECTION</div>
                <div className="nordic-runic-divider">᚛ ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ ᚷ ᚹ ᚜</div>
                <h1 className="nordic-scroll-main-title">NORDIC KNOTS</h1>
                <div className="nordic-runic-divider">᚛ ᛟ ᚦ ᚨ ᚱ ᛞ ᛗ ᛚ ᛝ ᚜</div>
                <p className="nordic-scroll-lead">
                  A mini womenswear collection where organic fabrics are inspired by interlocking Nordic knots and architectural silhouettes are drawn from Norse mythology.
                </p>
              </div>
            </motion.div>

            {/* Section 2: Sacred Knotwork (Full-Bleed Glassmorphic Card Layout) */}
            <motion.div 
              className="nordic-full-bleed-section"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <img src={nordicKnots} alt="Sacred Knotwork" className="nordic-full-bleed-bg" />
              <div className="nordic-full-bleed-overlay" />
              
              <div className="nordic-full-bleed-content left-aligned">
                <div className="nordic-slide-subtitle">GEOMETRY & CARVINGS</div>
                <h2 className="nordic-section-title">SACRED KNOTWORK</h2>
                <div className="nordic-runic-divider">᚛ ᚦ ᚨ ᚱ ᚜</div>
                <p className="nordic-section-desc">
                  Drawing inspiration from the endless loops carved into ancient runestones. The physical structure of these interlocking knots guides the directional flow of the collection's draping.
                </p>
              </div>
            </motion.div>

            {/* Section 4: Substance Experimentation (Interactive Collage) */}
            <motion.div 
              className="nordic-scroll-section collage-section"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <div className="nordic-section-left">
                <div className="nordic-slide-subtitle">TEXTILE RESEARCH & DEVELOPMENT</div>
                <h2 className="nordic-section-title">SUBSTANCE EXPERIMENTATION</h2>
                <p className="nordic-section-desc">
                  Before finalizing the material palette, I experimented with creating multiple Norse-inspired digital fabrics on Adobe Substance 3D Sampler, exploring runic configurations, height displacement offsets, and metallic sheen levels.
                </p>
                
                <div className="fabric-study-box" key={`exp-${activeExpIdx}`}>
                  <div className="fabric-study-type">
                    {fabricExperiments[activeExpIdx].material}
                  </div>
                  <div className="fabric-study-title">
                    {fabricExperiments[activeExpIdx].name}
                  </div>
                  <p className="fabric-study-desc">
                    {fabricExperiments[activeExpIdx].desc}
                  </p>
                  
                  <div className="fabric-study-tabs">
                    {fabricExperiments.map((_, idx) => (
                      <button
                        key={idx}
                        className={`fabric-tab-btn ${idx === activeExpIdx ? 'active' : ''}`}
                        onClick={() => setActiveExpIdx(idx)}
                      >
                        Exp 0{idx + 1}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="nordic-section-right">
                <div className="nordic-fabric-collage nordic-experiment-collage">
                  {fabricExperiments.map((study, idx) => (
                    <div 
                      key={idx}
                      className={`fabric-card fabric-card-${idx + 1} ${idx === activeExpIdx ? 'active' : ''}`}
                      onClick={() => setActiveExpIdx(idx)}
                      onMouseEnter={() => setActiveExpIdx(idx)}
                      style={{ zIndex: idx === activeExpIdx ? 10 : idx + 1 }}
                    >
                      <img src={study.image} alt={study.name} className="fabric-swatch-img" />
                      <div className="fabric-swatch-label">
                        Exp 0{idx + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Section 5: Substance Sampling (Interactive Collage) */}
            <motion.div 
              className="nordic-scroll-section collage-section reversed"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <div className="nordic-section-left">
                <div className="nordic-slide-subtitle">FINAL MATERIAL PALETTE</div>
                <h2 className="nordic-section-title">SUBSTANCE SAMPLING</h2>
                <p className="nordic-section-desc">
                  The finalized digital fabrics created on Adobe Substance 3D Sampler. The collection features two primary textile systems: a lightweight Perforated Knotwork Mesh and a heavy-weight Embossed Viking Relief in deep woad indigo.
                </p>
                
                <div className="fabric-study-box" key={`final-${activeFinalIdx}`}>
                  <div className="fabric-study-type">
                    {finalFabrics[activeFinalIdx].material}
                  </div>
                  <div className="fabric-study-title">
                    {finalFabrics[activeFinalIdx].name}
                  </div>
                  <p className="fabric-study-desc">
                    {finalFabrics[activeFinalIdx].desc}
                  </p>
                  
                  <div className="fabric-study-tabs">
                    {finalFabrics.map((_, idx) => (
                      <button
                        key={idx}
                        className={`fabric-tab-btn ${idx === activeFinalIdx ? 'active' : ''}`}
                        onClick={() => setActiveFinalIdx(idx)}
                      >
                        Fabric 0{idx + 1}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="nordic-section-right">
                <div className="nordic-fabric-collage">
                  {finalFabrics.map((study, idx) => (
                    <div 
                      key={idx}
                      className={`fabric-card fabric-card-${idx + 1} ${idx === activeFinalIdx ? 'active' : ''}`}
                      onClick={() => setActiveFinalIdx(idx)}
                      onMouseEnter={() => setActiveFinalIdx(idx)}
                      style={{ zIndex: idx === activeFinalIdx ? 10 : idx + 1 }}
                    >
                      <img src={study.image} alt={study.name} className="fabric-swatch-img" />
                      <div className="fabric-swatch-label">
                        Fabric 0{idx + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Sections 6, 7, 8: Looks Dossier (Asymmetric Concept A) */}
            {nordicScrollLooks.map((look, lookIdx) => (
              <motion.div 
                key={lookIdx}
                className="nordic-scroll-look-section"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
              >
                <div className="nordic-look-header-block">
                  <span className="nordic-look-bg-num">{look.num}</span>
                  <div className="nordic-slide-subtitle">{look.subtitle}</div>
                  <h2 className="nordic-scroll-look-title">{look.title}</h2>
                  <p className="nordic-scroll-look-desc">{look.desc}</p>
                </div>
                
                <div className="nordic-look-asymmetric-dossier">
                  {/* Colorway A (Left Heavy) */}
                  <div className="dossier-colorway left-heavy">
                    <div className="dossier-tag">{look.tagLeft}</div>
                    <div className="dossier-collage-container">
                      {/* Editorial Photoshoot (Large, dominant) */}
                      <div className="dossier-card main-photoshoot">
                        <div className="dossier-img-frame">
                          <img src={look.shootLeft} alt="Editorial Photoshoot" className="dossier-img" />
                        </div>
                        <div className="dossier-caption">EDITORIAL PHOTOSHOOT</div>
                      </div>
                      
                      {/* Turnaround (Smaller, overlapping, tilted with tape) */}
                      <div className="dossier-card detail-turnaround">
                        <div className="dossier-tape"></div>
                        <div className="dossier-img-frame">
                          <img src={look.turnLeft} alt="3D Turnaround model" className="dossier-img" />
                        </div>
                        <div className="dossier-caption">3D MODEL TURNAROUND</div>
                      </div>
                    </div>
                  </div>

                  {/* Colorway B (Right Heavy) */}
                  <div className="dossier-colorway right-heavy">
                    <div className="dossier-tag">{look.tagRight}</div>
                    <div className="dossier-collage-container">
                      {/* Editorial Photoshoot (Large, dominant) */}
                      <div className="dossier-card main-photoshoot">
                        <div className="dossier-img-frame">
                          <img src={look.shootRight} alt="Editorial Photoshoot" className="dossier-img" />
                        </div>
                        <div className="dossier-caption">EDITORIAL PHOTOSHOOT</div>
                      </div>
                      
                      {/* Turnaround (Smaller, overlapping, tilted with tape) */}
                      <div className="dossier-card detail-turnaround">
                        <div className="dossier-tape"></div>
                        <div className="dossier-img-frame">
                          <img src={look.turnRight} alt="3D Turnaround model" className="dossier-img" />
                        </div>
                        <div className="dossier-caption">3D MODEL TURNAROUND</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
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
