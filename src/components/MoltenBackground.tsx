import { useEffect, useRef, useCallback } from 'react';

// ─── Vertex Shader ───
const VERT = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

// ─── Fragment Shader (Molten Metallic Silver + Specular Diamonds) ───
const FRAG = `
#extension GL_OES_standard_derivatives : enable
precision highp float;

uniform float uTime;
uniform vec2  uMouse;
uniform vec2  uResolution;
uniform vec3  uColorSilver; // #C0C0C0
uniform vec3  uColorOrange; // #E87A3F
uniform vec3  uColorYellow; // #E5BE5E

// ── 3D Simplex Noise Helper ──
vec3 mod289(vec3 x){ return x - floor(x*(1.0/289.0))*289.0; }
vec4 mod289(vec4 x){ return x - floor(x*(1.0/289.0))*289.0; }
vec4 permute(vec4 x){ return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314*r; }

float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0,0.5,1.0,2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g  = step(x0.yzx, x0.xyz);
  vec3 l  = 1.0 - g;
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
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j  = p - 49.0*floor(p*ns.z*ns.z);
  vec4 x_ = floor(j*ns.z);
  vec4 y_ = floor(j - 7.0*x_);
  vec4 x  = x_*ns.x + ns.yyyy;
  vec4 y  = y_*ns.x + ns.yyyy;
  vec4 h  = 1.0 - abs(x) - abs(y);
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
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)), 0.0);
  m = m*m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}

void main() {
    // Normalize coordinates respecting aspect ratio
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    uv.x *= uResolution.x / uResolution.y;

    // Adjust mouse tracking aspect ratio relative to center
    vec2 mMouse = uMouse;
    mMouse.x *= uResolution.x / uResolution.y;

    // 1. WAVE CALCULATION (Using Simplex Noise + Mouse Interaction)
    float dist = distance(uv, mMouse);
    float ripple = sin(dist * 20.0 - uTime * 4.0) * exp(-dist * 3.0);
    float noise = snoise(vec3(uv * 2.5, uTime * 0.15)) + ripple;

    // 2. METALLIC SPECULARITY (The Diamond Effect)
    // We calculate the "slope" of the waves to find where light hits
    vec3 normal = normalize(vec3(dFdx(noise), dFdy(noise), 0.1));
    vec3 lightDir = normalize(vec3(0.5, 0.5, 1.0));
    float specular = pow(max(0.0, dot(normal, lightDir)), 32.0); // Sharp "Diamond" hits
    float diffuse = max(0.0, dot(normal, lightDir)) * 0.5;

    // 3. COLOR BLENDING
    // Silver is the surface; Orange/Yellow are the "molten" core revealed by waves
    vec3 baseColor = mix(uColorSilver, uColorOrange, smoothstep(0.3, 0.6, noise));
    baseColor = mix(baseColor, uColorYellow, smoothstep(0.7, 0.9, noise));
    
    // Add the metallic shine
    vec3 finalColor = (baseColor * (diffuse + 0.3)) + (vec3(1.0) * specular * 1.5);
    
    gl_FragColor = vec4(finalColor, 1.0);
}
`;

// Helper: Hex string to normalized RGB vector
function hexToRGB(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return [r, g, b];
}

interface Props {
  className?: string;
}

export default function MoltenBackground({ className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef     = useRef<WebGLRenderingContext | null>(null);
  const progRef   = useRef<WebGLProgram | null>(null);
  const rafRef    = useRef<number>(0);
  const mouseRef  = useRef({ x: 0.5, y: 0.5 });
  const startRef  = useRef(Date.now());

  const compileShader = useCallback((gl: WebGLRenderingContext, type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.error('Shader compile error:', gl.getShaderInfoLog(s));
    }
    return s;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { alpha: false, antialias: false });
    if (!gl) return;

    // CRITICAL: Force enable the extension required by the user's explicit logic
    const ext = gl.getExtension('OES_standard_derivatives');
    if (!ext) {
      console.warn('OES_standard_derivatives not supported on this device. Specularity may fail.');
    }

    glRef.current = gl;

    // ── compile & link ──
    const vs = compileShader(gl, gl.VERTEX_SHADER, VERT);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error('Link error:', gl.getProgramInfoLog(prog));
    }
    gl.useProgram(prog);
    progRef.current = prog;

    // ── fullscreen quad ──
    const buf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    // ── resize observer ──
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 1.5);
      canvas.width  = canvas.clientWidth  * dpr;
      canvas.height = canvas.clientHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    // ── uniforms ──
    const uRes    = gl.getUniformLocation(prog, 'uResolution');
    const uTime   = gl.getUniformLocation(prog, 'uTime');
    const uMouse  = gl.getUniformLocation(prog, 'uMouse');
    
    // Set static colors
    const uColSilv = gl.getUniformLocation(prog, 'uColorSilver');
    const uColOrng = gl.getUniformLocation(prog, 'uColorOrange');
    const uColYell = gl.getUniformLocation(prog, 'uColorYellow');
    
    gl.uniform3fv(uColSilv, hexToRGB('#C0C0C0'));
    gl.uniform3fv(uColOrng, hexToRGB('#E87A3F'));
    gl.uniform3fv(uColYell, hexToRGB('#E5BE5E'));

    // ── render loop ──
    const loop = () => {
      const elapsed = (Date.now() - startRef.current) / 1000;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, elapsed);
      // Mouse coordinates are passed exactly 0->1 normalized as required
      gl.uniform2f(uMouse, mouseRef.current.x, mouseRef.current.y);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [compileShader]);

  // ── interactions ──
  const updateMouse = useCallback((cx: number, cy: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: (cx - rect.left) / rect.width,
      y: 1.0 - ((cy - rect.top) / rect.height) // WebGL Y is flipped
    };
  }, []);

  useEffect(() => {
    const onMove = (e: globalThis.MouseEvent) => updateMouse(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      if (e.touches[0]) updateMouse(e.touches[0].clientX, e.touches[0].clientY);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('touchmove', onTouch, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onTouch);
    };
  }, [updateMouse]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        display: 'block',
      }}
    />
  );
}
