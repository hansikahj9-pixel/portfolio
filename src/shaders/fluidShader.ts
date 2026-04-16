export const fluidVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

export const fluidFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform vec3 uColor;
  varying vec2 vUv;

  #define PI 3.14159265359

  // Simplex-style noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                         -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 uv = vUv;
    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
    vec2 scaledUv = uv * aspect;
    vec2 mouse = uMouse * aspect;

    float dist = distance(scaledUv, mouse);

    // Base fluid noise
    float t = uTime * 0.15;
    float n1 = snoise(scaledUv * 2.0 + vec2(t, t * 0.7));
    float n2 = snoise(scaledUv * 4.0 - vec2(t * 0.5, t * 1.2));
    float n3 = snoise(scaledUv * 1.5 + vec2(n1 * 0.5, n2 * 0.5));

    float flowField = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;

    // Mouse interaction - fluid ripple
    float mouseInfluence = smoothstep(0.5, 0.0, dist);
    float mouseRipple = sin(dist * 25.0 - uTime * 3.0) * mouseInfluence * 0.3;
    float mouseSwirl = snoise(scaledUv * 3.0 + uMouse * 2.0 + uTime * 0.5) * mouseInfluence;

    flowField += mouseRipple + mouseSwirl * 0.4;

    // Color blend
    float intensity = smoothstep(-0.6, 0.8, flowField);
    vec3 darkBase = vec3(0.02, 0.02, 0.02);
    vec3 color = mix(darkBase, uColor * 0.35, intensity * 0.7);

    // Mouse glow area
    float glow = smoothstep(0.4, 0.0, dist) * 0.3;
    color += uColor * glow * (0.5 + mouseRipple);

    // Subtle vignette
    float vignette = 1.0 - smoothstep(0.3, 1.2, length(uv - 0.5) * 1.4);
    color *= vignette;

    gl_FragColor = vec4(color, 1.0);
  }
`;

export const gradientFluidFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  varying vec2 vUv;

  #define PI 3.14159265359

  // Simplex-style noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                         -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 uv = vUv;
    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
    vec2 scaledUv = uv * aspect;
    vec2 mouse = uMouse * aspect;

    float dist = distance(scaledUv, mouse);

    // Base fluid noise
    float t = uTime * 0.15;
    float n1 = snoise(scaledUv * 2.0 + vec2(t, t * 0.7));
    float n2 = snoise(scaledUv * 4.0 - vec2(t * 0.5, t * 1.2));
    float n3 = snoise(scaledUv * 1.5 + vec2(n1 * 0.5, n2 * 0.5));

    float flowField = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;

    // Mouse interaction - fluid ripple
    float mouseInfluence = smoothstep(0.4, 0.0, dist);
    float mouseRipple = sin(dist * 20.0 - uTime * 2.0) * mouseInfluence * 0.25;
    float mouseSwirl = snoise(scaledUv * 3.0 + uMouse * 1.5 + uTime * 0.4) * mouseInfluence;

    flowField += mouseRipple + mouseSwirl * 0.3;

    // Gradient palette blend
    float intensity = smoothstep(-0.6, 0.8, flowField);
    
    // Mix between 3 colors based on intensity - VIBRANT MODE
    vec3 color;
    if (intensity < 0.5) {
      color = mix(uColor1, uColor2, intensity * 2.0);
    } else {
      color = mix(uColor2, uColor3, (intensity - 0.5) * 2.0);
    }

    // Add metallic/neon punch - EXTREME BRIGHTNESS
    color *= (1.8 + flowField * 1.0);
    
    // Mouse glow area - HIGH INTENSITY
    float glow = smoothstep(0.3, 0.0, dist) * 0.8;
    color += uColor2 * glow * (2.0 + mouseRipple);

    // Subtle vignette - REDUCED
    float vignette = 1.0 - smoothstep(0.7, 1.3, length(uv - 0.5) * 1.5);
    color *= vignette;

    gl_FragColor = vec4(color, 1.0);
  }
`;
