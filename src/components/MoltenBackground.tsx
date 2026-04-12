import { useFrame, useThree, Canvas } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

// ─── SHADER MATERIAL ───
const VERT = `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const FRAG = `
uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uResolution;
varying vec2 vUv;

// COLORS
vec3 silver = vec3(0.95, 0.95, 0.98); // High-shine Silver
vec3 orange = vec3(0.91, 0.48, 0.25); // Metallic Jaffa Orange
vec3 red = vec3(0.85, 0.15, 0.20);    // Metallic Haute Red

// Simplex Noise (added for the user's blueprint to compile correctly)
vec3 mod289(vec3 x){ return x - floor(x*(1.0/289.0))*289.0; }
vec4 mod289(vec4 x){ return x - floor(x*(1.0/289.0))*289.0; }
vec4 permute(vec4 x){ return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314*r; }

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i); 
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// SHINY DIAMOND MATH (Specular & Fresnel)
void main() {
    vec2 uv = vUv;
    
    // Correct aspect ratio for the wave calculation
    uv.x *= uResolution.x / uResolution.y;
    vec2 mMouse = uMouse;
    mMouse.x *= uResolution.x / uResolution.y;
    
    // 1. Fluid Dynamics (The Wave Pattern)
    float dist = length(uv - mMouse);
    float ripple = sin(dist * 22.0 - uTime * 3.5) * exp(-dist * 5.0);
    // Add time offset into 2D noise coords
    float wave = snoise(uv * 3.0 + vec2(uTime * 0.1)) + (ripple * 0.7);

    // 2. Creating the "Glass" Ridges (Normal Mapping)
    float e = 0.001;
    float n1 = snoise((uv + vec2(e, 0.0)) * 3.0 + vec2(uTime * 0.1));
    float n2 = snoise((uv - vec2(e, 0.0)) * 3.0 + vec2(uTime * 0.1));
    float n3 = snoise((uv + vec2(0.0, e)) * 3.0 + vec2(uTime * 0.1));
    float n4 = snoise((uv - vec2(0.0, e)) * 3.0 + vec2(uTime * 0.1));
    vec3 normal = normalize(vec3(n1 - n2, n3 - n4, 0.08));

    // 3. Lighting (The Diamond Shine)
    vec3 lightDir = normalize(vec3(0.5, 0.5, 1.0));
    vec3 viewDir = vec3(0.0, 0.0, 1.0);
    float spec = pow(max(0.0, dot(reflect(-lightDir, normal), viewDir)), 128.0);
    float fresnel = pow(1.0 - max(0.0, dot(normal, viewDir)), 5.0);

    // 4. Final Color Assembly
    vec3 base = mix(silver, orange, smoothstep(0.2, 0.5, wave));
    base = mix(base, red, smoothstep(0.6, 0.9, wave));
    
    // Apply "Glass" finish
    vec3 final = (base * 0.8) + (vec3(1.0) * spec * 2.5) + (vec3(1.0) * fresnel * 1.5);
    gl_FragColor = vec4(final, 1.0);
}
`;

// ─── MESH COMPONENT ───
function MoltenMesh() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { size, viewport } = useThree();

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uResolution: { value: new THREE.Vector2(1, 1) }
  }), []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      materialRef.current.uniforms.uResolution.value.set(size.width, size.height);
      
      // Update mouse from state.pointer (-1 to 1) mapped to (0 to 1)
      const mouseX = (state.pointer.x + 1) / 2;
      const mouseY = (state.pointer.y + 1) / 2;
      
      // Smoothly interpolate mouse movement towards target for organic liquid feel
      materialRef.current.uniforms.uMouse.value.x += (mouseX - materialRef.current.uniforms.uMouse.value.x) * 0.1;
      materialRef.current.uniforms.uMouse.value.y += (mouseY - materialRef.current.uniforms.uMouse.value.y) * 0.1;
    }
  });

  return (
    <mesh>
      {/* Cover the entire viewport */}
      <planeGeometry args={[viewport.width, viewport.height]} />
      <shaderMaterial 
        ref={materialRef}
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={uniforms}
      />
    </mesh>
  );
}

// ─── MAIN EXPORT ───
export default function MoltenBackground() {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1 }}>
      <Canvas 
        camera={{ position: [0, 0, 1] }} 
        dpr={Math.min(window.devicePixelRatio, 1.5)} // Cap DPR for smooth 60fps
      >
        <MoltenMesh />
      </Canvas>
    </div>
  );
}
