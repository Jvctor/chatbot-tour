import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedAvatarProps {
  state: 'idle' | 'thinking' | 'speaking';
  size?: 'sm' | 'md' | 'lg';
}

const AnimatedAvatar: React.FC<AnimatedAvatarProps> = ({ state, size = 'md' }) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'w-6 h-6 text-sm';
      case 'lg': return 'w-12 h-12 text-2xl';
      default: return 'w-8 h-8 text-lg';
    }
  };

  const getAnimation = () => {
    switch (state) {
      case 'thinking':
        return {
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0],
          transition: { 
            duration: 1.5, 
            repeat: Infinity
          }
        };
      case 'speaking':
        return {
          scale: [1, 1.05, 1],
          transition: { 
            duration: 0.6, 
            repeat: Infinity
          }
        };
      default: // idle
        return {
          scale: 1,
          rotate: 0,
          transition: { 
            duration: 0.3
          }
        };
    }
  };

  const getEmoji = () => {
    switch (state) {
      case 'thinking': return '🤔';
      case 'speaking': return '🤖';
      default: return '😊';
    }
  };

  const getGlowEffect = () => {
    switch (state) {
      case 'thinking':
        return 'shadow-lg shadow-yellow-200';
      case 'speaking':
        return 'shadow-lg shadow-blue-200';
      default:
        return 'shadow-md';
    }
  };

  return (
    <motion.div
      className={`${getSizeClasses()} bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm ${getGlowEffect()}`}
      animate={getAnimation()}
      whileHover={{ scale: 1.1 }}
      title={`Assistente está ${state === 'thinking' ? 'pensando' : state === 'speaking' ? 'falando' : 'disponível'}`}
    >
      <motion.span 
        className="select-none"
        animate={state === 'speaking' ? { 
          filter: ['brightness(1)', 'brightness(1.3)', 'brightness(1)']
        } : {}}
        transition={{ duration: 0.6, repeat: state === 'speaking' ? Infinity : 0 }}
      >
        {getEmoji()}
      </motion.span>
       {state === 'thinking' && (
        <motion.div
          className="absolute inset-0 rounded-full bg-yellow-400/20"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity
          }}
        />
      )}
      {state === 'speaking' && (
        <>
          <motion.div
            className="absolute inset-0 rounded-full bg-blue-400/10"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.6, 0, 0.6]
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity
            }}
          />
          <motion.div
            className="absolute inset-0 rounded-full bg-blue-400/15"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.4, 0, 0.4]
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: 0.2
            }}
          />
        </>
      )}
    </motion.div>
  );
};

export default AnimatedAvatar;
