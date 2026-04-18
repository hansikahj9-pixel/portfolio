import { useRef, useEffect, useState } from 'react';
import type { MouseEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LiquidDiamondMesh from '../components/LiquidDiamondMesh';

// Absolute Asset Mapping
import videoStructure from '../assets/videos/structure and shape.mp4';
import videoFlowy from '../assets/videos/flowy.mp4';
import videoContrast from '../assets/videos/contrast.mp4';
import videoAsymmetrical from '../assets/videos/Asymmetrical.mp4';
import videoDistorted from '../assets/videos/distorted volume.mp4';

const PILLAR_DATA = [
    { id: 1, title: 'STRUCTURE & SHAPE', video: videoStructure },
    { id: 2, title: 'FLOWY', video: videoFlowy },
    { id: 3, title: 'CONTRAST', video: videoContrast },
    { id: 4, title: 'ASYMMETRICAL', video: videoAsymmetrical },
    { id: 5, title: 'DISTORTED VOLUME', video: videoDistorted }
];

interface PillarProps {
    data: typeof PILLAR_DATA[0];
    isActive: boolean;
    hasActiveSibling: boolean;
    onClick: () => void;
}

const PillarArtifact = ({ data, isActive, hasActiveSibling, onClick }: PillarProps) => {
    const [phase, setPhase] = useState<1 | 2 | 3>(1);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Sync phase with active state
    useEffect(() => {
        if (!isActive) {
            setPhase(1);
            if (videoRef.current) {
                videoRef.current.pause();
                videoRef.current.currentTime = 0;
            }
        } else {
            setPhase(2);
        }
    }, [isActive]);

    // Robust Video Playback Management
    useEffect(() => {
        if (phase === 3 && videoRef.current) {
            const playVideo = async () => {
                try {
                    // Force reload to ensure src is fresh in the DOM
                    videoRef.current?.load();
                    await videoRef.current?.play();
                } catch (error) {
                    console.warn("Artifact video playback blocked or interrupted:", error);
                }
            };
            playVideo();
        }
    }, [phase]);

    const variants: any = {
        phase1: {
            width: '80vw',
            height: '10vh',
            opacity: hasActiveSibling ? 0.1 : 1,
            pointerEvents: hasActiveSibling ? 'none' : 'auto',
            transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
        },
        phase2: {
            width: '4px',
            height: '100vh',
            opacity: 1,
            pointerEvents: 'none',
            transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
        },
        phase3: {
            width: '100vw',
            height: '100vh',
            opacity: 1,
            pointerEvents: 'auto',
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
        }
    };

    return (
        <motion.div
            layout
            initial="phase1"
            animate={phase === 1 ? "phase1" : (phase === 2 ? "phase2" : "phase3")}
            variants={variants}
            onAnimationComplete={() => {
                if (phase === 2) setPhase(3);
            }}
            onClick={() => {
                if (phase === 1 && !hasActiveSibling) {
                    onClick();
                }
            }}
            className={`mercury-chrome ${isActive ? 'fixed inset-0 z-50' : 'relative'}`}
            style={{ 
                border: phase === 3 ? '1px solid white' : '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '0px'
            }}
        >
            <AnimatePresence mode="wait">
                {phase !== 3 ? (
                    <motion.h2
                        key="title"
                        initial={{ opacity: 0 }}
                        animate={{ 
                            opacity: 1, 
                            rotate: phase === 2 ? -90 : 0,
                            scale: phase === 2 ? 0.8 : 1
                        }}
                        exit={{ opacity: 0 }}
                        className="artifact-text-lifted text-4xl md:text-5xl uppercase"
                    >
                        {data.title}
                    </motion.h2>
                ) : (
                    <motion.div 
                        key="video-container"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 w-screen h-screen flex items-center justify-center p-8 bg-black/40 backdrop-blur-3xl"
                        onClick={(e) => {
                            e.stopPropagation();
                            onClick(); // Close on background click
                        }}
                    >
                        <div 
                            className="relative w-full max-w-6xl aspect-video overflow-hidden"
                            onClick={(e) => e.stopPropagation()} // Prevent close on video click
                        >
                            <video
                                key={data.id}
                                ref={videoRef}
                                src={data.video}
                                loop
                                muted
                                autoPlay
                                playsInline
                                preload="auto"
                                className="w-full h-full object-contain"
                            />
                        </div>

                        {/* Close Trigger */}
                        <div 
                            className="absolute bottom-12 left-1/2 -translate-x-1/2 cursor-pointer group"
                            onClick={onClick}
                        >
                            <span className="artifact-text-lifted text-sm tracking-[0.8em] opacity-60 group-hover:opacity-100 transition-opacity">
                                CLOSE ARTIFACT
                            </span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default function InspirationRoute() {
    const [activePillarId, setActivePillarId] = useState<number | null>(null);

    // Box spotlight tracking — MANDATORY PRESERVATION
    const boxRef = useRef<HTMLDivElement>(null);
    // @ts-ignore - Preserving for future artifact integration
    const [mousePos, setMousePos] = useState({ x: '50%', y: '50%' });

    // @ts-ignore - Preserving for future artifact integration
    const handleBoxMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!boxRef.current) return;
        const rect = boxRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setMousePos({ x: `${x}px`, y: `${y}px` });
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="inspiration-container w-full min-h-screen overflow-x-hidden">
            {/* WebGL Liquid Diamond Background */}
            <LiquidDiamondMesh />

            {/* Main Content Area */}
            <main className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center gap-10 p-4 pt-40 pb-20">
                {PILLAR_DATA.map(pillar => (
                    <PillarArtifact
                        key={pillar.id}
                        data={pillar}
                        isActive={activePillarId === pillar.id}
                        hasActiveSibling={activePillarId !== null && activePillarId !== pillar.id}
                        onClick={() => setActivePillarId(activePillarId === pillar.id ? null : pillar.id)}
                    />
                ))}
            </main>
        </div>
    );
}
