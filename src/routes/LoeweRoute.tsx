import React from 'react';
import { motion } from 'framer-motion';
import coverImg from '../assets/store/cover.jpg';

const LoeweRoute: React.FC = () => (
  <motion.div
    className="loewe-route"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.6 }}
  >
    <div className="cover-container">
      <img src={coverImg} alt="Loewe Cover" className="cover-image" />
    </div>
    {/* Future premium content can be added here */}
  </motion.div>
);

export default LoeweRoute;
