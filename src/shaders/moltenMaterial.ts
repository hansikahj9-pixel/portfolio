export const moltenMaterialShader = {
  uniforms: {
    uTime: { value: 0 },
    uMouse: { value: [0.5, 0.5] },
    uResolution: { value: [1, 1] }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    precision highp float;
    varying vec2 vUv;
    uniform float uTime;
    uniform vec2 uMouse;
    uniform vec2 uResolution;

    // COLORS (The Axiomé Metallic Palette)
    vec3 colorSilver = vec3(0.92, 0.92, 0.95); // High-luster Silver
    vec3 colorOrange = vec3(0.91, 0.48, 0.25); // Metallic Jaffa
    vec3 colorRed = vec3(0.85, 0.15, 0.20);    // Metallic Haute Red

    // ── 3D Simplex Noise ──
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

    float snoise(vec3 v) {
      const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
      const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

      vec3 i  = floor(v + dot(v, C.yyy) );
      vec3 x0 = v - i + dot(i, C.xxx) ;

      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );

      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;

      i = mod289(i);
      vec4 p = permute( permute( permute(
                  i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
                + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

      float n_ = 0.142857142857;
      vec3  ns = n_ * D.wyz - D.xzx;

      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

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
      return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                    dot(p2,x2), dot(p3,x3) ) );
    }

    void main() {
        vec2 uv = vUv;
        
        // Correct aspect ratio for wave calculation
        float aspect = uResolution.x / uResolution.y;
        uv.x *= aspect;
        vec2 mouse = vec2(uMouse.x * aspect, uMouse.y);
        
        // 1. Fluid Wave Pattern (Smooth 3D Simplex)
        // Low frequency noise = Larger, smoother waves (No Grain)
        float noise = snoise(vec3(uv * 1.8, uTime * 0.15));
        float mouseDist = length(uv - mouse);
        float ripple = sin(mouseDist * 12.0 - uTime * 3.0) * exp(-mouseDist * 3.0);
        float waveHeight = noise + (ripple * 0.4);

        // 2. High-End Material Math (Blinn-Phong)
        // We calculate "Normals" with a wide step to avoid pixel dots
        float e = 0.02; // Smoothing Factor
        float n1 = snoise(vec3((uv + vec2(e, 0.0)) * 1.8, uTime * 0.15));
        float n2 = snoise(vec3((uv - vec2(e, 0.0)) * 1.8, uTime * 0.15));
        float n3 = snoise(vec3((uv + vec2(0.0, e)) * 1.8, uTime * 0.15));
        float n4 = snoise(vec3((uv - vec2(0.0, e)) * 1.8, uTime * 0.15));
        vec3 normal = normalize(vec3(n1 - n2, n3 - n4, 0.1));

        // 3. The "Glass" Reflection (Fresnel + Specular)
        vec3 lightDir = normalize(vec3(0.5, 0.5, 1.0));
        vec3 viewDir = vec3(0.0, 0.0, 1.0);
        vec3 halfway = normalize(lightDir + viewDir);
        
        // Smooth Specular: Wider power (32.0 instead of 128.0) kills the dots
        float spec = pow(max(0.0, dot(normal, halfway)), 32.0);
        float fresnel = pow(1.0 - max(0.0, dot(normal, viewDir)), 3.5);

        // 4. Color Interpolation (Metallic Glow)
        // Ensures orange/red glow from the valleys of the silver surface
        vec3 color = mix(colorSilver, colorOrange, smoothstep(0.1, 0.6, waveHeight));
        color = mix(color, colorRed, smoothstep(0.7, 0.9, waveHeight));
        
        // 5. Final Output (Mirror Finish)
        vec3 reflection = vec3(1.0) * spec * 2.2;
        vec3 glassEdges = vec3(1.0) * fresnel * 1.2;
        
        gl_FragColor = vec4(color + reflection + glassEdges, 1.0);
    }
  `
};
