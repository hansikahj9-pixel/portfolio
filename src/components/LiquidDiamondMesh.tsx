import { useEffect, useRef, useCallback } from 'react';

// ─── Vertex Shader ───
const VERT = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

// ─── Fragment Shader: Emerald Diamond Liquid Mesh ───
const FRAG = `
precision highp float;

uniform float u_time;
uniform vec2  u_resolution;
uniform vec2  u_mouse;       // normalised 0-1
uniform float u_mouseForce;  // decays after interaction

// ── palette ──
#define EMERALD   vec3(0.0,  0.302, 0.251)
#define TEAL      vec3(0.0,  0.537, 0.482)
#define PAGEANT   vec3(0.165,0.294, 0.549)
#define HAUTE_RED vec3(0.851,0.145, 0.204)
#define JAFFA     vec3(0.910,0.478, 0.247)

// ── noise helpers ──
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

void main(){
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float t = u_time * 0.25;

  // ── mouse ripple displacement ──
  vec2 mUV   = u_mouse;
  float dist = length(uv - mUV);
  float ripple = sin(dist * 40.0 - u_time * 4.0) * exp(-dist * 5.0) * u_mouseForce;

  // ── layered simplex noise for liquid flow ──
  float n1 = snoise(vec3(uv * 3.0 + ripple, t));
  float n2 = snoise(vec3(uv * 5.0 - 0.5,    t * 1.3));
  float n3 = snoise(vec3(uv * 8.0 + ripple,  t * 0.7));
  float flow = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;

  // ── colour blending ──
  // base: emerald <-> teal <-> pageant blue
  // green base (-50% total reduction: 0.7 * 0.8 = 0.56)
  vec3 col = mix(EMERALD * 0.56, TEAL * 0.56, smoothstep(-0.3, 0.4, flow));
  
  // blue waves (+35% increase to 1.8225)
  float blueFlow = n2 * 0.5 + n1 * 0.3 + n3 * 0.2;
  col = mix(col, PAGEANT, clamp(smoothstep(-0.1, 0.7, blueFlow) * 1.8225, 0.0, 1.0));

  // light reflections: red & orange streaks/waves (+35% concentration for Jaffa)
  float peak = smoothstep(0.35, 0.6, flow + ripple * 0.5);
  float orangeFlow = n3 * 0.5 + n2 * 0.3 + n1 * 0.2;
  
  col = mix(col, HAUTE_RED, peak * 0.35 * smoothstep(0.5, 0.8, n3));
  col = mix(col, JAFFA, clamp(smoothstep(0.1, 0.9, orangeFlow) * 0.6581, 0.0, 1.0));

  // ── diamond specular highlight ──
  // compute pseudo-normal from noise gradient for Blinn-Phong
  float eps = 0.005;
  float dx = snoise(vec3((uv.x + eps) * 3.0, uv.y * 3.0, t)) - snoise(vec3((uv.x - eps) * 3.0, uv.y * 3.0, t));
  float dy = snoise(vec3(uv.x * 3.0, (uv.y + eps) * 3.0, t)) - snoise(vec3(uv.x * 3.0, (uv.y - eps) * 3.0, t));
  vec3 normal = normalize(vec3(-dx * 2.0, -dy * 2.0, 1.0));

  vec3 lightDir = normalize(vec3(sin(t * 0.5) * 0.5, cos(t * 0.3) * 0.5, 1.0));
  vec3 viewDir  = vec3(0.0, 0.0, 1.0);
  vec3 halfDir  = normalize(lightDir + viewDir);
  float spec    = pow(max(dot(normal, halfDir), 0.0), 64.0);

  // apply specular as bright white diamond flare (boosted from 0.7 to 0.85)
  col += spec * 0.85 * vec3(1.0, 0.95, 0.85);

  // ── secondary shimmer on mouse proximity (+25% increase to 0.8775) ──
  float mouseGlow = exp(-dist * 3.0) * u_mouseForce * 0.8775;
  col += mouseGlow * JAFFA;

  // ── contrast & saturation boost (increased from 1.4 to 1.7) ──
  col = pow(col, vec3(0.8));                         // brighter gamma (0.9 -> 0.8)
  float lum = dot(col, vec3(0.299, 0.587, 0.114));
  col = mix(vec3(lum), col, 1.7);                    // saturation boost
  col = clamp(col, 0.0, 1.0);

  gl_FragColor = vec4(col, 1.0);
}
`;

interface Props {
  className?: string;
}

export default function LiquidDiamondMesh({ className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef     = useRef<WebGLRenderingContext | null>(null);
  const progRef   = useRef<WebGLProgram | null>(null);
  const rafRef    = useRef<number>(0);
  const mouseRef  = useRef({ x: 0.5, y: 0.5 });
  const forceRef  = useRef(0);
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

    const gl = canvas.getContext('webgl', { alpha: false, antialias: false, preserveDrawingBuffer: false });
    if (!gl) return;
    glRef.current = gl;

    // ── compile & link ──
    const vs = compileShader(gl, gl.VERTEX_SHADER, VERT);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAG);
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
      const dpr = Math.min(window.devicePixelRatio, 1.5); // cap for perf
      canvas.width  = canvas.clientWidth  * dpr;
      canvas.height = canvas.clientHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    // ── render loop ──
    const uRes   = gl.getUniformLocation(prog, 'u_resolution');
    const uTime  = gl.getUniformLocation(prog, 'u_time');
    const uMouse = gl.getUniformLocation(prog, 'u_mouse');
    const uForce = gl.getUniformLocation(prog, 'u_mouseForce');

    const loop = () => {
      const elapsed = (Date.now() - startRef.current) / 1000;
      // decay mouse force
      forceRef.current *= 0.96;

      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, elapsed);
      gl.uniform2f(uMouse, mouseRef.current.x, mouseRef.current.y);
      gl.uniform1f(uForce, forceRef.current);

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
      y: 1 - (cy - rect.top) / rect.height  // flip Y for GL
    };
    forceRef.current = Math.min(forceRef.current + 0.15, 1.0);
  }, []);

  useEffect(() => {
    const onMove = (e: globalThis.MouseEvent) => updateMouse(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) updateMouse(t.clientX, t.clientY);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('touchstart', onTouch, { passive: true });
    window.addEventListener('touchmove', onTouch, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchstart', onTouch);
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
        zIndex: 0,
        display: 'block',
      }}
    />
  );
}
