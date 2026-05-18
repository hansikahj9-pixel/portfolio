import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function CollectionRoute() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // 1. SCENE SETUP
    const scene = new THREE.Scene();
    // Orthographic camera maps the plane flat to the screen, focusing entirely on the macro surface details
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setSize(window.innerWidth, window.innerHeight);
    // Cap pixel ratio to maintain 60fps while rendering extreme density
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); 
    mountRef.current.appendChild(renderer.domElement);

    // 2. THE GEOMETRY
    // 512x512 segments provide 262,144 vertices. Essential for perfectly round, thick droplets.
    const geometry = new THREE.PlaneGeometry(2, 2, 512, 512);

    // 3. VERTEX SHADER (The Gravity Drip Math)
    const vertexShader = `
        varying vec2 vUv;
        varying vec3 vViewPosition;
        varying vec3 vWorldPosition;
        uniform float uTime;

        // Core 3D Simplex Noise
        vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
        vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
        float snoise(vec3 v){ 
            const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
            const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
            vec3 i  = floor(v + dot(v, C.yyy) );
            vec3 x0 = v - i + dot(i, C.xxx) ;
            vec3 g = step(x0.yzx, x0.xyz);
            vec3 l = 1.0 - g;
            vec3 i1 = min( g.xyz, l.zxy );
            vec3 i2 = max( g.xyz, l.zxy );
            vec3 x1 = x0 - i1 + 1.0 * C.xxx;
            vec3 x2 = x0 - i2 + 2.0 * C.xxx;
            vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
            i = mod(i, 289.0 ); 
            vec4 p = permute( permute( permute( 
                        i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                      + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
                      + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
            float n_ = 1.0/7.0;
            vec3  ns = n_ * D.wyz - D.xzx;
            vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
            vec4 x_ = floor(j * ns.z);
            vec4 y_ = floor(j - 7.0 * x_ );
            vec4 x = x_ *ns.x + ns.yyyy;
            vec4 y = y_ *ns.x + ns.yyyy;
            vec4 h = 1.0 - abs(x) - abs(y);
            vec4 b0 = vec4( x.xy, y.xy );
            vec4 b1 = vec4( x.zw, y.zw );
            vec4 s0 = floor(b0)*2.0 + 1.0;
            vec4 s1 = floor(b1)*2.0 + 1.0;
            vec4 sh = -step(h, vec4(0.0));
            vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
            vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
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
            return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
        }

        void main() {
            vUv = uv;
            float t = uTime * 0.4; // Slower time for thick, heavy viscosity
            
            // DOMAIN WARPING FOR TEARDROP SHAPES
            vec2 p = position.xy;
            // Stretch X to make streaks, move Y aggressively down to simulate dripping
            vec3 dripPos = vec3(p.x * 3.5, p.y * 2.0 + t, 0.0); 
            
            // Base Noise
            float n1 = snoise(dripPos) * 0.5 + 0.5; // normalize to 0.0 - 1.0
            
            // CRITICAL FIX: The "Thick Droplet" Math
            // Raising the noise to a high power (4.0) flattens the valleys and isolates the peaks.
            // This creates perfectly round drops pulling out of a flat common surface.
            n1 = pow(n1, 4.0); 

            // Secondary noise for smaller surface ripples running down the droplets
            float n2 = snoise(vec3(p.x * 6.0, p.y * 4.0 + t * 1.5, 10.0)) * 0.5 + 0.5;
            n2 = pow(n2, 3.0);

            // Combine droplets
            float displacement = (n1 * 0.8) + (n2 * 0.2);

            // Apply Z-displacement (pulling the droplets forward)
            vec3 newPosition = position;
            newPosition.z += displacement * 0.6;

            vWorldPosition = newPosition;
            vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);
            vViewPosition = -mvPosition.xyz;

            gl_Position = projectionMatrix * mvPosition;
        }
    `;

    // 4. FRAGMENT SHADER (The Studio Silver & Rainbow Tint)
    const fragmentShader = `
        varying vec2 vUv;
        varying vec3 vViewPosition;
        varying vec3 vWorldPosition;
        uniform float uTime;

        // Inigo Quilez Palette
        vec3 palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d ) {
            return a + b*cos( 6.28318*(c*t+d) );
        }

        // Procedural HDRI Environment (The secret to realistic silver chrome)
        vec3 getStudioEnvironment(vec3 rayDir) {
            // Background gradient simulating a dark grey studio
            float gradient = rayDir.y * 0.5 + 0.5;
            vec3 bg = mix(vec3(0.02, 0.02, 0.03), vec3(0.2, 0.2, 0.22), gradient);
            
            // Procedural Softbox Light 1 (Top overhead white light)
            float light1 = smoothstep(0.85, 0.98, dot(rayDir, normalize(vec3(0.0, 1.0, 0.5))));
            // Procedural Softbox Light 2 (Side rim light)
            float light2 = smoothstep(0.9, 0.99, dot(rayDir, normalize(vec3(-1.0, 0.5, 0.0))));
            
            return bg + (vec3(1.0) * light1) + (vec3(0.8, 0.9, 1.0) * light2);
        }

        void main() {
            // 1. CALCULUS NORMALS FOR PERFECT GLOSS
            vec3 fdx = dFdx(vWorldPosition);
            vec3 fdy = dFdy(vWorldPosition);
            vec3 normal = normalize(cross(fdx, fdy));
            vec3 viewDir = normalize(vViewPosition);

            // 2. THE SILVER CHROME MIRROR EFFECT
            // Reflect the view vector off the droplet's normal
            vec3 reflectionVector = reflect(-viewDir, normal);
            
            // Sample our fake procedural studio room
            vec3 chromeReflection = getStudioEnvironment(reflectionVector);

            // 3. THIN-FILM INTERFERENCE (The Rainbow Gradation)
            // Calculate Fresnel (grazing angles vs front-facing)
            float fresnel = 1.0 - max(dot(normal, viewDir), 0.0);
            fresnel = pow(fresnel, 2.5); // Tighten the bands precisely to the edges

            // The exact Magenta, Gold, Cyan spectrum
            vec3 iridA = vec3(0.5, 0.5, 0.5);
            vec3 iridB = vec3(0.5, 0.5, 0.5);
            vec3 iridC = vec3(1.0, 1.0, 1.0);
            vec3 iridD = vec3(0.00, 0.33, 0.67);
            
            // Generate the iridescent color based on the curve of the drop
            vec3 iridColor = palette(fresnel * 3.0 + (uTime * 0.1), iridA, iridB, iridC, iridD);

            // 4. BLENDING THE METALS
            // Base is pure shiny silver. 
            vec3 finalColor = chromeReflection;
            
            // CRITICAL: We DO NOT paint the whole mesh rainbow. 
            // We only tint the shiny reflections with the iridescent color at the grazing angles.
            finalColor = mix(finalColor, finalColor * iridColor * 2.5, fresnel * 0.85);

            // Blinding specular peak (the white dot in the image)
            float spec = pow(max(dot(reflectionVector, normalize(vec3(0.5, 1.0, 1.0))), 0.0), 120.0);
            finalColor += vec3(1.0) * spec * 1.5;

            // Deepen the shadows (contrast mapping)
            finalColor = smoothstep(0.0, 1.0, finalColor);
            finalColor = pow(finalColor, vec3(1.1)); // Slight crush for richer darks

            gl_FragColor = vec4(finalColor, 1.0);
        }
    `;

    // 5. MATERIAL COMPILATION
    const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
            uTime: { value: 0 }
        },
        // WebGL standard derivatives must be enabled for the procedural normals to calculate the shine
        extensions: { derivatives: true }
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // 6. ANIMATION LOOP
    const clock = new THREE.Clock();
    let animationId: number;
    
    function animate() {
        animationId = requestAnimationFrame(animate);
        material.uniforms.uTime.value = clock.getElapsedTime();
        renderer.render(scene, camera);
    }

    // 7. VIEWPORT RESIZING
    const handleResize = () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        const aspect = window.innerWidth / window.innerHeight;
        if (aspect > 1) {
            camera.left = -aspect; camera.right = aspect;
            camera.top = 1; camera.bottom = -1;
        } else {
            camera.left = -1; camera.right = 1;
            camera.top = 1 / aspect; camera.bottom = -1 / aspect;
        }
        camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef}
      style={{
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1,
        backgroundColor: '#020202', // Match the provided HTML background
        pointerEvents: 'none'
      }}
    >
      <div 
        id="loading"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'rgba(255,255,255,0.3)',
          fontFamily: '"Geist Sans", -apple-system, sans-serif',
          letterSpacing: '0.3em',
          fontSize: '11px',
          pointerEvents: 'none',
          transition: 'opacity 0.5s',
          textTransform: 'uppercase',
          opacity: 0 // Assume it loads instantly in React local bundle
        }}
      >
        Synthesizing Mercury...
      </div>
    </div>
  );
}
