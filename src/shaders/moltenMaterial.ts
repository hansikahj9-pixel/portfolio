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

    // AXIOMÉ METALLIC PALETTE (Dark Jewelry Base + Vibrant Core)
    vec3 darkSilver = vec3(0.20, 0.20, 0.24); // Oxidized dark silver
    vec3 orange     = vec3(0.91, 0.48, 0.25); // Metallic Jaffa
    vec3 red        = vec3(0.85, 0.15, 0.20); // Metallic Haute Red
    vec3 yellow     = vec3(0.90, 0.75, 0.36); // Yarrow Yellow

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

    // HIGH-VISCOSITY WAVE FUNCTION (Pinterest Swirl)
    float getWaves(vec2 p, vec2 mouseCoord) {
        // 1. Fluid Drag: The cursor pulls the space around it
        float dist = distance(p, mouseCoord);
        float dragForce = exp(-dist * 4.5);
        vec2 warpedP = p - normalize(p - mouseCoord + 0.001) * dragForce * 0.15;

        // 2. Heavy Noise
        float time = uTime * 0.15;
        float w = snoise(vec3(warpedP * 1.8, time));
        w += snoise(vec3(warpedP * 3.5, time * 1.2)) * 0.4;
        
        // 3. Touch Depression
        w += sin(dist * 12.0 - uTime * 2.0) * dragForce * 0.5;
        return w;
    }

    void main() {
        vec2 uv = vUv;
        float aspect = uResolution.x / uResolution.y;
        uv.x *= aspect;
        vec2 mouse = vec2(uMouse.x * aspect, uMouse.y);

        // 1. ANALYTICAL NORMALS
        float e = 0.01; 
        float h = getWaves(uv, mouse);
        float hL = getWaves(uv - vec2(e, 0.0), mouse);
        float hR = getWaves(uv + vec2(e, 0.0), mouse);
        float hD = getWaves(uv - vec2(0.0, e), mouse);
        float hU = getWaves(uv + vec2(0.0, e), mouse);
        
        vec3 normal = normalize(vec3(hL - hR, hD - hU, 0.2));

        // 2. LIGHTING (Controlled Jewelry Shine)
        vec3 lightDir = normalize(vec3(0.5, 0.6, 1.0));
        vec3 viewDir = vec3(0.0, 0.0, 1.0);
        vec3 halfway = normalize(lightDir + viewDir);
        
        // Tighter, sharper specular to prevent white blowout
        float spec = pow(max(0.0, dot(normal, halfway)), 48.0);
        float fresnel = pow(1.0 - max(0.0, dot(normal, viewDir)), 5.0);

        // 3. MORE VIBRANT COLOR ASSEMBLY
        // Expand the smoothstep ranges so the colors show up more than the dark silver
        vec3 color = mix(darkSilver, orange, smoothstep(0.0, 0.4, h));
        color = mix(color, red, smoothstep(0.4, 0.65, h));
        color = mix(color, yellow, smoothstep(0.65, 1.0, h));
        
        // 4. FINAL OUTPUT
        vec3 reflection = vec3(1.0) * spec * 1.5; // Reduced intensity
        vec3 glassEdge = vec3(0.8, 0.8, 0.9) * fresnel * 0.8; // Subtle edge
        
        vec3 finalOutput = color + reflection + glassEdge;
        
        gl_FragColor = vec4(finalOutput, 1.0);
    }
  `
};
