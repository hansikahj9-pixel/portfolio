import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Import all images from the lookbook directory dynamically
const lookbookImages = import.meta.glob('../assets/lookbook/*.png', { eager: true, import: 'default' });

// Get the original paths (keys) and sort them numerically based on the filename
const sortedKeys = Object.keys(lookbookImages).sort((a, b) => {
  const numA = parseInt(a.match(/(\d+)\.png$/)?.[1] || "0", 10);
  const numB = parseInt(b.match(/(\d+)\.png$/)?.[1] || "0", 10);
  return numA - numB;
});

// Map the sorted keys to their resolved module values
const images = sortedKeys.map(key => lookbookImages[key] as string);

const garments = [
  {
    name: "L'Ange du Foyer",
    description: "Metallic navy satin bodice with off-white organza bishop sleeves. Tiered, undulating wave-skirt engineered in cream and forest green felt to hold a rigid, geology-inspired shape.",
    images: [images[0]]
  },
  {
    name: "Galatea of the Spheres",
    description: "Asymmetrical evening gown in high-sheen crimson taffeta. Features a massive architectural bow-puff wrapping the torso and a sweeping side-cape train with high thigh-slit.",
    images: [images[1]]
  },
  {
    name: "The Elephants of Celebes",
    description: "Charcoal jersey mini-dress with high-contrast vertical pleated bands in crimson and emerald silk-satin, creating a ribbed texture resembling petrified tree trunks.",
    images: [images[2], images[3]]
  },
  {
    name: "Swans Reflecting Silk",
    description: "High-volume structural ensemble. Emerald-teal metallic dupioni silk off-the-shoulder cape frames a sun-yellow canvas bubble skirt finished with bias piping.",
    images: [images[4]]
  },
  {
    name: "Europe After the Rain",
    description: "Pleated silk organza bodice with origami sunburst folds. Cinched waist transitions into a highly reflective ocean-blue and teal silk-satin fluid cascading train.",
    images: [images[5], images[6]]
  },
  {
    name: "The Persistence of Fluidity",
    description: "Strapless canvas column dress beneath an ultra-voluminous balloon-sleeved organza bolero. Waist wrapped in highly reflective orange, navy, and cream satin sashes.",
    images: [images[7], images[8]]
  },
  {
    name: "The Forest and the Dove",
    description: "Fitted grid-quilted tube mini-dress in gold-champagne satin, flanked by oversized, semi-circular pleated fan-wings engineered with rigid silver-grey and beige piping.",
    images: [images[9], images[10]]
  },
  {
    name: "The Accommodations of Desire",
    description: "High-volume spherical cocoon dress. Bright primary red, yellow, and cream vertically striped canvas with massive statement balloon sleeves creating a perfect circular outline.",
    images: [images[11]]
  },
  {
    name: "Ubu Imperator",
    description: "Sculptural column gown featuring a vertically ruched pumpkin-orange core, flanked by sweeping three-dimensional metallic silver taffeta panels flaring out like protective armor.",
    images: [images[12]]
  },
  {
    name: "The Disintegration of Persistence",
    description: "Cropped, off-the-shoulder metallic navy shrug with puff sleeves flowing into a dramatic side train, juxtaposed against a structural, high-waisted off-white canvas wrap mini-skirt.",
    images: [images[13]]
  },
  {
    name: "Nightingale's Threat",
    description: "Sleeveless bright sun-yellow canvas column maxi dress. A massive, three-dimensional undulating wave of thick red, teal, and cream felt projects boldly from the center.",
    images: [images[14]]
  },
  {
    name: "The Sacrament of Geometry",
    description: "Navy column gown with integrated high-neck mask. Wrapped by a gathered emerald dupioni silk cocoon puff and backed by a rigid, translucent ice-blue organza radial halo.",
    images: [images[15]]
  }
];

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
        uniform vec2 uScale;

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
            // Apply scale to prevent distortion when the mesh expands to fill the screen
            vec2 p = position.xy * uScale;
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
            
            // Procedural Softbox Light 1 (Top overhead white light) - Boosted intensity
            float light1 = smoothstep(0.85, 0.98, dot(rayDir, normalize(vec3(0.0, 1.0, 0.5))));
            // Procedural Softbox Light 2 (Side rim light) - Boosted intensity
            float light2 = smoothstep(0.9, 0.99, dot(rayDir, normalize(vec3(-1.0, 0.5, 0.0))));
            
            return bg + (vec3(1.6) * light1) + (vec3(1.2, 1.35, 1.5) * light2);
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
            // Base is pure shiny silver. Boosted by 1.35x for ultra-vivid liquid metal look.
            vec3 finalColor = chromeReflection * 1.35;
            
            // CRITICAL: We DO NOT paint the whole mesh rainbow. 
            // We only tint the shiny reflections with the iridescent color at the grazing angles.
            finalColor = mix(finalColor, finalColor * iridColor * 2.5, fresnel * 0.85);

            // Blinding specular peak (the white dot in the image) - Boosted to 2.5 for intense glints
            float spec = pow(max(dot(reflectionVector, normalize(vec3(0.5, 1.0, 1.0))), 0.0), 120.0);
            finalColor += vec3(1.0) * spec * 2.5;

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
            uTime: { value: 0 },
            uScale: { value: new THREE.Vector2(1, 1) }
        },
        // WebGL standard derivatives must be enabled for the procedural normals to calculate the shine
        // @ts-ignore
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
        let scaleX = 1;
        let scaleY = 1;
        if (aspect > 1) {
            camera.left = -aspect; camera.right = aspect;
            camera.top = 1; camera.bottom = -1;
            scaleX = aspect;
        } else {
            camera.left = -1; camera.right = 1;
            camera.top = 1 / aspect; camera.bottom = -1 / aspect;
            scaleY = 1 / aspect;
        }
        camera.updateProjectionMatrix();
        mesh.scale.set(scaleX, scaleY, 1);
        material.uniforms.uScale.value.set(scaleX, scaleY);
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
    <>
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

      {/* Lookbook Content Overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 10,
        width: '100%',
        height: '100vh',
        overflowY: 'auto',
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '120px 0', // Space at top and bottom
        gap: '100px', // Space in between images
        boxSizing: 'border-box'
      }}>
        {garments.map((garment, index) => (
          <div
            key={index}
            style={{
              width: '85vw',
              background: '#fdfdfd',
              padding: 'clamp(30px, 5vw, 60px)',
              paddingBottom: 'clamp(30px, 5vw, 60px)',
              boxShadow: '0 60px 120px rgba(0,0,0,0.45), 0 10px 30px rgba(0,0,0,0.2)',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              borderRadius: '0px',
              // Creative inset outline
              outline: '1px solid rgba(0,0,0,0.08)',
              outlineOffset: '-20px',
            }}
          >
            {/* ── Editorial Header Block (ABOVE images) ── */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: 'clamp(20px, 3vw, 40px)',
              paddingBottom: 'clamp(15px, 2vw, 25px)',
              borderBottom: '1px solid rgba(0,0,0,0.06)',
            }}>
              {/* Left: Name + Description */}
              <div style={{ flex: 1, maxWidth: '75%' }}>
                <div style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.6rem',
                  letterSpacing: '0.5em',
                  color: 'rgba(0,0,0,0.35)',
                  textTransform: 'uppercase',
                  marginBottom: '10px',
                }}>
                  Look {(index + 1).toString().padStart(2, '0')}
                </div>
                <h2 style={{
                  fontFamily: 'var(--font-serif, "Playfair Display", Georgia, serif)',
                  fontSize: 'clamp(2.5rem, 5.5vw, 6rem)',
                  fontWeight: 400,
                  fontStyle: 'italic',
                  lineHeight: 0.95,
                  color: '#0a0a0a',
                  margin: 0,
                  textShadow: '2px 4px 12px rgba(0,0,0,0.08)',
                  letterSpacing: '-0.02em',
                }}>
                  {garment.name}
                </h2>
                <div style={{
                  marginTop: 'clamp(12px, 2vw, 22px)',
                  paddingLeft: '18px',
                  borderLeft: '4px solid #0a0a0a',
                }}>
                  <p style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 'clamp(1rem, 1.8vw, 1.35rem)',
                    lineHeight: 1.65,
                    color: 'rgba(0,0,0,0.55)',
                    margin: 0,
                    textShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    fontWeight: 300,
                  }}>
                    {garment.description}
                  </p>
                </div>
              </div>

              {/* Right: Index number watermark */}
              <div style={{
                fontFamily: 'var(--font-serif, "Playfair Display", Georgia, serif)',
                fontSize: 'clamp(4rem, 8vw, 9rem)',
                fontWeight: 300,
                fontStyle: 'italic',
                color: 'rgba(0,0,0,0.04)',
                lineHeight: 1,
                marginTop: '-10px',
                userSelect: 'none',
              }}>
                {(index + 1).toString().padStart(2, '0')}
              </div>
            </div>

            {/* ── Garment Images ── */}
            {garment.images.map((src, imgIdx) => (
              <img 
                key={imgIdx}
                src={src}
                alt={`${garment.name} - View ${imgIdx + 1}`}
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 15px 35px rgba(0,0,0,0.15))',
                  marginBottom: imgIdx !== garment.images.length - 1 ? '40px' : '0'
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
