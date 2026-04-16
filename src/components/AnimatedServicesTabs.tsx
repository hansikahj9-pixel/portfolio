import { useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { fluidVertexShader, gradientFluidFragmentShader } from "../shaders/fluidShader";

const tabs = [
  {
    id: "innovation",
    title: "Innovation as a Service",
    description: "Your content for Innovation goes here...",
  },
  {
    id: "ecodesign",
    title: "Eco-Design Engineering",
    description: "Your content for Eco-Design goes here...",
  },
  {
    id: "sourcing",
    title: "Hyper-Local Sourcing & Operations",
    description: "Your content for Sourcing goes here...",
  },
];

function BackgroundFluidMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const mouseRef = useRef(new THREE.Vector2(0.5, 0.5));
  const smoothMouse = useRef(new THREE.Vector2(0.5, 0.5));

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uColor1: { value: new THREE.Color("#ff3f00") }, // Neon Orange
      uColor2: { value: new THREE.Color("#e2e8f0") }, // Metallic Silver
      uColor3: { value: new THREE.Color("#10b981") }, // Emerald Green
    }),
    []
  );

  useFrame(({ clock, size }) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.ShaderMaterial;
    mat.uniforms.uTime.value = clock.getElapsedTime() * 0.5;
    mat.uniforms.uResolution.value.set(size.width, size.height);
    smoothMouse.current.lerp(mouseRef.current, 0.05);
    mat.uniforms.uMouse.value.copy(smoothMouse.current);
  });

  return (
    <mesh 
      ref={meshRef} 
      onPointerMove={(e) => {
        if (e.uv) mouseRef.current.set(e.uv.x, e.uv.y);
      }}
    >
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={fluidVertexShader}
        fragmentShader={gradientFluidFragmentShader}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  );
}

export default function AnimatedServicesTabs() {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <div className="services-tabs-container">
      {/* 1. The 3 Separate Tabs */}
      <div className="services-tab-buttons">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`services-tab-btn ${activeTab === tab.id ? 'active' : 'inactive'}`}
          >
            {tab.title}
          </button>
        ))}
      </div>

      {/* 2. The Content Box */}
      <div className="relative w-full h-[500px] rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-2xl services-content-box">
        
        {/* THE FIX: The Animation Layer goes to the back (z-0) */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-90">
          <Canvas
            orthographic
            camera={{ left: -1, right: 1, top: 1, bottom: -1, near: 0, far: 1 }}
            dpr={[1, 2]}
            gl={{ antialias: false, alpha: false }}
            style={{ width: '100%', height: '100%' }}
          >
            <BackgroundFluidMesh />
          </Canvas>
        </div>

        {/* 3. The Text Layer goes to the front (z-10) with a subtle glassmorphism overlay */}
        <div className="relative z-10 w-full h-full p-8 md:p-12 flex items-center justify-center services-text-layer">
          <AnimatePresence mode="wait">
            {tabs.map(
              (tab) =>
                activeTab === tab.id && (
                  <motion.div
                    key={tab.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="text-center text-white pointer-events-auto"
                  >
                    <h2 className="services-title">
                      {tab.title}
                    </h2>
                    <p className="services-desc">
                      {tab.description}
                    </p>
                  </motion.div>
                )
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
