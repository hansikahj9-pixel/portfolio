export const liquidChromeShader = {
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

    // COLORS
    vec3 silver = vec3(0.941, 0.941, 0.941); // #F0F0F0
    vec3 orange = vec3(0.910, 0.478, 0.247); // #E87A3F
    vec3 yellow = vec3(0.898, 0.745, 0.369); // #E5BE5E

    // ── Simplex Noise 2D ── (Optimized, no overloading)
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy));
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod289(i);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m;
      m = m*m;
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

    void main() {
        vec2 uv = vUv;
        
        // Correct aspect ratio for the wave calculation
        float aspect = uResolution.x / uResolution.y;
        uv.x *= aspect;
        vec2 mMouse = vec2(uMouse.x * aspect, uMouse.y);
        
        // 1. Fluid Dynamics (The Wave Pattern) - Scale: 1.5
        float dist = length(uv - mMouse);
        float ripple = sin(dist * 22.0 - uTime * 3.5) * exp(-dist * 5.0);
        float wave = snoise(uv * 1.5 + vec2(uTime * 0.1)) + (ripple * 0.7);

        // 2. Creating the "Glass" Ridges (Normal Mapping with smoothing)
        float e = 0.005; 
        float n1 = snoise((uv + vec2(e,  0.0)) * 1.5 + vec2(uTime * 0.1));
        float n2 = snoise((uv - vec2(e,  0.0)) * 1.5 + vec2(uTime * 0.1));
        float n3 = snoise((uv + vec2(0.0, e)) * 1.5 + vec2(uTime * 0.1));
        float n4 = snoise((uv - vec2(0.0, e)) * 1.5 + vec2(uTime * 0.1));
        
        // Use normalized gradients for normals
        vec3 normal = normalize(vec3(n1 - n2, n3 - n4, 0.1));

        // 3. Lighting (The Diamond Shine - Wider and Softer)
        vec3 lightDir = normalize(vec3(0.5, 0.5, 1.0));
        vec3 viewDir = vec3(0.0, 0.0, 1.0);
        vec3 halfDir = normalize(lightDir + viewDir);
        
        // Specular power set to 32.0 as requested for smooth shine
        float spec = pow(max(0.0, dot(normal, halfDir)), 32.0); 
        
        // Fresnel for glass edges
        float fresnel = pow(1.0 - max(0.0, dot(normal, viewDir)), 3.0);

        // 4. Final Color Assembly
        // Smooth color blending to avoid muddy look
        vec3 color = mix(silver, orange, smoothstep(0.1, 0.6, wave));
        color = mix(color, yellow, smoothstep(0.7, 0.9, wave));
        
        // Add metallic highlights
        // Specular hits and Fresnel edges combined for glass look
        vec3 specColor = vec3(1.0) * spec * 1.5;
        vec3 fresColor = vec3(1.0) * fresnel * 0.8;

        gl_FragColor = vec4(color + specColor + fresColor, 1.0);
    }
  `
};
