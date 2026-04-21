export const liquidSilkShader = {
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

    // AXIOMÉ COLOR ARCHITECTURE (Refined for High Contrast)
    vec3 deepShadow = vec3(0.04, 0.01, 0.08); // Near black purple
    vec3 basePurple = vec3(0.18, 0.04, 0.28); 
    vec3 orchid     = vec3(0.49, 0.13, 0.81); 
    vec3 radiant    = vec3(0.75, 0.52, 0.99); 
    vec3 highlight  = vec3(0.95, 0.95, 1.0);  // Specular white
    vec3 cyanAccent = vec3(0.02, 0.71, 0.83);

    // ── 3D SIMPLEX NOISE ENGINE ──
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

    float snoise(vec3 v) {
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
      vec4 j = p - 49.0 * floor(p * (1.0/49.0));
      vec4 x_ = floor(j * (1.0/7.0));
      vec4 y_ = floor(j - 7.0 * x_);
      vec4 x = x_ * (1.0/7.0) + 0.5/7.0 - 0.5;
      vec4 y = y_ * (1.0/7.0) + 0.5/7.0 - 0.5;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }

    // ── FRACTAL BROWNIAN MOTION (Dimensionality) ──
    float fbm(vec3 p) {
      float value = 0.0;
      float amplitude = 0.5;
      for (int i = 0; i < 5; i++) {
        value += amplitude * abs(snoise(p));
        p *= 2.0;
        amplitude *= 0.5;
      }
      return value;
    }

    float getSilkHeight(vec2 p) {
      float t = uTime * 0.05;
      
      // Multi-stage domain warping for "Thick" folds
      vec2 noiseCoord = p * 1.5;
      
      float warp1 = fbm(vec3(noiseCoord, t));
      vec2 q = vec2(warp1, fbm(vec3(noiseCoord + vec2(1.2, 4.3), t * 1.1)));
      
      float warp2 = fbm(vec3(noiseCoord + q * 1.8, t * 0.7));
      vec2 r = vec2(warp2, fbm(vec3(noiseCoord + q * 1.5 + vec2(5.1, 1.9), t * 0.9)));
      
      float h = fbm(vec3(noiseCoord + r * 2.2, t * 1.2));
      
      // Interaction ripples
      float dist = distance(p, uMouse);
      h += sin(dist * 12.0 - uTime * 2.5) * exp(-dist * 4.0) * 0.15;
      
      return h;
    }

    void main() {
      float aspect = uResolution.x / (uResolution.y + 1e-6);
      vec2 p = (vUv - 0.5) * vec2(aspect, 1.0);
      
      // Normalize UV for vignettes
      vec2 uv = vUv;

      // ── 1. NORMALS ──
      float e = 0.003; // Sharper sampling for silk detail
      float h = getSilkHeight(p);
      float hL = getSilkHeight(p - vec2(e, 0.0));
      float hR = getSilkHeight(p + vec2(e, 0.0));
      float hD = getSilkHeight(p - vec2(0.0, e));
      float hU = getSilkHeight(p + vec2(0.0, e));
      
      vec3 normal = normalize(vec3(hL - hR, hD - hU, 0.08));

      // ── 2. LIGHTING (Blinn-Phong) ──
      vec3 viewDir = vec3(0.0, 0.0, 1.0);
      vec3 lightPos1 = vec3(1.2, 1.5, 2.0); // Primary highlight
      vec3 lightPos2 = vec3(-1.0, -0.5, 1.5); // Rim highlight
      
      vec3 lightDir1 = normalize(lightPos1);
      vec3 lightDir2 = normalize(lightPos2);
      
      float diff1 = max(dot(normal, lightDir1), 0.0);
      float diff2 = max(dot(normal, lightDir2), 0.0);
      
      vec3 reflectDir = reflect(-lightDir1, normal);
      float spec = pow(max(dot(viewDir, reflectDir), 0.0), 128.0); // Tight specular
      
      // ── 3. COLOR MAPPING ──
      // Height-based mixing for base tones
      vec3 color = mix(deepShadow, basePurple, smoothstep(-0.2, 0.3, h));
      color = mix(color, orchid, smoothstep(0.3, 0.6, h));
      color = mix(color, radiant, smoothstep(0.6, 1.0, h));

      // Normal-based iridescence (Cyan edges)
      float irid = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);
      color = mix(color, cyanAccent, irid * 0.6);

      // ── 4. FINAL COMPOSITION ──
      // Specular highlights (High power white)
      vec3 finalColor = color + (highlight * spec * 2.8);
      
      // Ambient Occlusion (Darken valleys)
      finalColor = mix(deepShadow * 0.5, finalColor, smoothstep(0.0, 0.4, h));
      
      // Vivid diffuse boosts
      finalColor += orchid * diff1 * 0.3;
      finalColor += cyanAccent * diff2 * 0.2;

      // Soft vignette for focus
      float vignette = smoothstep(1.3, 0.4, length(vUv - 0.5));
      finalColor *= vignette;

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
};
