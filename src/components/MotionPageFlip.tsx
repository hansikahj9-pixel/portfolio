import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface MotionPageFlipProps {
  children: ReactNode;
  locationKey: string;
}

// Aggressive high-friction easing for a tactile, monumental page flip feel
const pageFlipEase: [number, number, number, number] = [0.76, 0, 0.24, 1];
const duration = 1.1;

export default function MotionPageFlip({ children, locationKey }: MotionPageFlipProps) {
  return (
    <motion.div
      key={locationKey}
      initial={{ rotateY: 90, opacity: 0 }}
      animate={{ rotateY: 0, opacity: 1 }}
      exit={{ rotateY: -90, opacity: 0 }}
      transition={{ ease: pageFlipEase, duration }}
      style={{
        originX: 0, // Left edge fixed
        transformStyle: 'preserve-3d',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }}
      className="page-flip-container"
    >
      {children}
    </motion.div>
  );
}
