// Shader for Dalí-style melting background abstract objects

export const meltingVertexShader = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vPosition;

  // Simple curl noise helper
  vec3 hash33(vec3 p) {
      p = fract(p * vec3(443.897, 441.423, 437.195));
      p += dot(p, p.yxz + 19.19);
      return fract((p.xxy + p.yxx) * p.zyx);
  }

  void main() {
    vUv = uv;
    vec3 pos = position;
    
    // Stretch downwards based on world Y and time to create "melting" dripping effect
    float meltFactor = smoothstep(0.5, -1.0, pos.y);
    float drip = sin(pos.x * 4.0 + uTime * 2.0) * cos(pos.z * 3.0 + uTime);
    
    // Elongate downward
    pos.y -= meltFactor * (1.0 + drip) * 1.5;
    
    // Bulge outwards slightly at the bottom
    pos.x += meltFactor * sin(uTime + pos.y) * 0.2;
    pos.z += meltFactor * cos(uTime + pos.y) * 0.2;

    vPosition = pos;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

export const meltingFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColor1; // e.g. Pageant Blue
  uniform vec3 uColor2; // e.g. Yarrow Yellow
  
  varying vec2 vUv;
  varying vec3 vPosition;

  void main() {
    // Gradient based on stretched position
    float mixFactor = smoothstep(-2.0, 2.0, vPosition.y + sin(vPosition.x * 2.0 + uTime) * 0.5);
    vec3 color = mix(uColor1, uColor2, mixFactor);
    
    // Add specular-like glossy rim
    float rim = 1.0 - max(0.0, dot(normalize(vPosition), vec3(0.0, 0.0, 1.0)));
    color += vec3(0.2) * pow(rim, 3.0);
    
    gl_FragColor = vec4(color, 1.0);
  }
`;
