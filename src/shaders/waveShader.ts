export const waveVertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 pos = position;

    float dist = distance(uv, uMouse);
    float wave = sin(dist * 12.0 - uTime * 3.0) * 0.06;
    float falloff = smoothstep(0.8, 0.0, dist);

    pos.z += wave * falloff;
    pos.x += sin(uTime * 2.0 + pos.y * 5.0) * 0.015 * falloff;
    pos.y += cos(uTime * 1.5 + pos.x * 5.0) * 0.015 * falloff;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

export const waveFragmentShader = /* glsl */ `
  uniform sampler2D uTexture;
  uniform float uOpacity;
  uniform float uTime;
  uniform vec2 uMouse;
  varying vec2 vUv;

  void main() {
    float dist = distance(vUv, uMouse);
    float ripple = sin(dist * 20.0 - uTime * 4.0) * 0.008;
    float falloff = smoothstep(0.6, 0.0, dist);

    vec2 distortedUv = vUv + ripple * falloff;
    vec4 tex = texture2D(uTexture, distortedUv);
    tex.a *= uOpacity;
    gl_FragColor = tex;
  }
`;
