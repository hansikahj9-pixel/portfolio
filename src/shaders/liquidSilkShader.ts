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

    // ── STUDIO LIGHTING COLORS ──
    const vec3 C_VOID     = vec3(0.01, 0.005, 0.05); // Deep midnight purple shadows
    const vec3 C_SILK     = vec3(0.45, 0.05, 0.85); // Vibrant magenta-purple base
    const vec3 C_ORCHID   = vec3(1.0, 0.20, 1.0);   // Glowing orchid peak (vibrant pink)
    const vec3 C_RIM      = vec3(0.0, 0.94, 1.0);   // Electric cyan iridescence
    const vec3 C_SPECULAR = vec3(1.0, 1.0, 1.0);    // High-energy white flare

    // ── DISTORTION & NOISE Engine (6 Octaves Optimized) ──
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

    float getNoise(vec2 p, float t) {
      float n = 0.0;
      float a = 0.5;
      vec2 shift = vec2(100.0);
      mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
      for (int i = 0; i < 6; i++) { 
        n += a * abs(snoise(vec3(p, t)));
        p = rot * p * 2.1 + shift;
        a *= 0.5;
      }
      return n;
    }

    void main() {
      // Use window-relative resolution directly for safety
      vec2 res = uResolution.xy;
      vec2 uv = gl_FragCoord.xy / res;
      float aspect = res.x / res.y;
      vec2 p = (uv - 0.5) * vec2(aspect, 1.0) * 2.0;
      
      float t = uTime * 0.15;
      
      // ── MOUSE INTERACTION ──
      vec2 mP = (uMouse - 0.5) * vec2(aspect, 1.0) * 2.0;
      float mD = length(p - mP);
      float mI = smoothstep(0.8, 0.0, mD) * 0.5;
      
      // ── VISCOUS FLUID DYNAMICS (Domain Warping) ──
      float n1 = getNoise(p * 0.5, t);
      vec2 q = vec2(getNoise(p + n1 + t*0.05, t*0.2), getNoise(p + vec2(5.2, 1.3) + n1, t*0.3));
      
      float n2 = getNoise(p + q*2.5 + mI, t*0.4);
      vec2 r = vec2(getNoise(p + n2 + vec2(1.7, 9.2), t*0.1), getNoise(p + n2 + vec2(8.3, 2.8), t*0.2));
      
      // h is our final "heightmap" or density of the silk
      float h = getNoise(p + r*1.5 + q*0.5, t*0.5);
      
      // ── SURFACE RECONSTRUCTION (Normals) ──
      float e = 0.005;
      float hX = getNoise(p + vec2(e, 0.0) + r*1.5, t*0.5);
      float hY = getNoise(p + vec2(0.0, e) + r*1.5, t*0.5);
      vec3 normal = normalize(vec3((h - hX)/e, (h - hY)/e, 0.15));
      
      // ── LIGHTING MODEL ──
      vec3 view = vec3(0.0, 0.0, 1.0);
      vec3 light1 = normalize(vec3(1.0, 1.5, 2.0));  // Main Key
      vec3 light2 = normalize(vec3(-1.5, -0.5, 1.0)); // Deep side fill
      
      float diff = max(dot(normal, light1), 0.0);
      float fresnel = pow(1.0 - max(dot(normal, view), 0.0), 4.0);
      
      // Specular for the metallic sheen
      vec3 refl = reflect(-light1, normal);
      float spec = pow(max(dot(refl, view), 0.0), 128.0);
      
      // ── COLOR COMPOSITION ──
      // Base mix: Shadows -> Main Silk -> Orchid Highlight
      vec3 color = mix(C_VOID, C_SILK, smoothstep(0.0, 0.5, h));
      color = mix(color, C_ORCHID, smoothstep(0.4, 0.9, h));
      
      // Iridescent Edges (Cyan)
      color = mix(color, C_RIM, fresnel * 0.9);
      
      // Metallic Gloss/Specularity
      color += C_SPECULAR * spec * 8.0;
      color += C_RIM * pow(fresnel, 2.0) * 2.0;
      
      // Enhance depth in folds
      color *= smoothstep(-0.1, 1.0, h);
      
      // Contrast boost
      color = pow(color, vec3(1.1));

      gl_FragColor = vec4(color, 1.0);
    }


  `
};
