// Highly complex text melting shader

export const masterMeltVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uFloorY; // Target Y coordinate for the "floor" where it pools
  varying vec2 vUv;
  varying vec3 vWorldPosition;
  varying vec3 vNormal;

  void main() {
    vUv = uv;
    vNormal = normal;

    // Local position
    vec3 pos = position;

    // 1. Calculate the animated melting progression (loops via sine wave)
    // Map sin wave [-1, 1] to a progression [0, 1]
    float cycle = (sin(uTime * 0.8) + 1.0) * 0.5; 
    
    // We want to ease the cycle so it holds at the melted and unmelted states briefly
    float meltProgression = smoothstep(0.1, 0.9, cycle);

    // 2. Melting mechanism
    // As it melts, the top stays slightly higher, but the bottom rushes downward.
    vec4 worldPos = modelMatrix * vec4(pos, 1.0);
    
    // Target pooled position (squashed to the floor)
    // We spread it out a bit horizontally as it pools
    vec3 pooledPos = worldPos.xyz;
    pooledPos.y = uFloorY + (sin(worldPos.x * 5.0 + uTime) * 0.1); 
    pooledPos.x += sign(worldPos.x) * (worldPos.y - uFloorY) * 0.3 * meltProgression;
    pooledPos.z += (sin(worldPos.x * 10.0) * 0.5) * meltProgression;

    // Only limit to floor if it's dropping below
    if (worldPos.y > uFloorY) {
      // The amount this specific vertex drops
      // Vertices higher up drop slower than vertices at the bottom
      float dropAmount = (1.5 - (worldPos.y * 0.1)) * meltProgression * 15.0; 
      
      worldPos.y -= dropAmount;

      // If dropped below floor, squash to puddle
      if (worldPos.y < uFloorY) {
         worldPos.y = mix(uFloorY, pooledPos.y, 0.5); // Add puddle ripple
         worldPos.x += sin(worldPos.x * 20.0 + uTime) * 0.2 * meltProgression;
      }
    }

    // 3. Final mix between rigid text and melted text
    vec3 finalPos = mix(
      (modelMatrix * vec4(pos, 1.0)).xyz, 
      worldPos.xyz, 
      meltProgression
    );

    vWorldPosition = finalPos;

    // Convert back from world to clip space manually
    gl_Position = projectionMatrix * viewMatrix * vec4(finalPos, 1.0);
  }
`;

export const masterMeltFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColor; // Yarrow Yellow
  varying vec2 vUv;
  varying vec3 vWorldPosition;
  varying vec3 vNormal;

  void main() {
    vec3 baseColor = uColor;
    
    // Simple directional lighting simulation inside the shader
    vec3 lightDir = normalize(vec3(5.0, 10.0, 5.0));
    float diff = max(dot(normalize(vNormal), lightDir), 0.0);
    
    // Add glowing emission
    vec3 glow = baseColor * 2.0 * diff;
    
    // Add liquid specular highlight
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    vec3 halfDir = normalize(lightDir + viewDir);
    float spec = pow(max(dot(vNormal, halfDir), 0.0), 32.0);
    
    vec3 finalColor = baseColor * 0.5 + glow + vec3(spec);
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;
