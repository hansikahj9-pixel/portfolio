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

    // AXIOMÉ LIQUID SILK PALETTE
    vec3 deepPurple = vec3(0.18, 0.04, 0.28); // Deep shadow
    vec3 orchid     = vec3(0.49, 0.13, 0.81); // Main body
    vec3 radiant    = vec3(0.75, 0.52, 0.99); // Highlight orchid
    vec3 cyan       = vec3(0.02, 0.71, 0.83); // Specular cyan accent

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

    // ── SILK FLOW FUNCTION (Domain Warping) ──
    float getSilkFlow(vec2 p) {
      float t = uTime * 0.12;
      
      // Domain Warping for viscous flow
      vec2 q = vec2(
        snoise(vec3(p * 1.5, t)),
        snoise(vec3(p * 1.8 + vec2(1.2, 3.4), t * 1.1))
      );
      
      vec2 r = vec2(
        snoise(vec3(p * 2.2 + q * 1.5, t * 0.5)),
        snoise(vec3(p * 2.5 + q * 1.2 + vec2(5.2, 1.3), t * 0.8))
      );
      
      float noise = snoise(vec3(p * 3.0 + r * 2.0, t * 1.5));
      
      // Add ripples around mouse
      float dist = distance(p, uMouse);
      noise += sin(dist * 10.0 - uTime * 2.0) * exp(-dist * 5.0) * 0.2;
      
      return noise;
    }

    void main() {
      float aspect = uResolution.x / (uResolution.y + 1e-6);
      vec2 p = (vUv - 0.5) * vec2(aspect, 1.0);
      
      // 1. ANALYTICAL NORMALS for realistic lighting
      float e = 0.005;
      float h = getSilkFlow(p);
      float hL = getSilkFlow(p - vec2(e, 0.0));
      float hR = getSilkFlow(p + vec2(e, 0.0));
      float hD = getSilkFlow(p - vec2(0.0, e));
      float hU = getSilkFlow(p + vec2(0.0, e));
      
      // Calculate surface normal
      vec3 normal = normalize(vec3(hL - hR, hD - hU, 0.15));
      
      // 2. LIGHTING & COLOR
      vec3 viewDir = vec3(0.0, 0.0, 1.0);
      vec3 lightDir = normalize(vec3(0.5, 0.7, 1.0));
      vec3 halfway = normalize(lightDir + viewDir);
      
      // Metallic Specular
      float spec = pow(max(0.0, dot(normal, halfway)), 64.0);
      float fresnel = pow(1.0 - max(0.0, dot(normal, viewDir)), 4.0);
      
      // Color Mapping based on height and normal deviation
      vec3 color = mix(deepPurple, orchid, smoothstep(-1.0, 0.2, h));
      color = mix(color, radiant, smoothstep(0.2, 0.8, h));
      
      // 3. IRIDESCENCE (Normal-based shift)
      float irid = dot(normal, vec3(0.0, 1.0, 0.5));
      color = mix(color, cyan, smoothstep(0.7, 1.2, irid + h * 0.5));
      
      // 4. REFLECTION & HIGHLIGHTS
      vec3 specularColor = cyan * spec * 2.5;
      vec3 sheen = radiant * fresnel * 0.8;
      
      vec3 finalColor = color + specularColor + sheen;
      
      // Soft vignette for premium look
      float vignette = smoothstep(1.5, 0.5, length(vUv - 0.5) * 1.5);
      finalColor *= vignette;

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
};
