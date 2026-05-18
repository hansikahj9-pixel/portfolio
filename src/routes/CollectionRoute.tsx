import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function CollectionRoute() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // SCENE SETUP
    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 2; // Move slightly closer for massive feel

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // GEOMETRY - High density plane
    const geometry = new THREE.PlaneGeometry(15, 10, 300, 300);

    // SHADERS
    const vertexShader = `
      uniform float time;
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      varying vec3 vWorldPosition;

      // Classic 3D Perlin Noise
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
      vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

      float noise(vec3 v) {
        const vec2 C = vec2(1.0/6.0, 1.0/3.0);
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

        vec3 i  = floor(v + dot(v, C.yyy));
        vec3 x0 = v - i + dot(i, C.xxx);

        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min(g.xyz, l.zxy);
        vec3 i2 = max(g.xyz, l.zxy);

        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy;
        vec3 x3 = x0 - D.yyy;

        i = mod289(i);
        vec4 p = permute(permute(permute(
                   i.z + vec4(0.0, i1.z, i2.z, 1.0))
                 + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                 + i.x + vec4(0.0, i1.x, i2.x, 1.0));

        float n_ = 0.142857142857;
        vec3  ns = n_ * D.wyz - D.xzx;

        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_);

        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);

        vec4 b0 = vec4(x.xy, y.xy);
        vec4 b1 = vec4(x.zw, y.zw);

        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));

        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

        vec3 p0 = vec3(a0.xy,h.x);
        vec3 p1 = vec3(a0.zw,h.y);
        vec3 p2 = vec3(a1.xy,h.z);
        vec3 p3 = vec3(a1.zw,h.w);

        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;

        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
      }

      // Compute normal from height map gradients
      vec3 getNormal(vec3 p, float t) {
          float eps = 0.01;
          
          vec3 pX = p + vec3(eps, 0.0, 0.0);
          vec3 pY = p + vec3(0.0, eps, 0.0);
          
          float h  = pow(noise(vec3(p.x * 1.5, p.y * 0.8, t * 0.4)), 2.5) * 1.2;
          float hX = pow(noise(vec3(pX.x * 1.5, pX.y * 0.8, t * 0.4)), 2.5) * 1.2;
          float hY = pow(noise(vec3(pY.x * 1.5, pY.y * 0.8, t * 0.4)), 2.5) * 1.2;
          
          vec3 n = vec3(h - hX, h - hY, eps);
          return normalize(n);
      }

      void main() {
        vUv = uv;
        vec3 p = position;
        
        // Massive, slow-moving droplets
        float n1 = noise(vec3(p.x * 1.5, p.y * 0.8, time * 0.4));
        
        // Exaggerated extrusion for physical depth
        float displacement = pow(max(0.0, n1), 2.5) * 1.2;
        p.z += displacement;
        
        // Calculate dynamic normal based on displacement
        vec3 computedNormal = getNormal(position, time);
        
        // Transform normal to view space
        vNormal = normalMatrix * computedNormal;
        
        vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
        vViewPosition = -mvPosition.xyz;
        vWorldPosition = (modelMatrix * vec4(p, 1.0)).xyz;
        
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const fragmentShader = `
      uniform float time;
      
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      varying vec3 vWorldPosition;

      // Studio environment reflection map simulation (Vibrant Surreal Colors)
      vec3 getStudioEnvironment(vec3 refDir) {
          // No black allowed: Vibrant Silver/Blue to Golden Yellow to Fiery Orange/Red
          vec3 skyColor = vec3(0.7, 0.9, 1.0);     // Silver-Azure Blue
          vec3 horizonColor = vec3(1.0, 0.8, 0.2); // Intense Golden Yellow
          vec3 groundColor = vec3(1.0, 0.3, 0.1);  // Surreal Fiery Red/Orange
          
          vec3 color = mix(horizonColor, skyColor, smoothstep(0.0, 0.6, refDir.y));
          color = mix(color, groundColor, smoothstep(0.0, -0.6, refDir.y));
          
          // Add hot sun reflection
          float sun = max(0.0, dot(refDir, normalize(vec3(1.0, 1.0, 0.5))));
          color += vec3(1.0, 0.9, 0.7) * pow(sun, 64.0) * 1.5;
          
          return color;
      }

      void main() {
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(vViewPosition);
        
        // Reflection vector
        vec3 refDir = reflect(-viewDir, normal);
        
        // Transform refDir from view space back to world space roughly for environment
        // Assuming camera doesn't rotate much, but we can fake it
        refDir = normalize(vec3(refDir.x, refDir.y + 0.3, refDir.z));
        
        // Fresnel effect
        float fresnel = 1.0 - max(0.0, dot(viewDir, normal));
        float fresnelPow = pow(fresnel, 4.0);
        
        // Get reflection color
        vec3 envColor = getStudioEnvironment(refDir);
        
        // Base Chrome Color (Silver with warm tint)
        vec3 baseColor = vec3(0.9, 0.85, 0.8);
        
        // Iridescence (Warm spectrum: Golden, Red, Orange, Yellow)
        float iridFactor = fresnel * 2.0 + vWorldPosition.y * 0.1 + time * 0.2;
        vec3 iridColor = vec3(
            0.9 + 0.1 * cos(6.28318 * (iridFactor + 0.0)),   // High Red
            0.6 + 0.4 * cos(6.28318 * (iridFactor + 0.1)),   // Mixed Green for Gold/Orange
            0.2 + 0.2 * cos(6.28318 * (iridFactor + 0.2))    // Low Blue, keeps it warm and bright
        );
        
        // Mix everything together
        vec3 finalColor = baseColor * 0.2; // base tint
        finalColor += envColor * (0.6 + 0.4 * fresnelPow); // heavy reflection
        finalColor += iridColor * fresnelPow * 0.8; // iridescence on edges
        
        // Prevent any dark shadows (Clamping lowest values to rich orange/red)
        finalColor = max(finalColor, vec3(0.6, 0.2, 0.05)); 
        
        // Contrast curve for liquid look
        finalColor = smoothstep(0.0, 1.2, finalColor);

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    // MATERIAL
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        time: { value: 0 },
      },
      side: THREE.DoubleSide
    });

    const mesh = new THREE.Mesh(geometry, material);
    // Angle it slightly so droplets flow downwards visually
    mesh.rotation.x = -0.2;
    scene.add(mesh);

    // ANIMATION LOOP
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const render = () => {
      material.uniforms.time.value = clock.getElapsedTime();
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // RESIZE HANDLER
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // CLEANUP
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      style={{
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1,
        background: 'transparent',
        pointerEvents: 'none' // Let clicks pass through if needed, though mostly visual
      }}
    />
  );
}
