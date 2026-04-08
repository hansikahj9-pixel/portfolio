export const elegantSilkVertexShader = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vNormal;

  // Extremely soft, low-frequency simplex noise for gentle wind
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
    float n_ = 1.0/7.0; // N=7
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
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                  dot(p2,x2), dot(p3,x3) ) );
  }

  void main() {
    vUv = uv;
    vNormal = normal;

    vec3 pos = position;
    
    // Phase 1: High-end silk wind
    // Extremely low frequency and amplitude for a subtle, elegant breeze, no erratic warping
    float wind = snoise(vec3(pos.x * 0.5, pos.y * 0.5, uTime * 0.2)) * 0.15;
    pos.z += wind;

    // Phase 2: Controlled pooling simulation
    // Use an incredibly slow sine wave to gently pool the bottom
    float cycle = (sin(uTime * 0.3) + 1.0) * 0.5;
    // VERY soft easing to hold the pooled state gracefully
    float poolProgression = smoothstep(0.4, 0.9, cycle);

    // Only warp vertices near the bottom (simulating hitting the floor)
    // We assume the plane starts roughly Y=-3 to 3. 
    float isBottom = 1.0 - smoothstep(-3.0, 0.0, pos.y);
    
    // Pool outwards elegantly, not "melting" downwards
    pos.x += sign(pos.x) * isBottom * poolProgression * 1.5;
    pos.z += snoise(vec3(pos.x, 0.0, uTime * 0.1)) * isBottom * poolProgression * 0.5;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

export const elegantSilkFragmentShader = /* glsl */ `
  uniform vec3 uColor;
  
  varying vec2 vUv;
  varying vec3 vNormal;

  void main() {
    // Elegant studio lighting simulation
    vec3 lightDir = normalize(vec3(10.0, 20.0, 15.0));
    vec3 viewDir = normalize(cameraPosition - (gl_FragCoord.xyz));
    vec3 halfVector = normalize(lightDir + viewDir);

    // Diffuse wrap to soften shadows on silk
    float NdotL = dot(vNormal, lightDir);
    float diff = (NdotL * 0.5) + 0.5; // Wrap lighting
    
    // Anisotropic-like Specular highlight for silk sheen
    float NdotH = max(0.0, dot(vNormal, halfVector));
    float spec = pow(NdotH, 64.0) * 0.8;
    
    // Soft Fresnel for velvet/silk rim lighting
    float fresnel = 1.0 - max(0.0, dot(vNormal, viewDir));
    fresnel = pow(fresnel, 3.0) * 0.5;

    vec3 color = uColor * diff + vec3(spec * 0.5) + (uColor * fresnel);

    gl_FragColor = vec4(color, 1.0);
  }
`;
