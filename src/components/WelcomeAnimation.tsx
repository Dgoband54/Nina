// =============================================================================
// ANIMACIÓN DE BIENVENIDA ÉPICA PARA NINA
// Flores azules bioluminiscentes, efectos de luz, transición suave
// =============================================================================

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';

interface WelcomeAnimationProps {
  onComplete: () => void;
}

const WelcomeAnimation: React.FC<WelcomeAnimationProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'bloom' | 'reveal' | 'glow' | 'transition'>('bloom');

  useEffect(() => {
    const timer1 = setTimeout(() => setPhase('reveal'), 2000);
    const timer2 = setTimeout(() => setPhase('glow'), 4000);
    const timer3 = setTimeout(() => setPhase('transition'), 6000);
    const timer4 = setTimeout(() => onComplete(), 8000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  // Pétalos de flores azules
  const petals = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 3,
    duration: 8 + Math.random() * 7,
    size: 8 + Math.random() * 16,
    rotation: Math.random() * 360,
  }));

  // Flores que se abren
  const flowers = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: 10 + (i % 4) * 25 + Math.random() * 10,
    y: 15 + Math.floor(i / 4) * 30 + Math.random() * 10,
    scale: 0.5 + Math.random() * 0.8,
    delay: i * 0.15,
  }));

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 overflow-hidden"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      >
        {/* Fondo con gradiente azul profundo */}
        <div className="absolute inset-0 bg-gradient-to-br from-midnight-950 via-sapphire-900 to-azure-950" />

        {/* Efecto de luz central pulsante */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          animate={{
            scale: phase === 'bloom' ? [0.5, 1.5] : [1.5, 2],
            opacity: phase === 'bloom' ? [0.3, 0.6] : [0.6, 0.3],
          }}
          transition={{ duration: 3, ease: 'easeInOut' }}
        >
          <div className="w-[800px] h-[800px] rounded-full bg-gradient-radial from-cyan-400/30 via-sapphire-500/20 to-transparent blur-3xl" />
        </motion.div>

        {/* Fase 1: Flores que florecen */}
        {phase === 'bloom' && (
          <div className="absolute inset-0 flex items-center justify-center">
            {flowers.map((flower) => (
              <motion.div
                key={flower.id}
                className="absolute"
                style={{
                  left: `${flower.x}%`,
                  top: `${flower.y}%`,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: flower.scale, opacity: 1 }}
                transition={{
                  delay: flower.delay,
                  duration: 1.5,
                  type: 'spring',
                  stiffness: 100,
                }}
              >
                {/* Flor azul bioluminiscente */}
                <div className="relative">
                  {/* Pétalos */}
                  {Array.from({ length: 8 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-8 h-16 rounded-full"
                      style={{
                        background: `linear-gradient(180deg, rgba(0,243,255,0.8) 0%, rgba(12,156,240,0.4) 100%)`,
                        transformOrigin: 'center bottom',
                        transform: `rotate(${i * 45}deg) translateY(-20px)`,
                        boxShadow: '0 0 20px rgba(0,243,255,0.5), inset 0 0 10px rgba(255,255,255,0.3)',
                      }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 0.9 }}
                      transition={{ delay: flower.delay + i * 0.05, duration: 0.5 }}
                    />
                  ))}
                  {/* Centro de la flor */}
                  <motion.div
                    className="relative w-6 h-6 rounded-full bg-gradient-to-br from-cyan-300 to-sapphire-400"
                    style={{
                      boxShadow: '0 0 30px rgba(0,243,255,0.8)',
                    }}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.8, 1, 0.8],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Fase 2: Revelación del nombre */}
        {(phase === 'reveal' || phase === 'glow') && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {/* Sparkles decorativos */}
            <motion.div
              className="absolute top-1/4 left-1/4"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="text-cyan-400/50" size={48} />
            </motion.div>
            <motion.div
              className="absolute bottom-1/3 right-1/4"
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="text-sapphire-400/50" size={36} />
            </motion.div>

            {/* Texto "Bienvenida" */}
            <motion.p
              className="font-script text-4xl md:text-6xl text-cyan-300/80 mb-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Bienvenida
            </motion.p>

            {/* Nombre NINA con efecto de luz */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 1, type: 'spring' }}
            >
              {/* Glow detrás del nombre */}
              <motion.div
                className="absolute inset-0 blur-3xl"
                animate={{
                  opacity: [0.5, 0.8, 0.5],
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <div className="w-full h-full bg-gradient-to-r from-cyan-400 via-sapphire-400 to-azure-400 opacity-50" />
              </motion.div>

              {/* Letras del nombre */}
              <h1 className="relative font-serif text-7xl md:text-9xl font-bold tracking-wider">
                {'NINA'.split('').map((letter, i) => (
                  <motion.span
                    key={i}
                    className="inline-block text-transparent bg-clip-text"
                    style={{
                      backgroundImage: 'linear-gradient(180deg, #00f3ff 0%, #0c9cf0 50%, #0467a8 100%)',
                      textShadow: '0 0 40px rgba(0,243,255,0.5)',
                    }}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + i * 0.15, duration: 0.6, type: 'spring' }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </h1>
            </motion.div>

            {/* Subtítulo romántico */}
            <motion.p
              className="font-script text-2xl md:text-3xl text-cyan-200/70 mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8, duration: 0.8 }}
            >
              Este espacio es solo para ti
            </motion.p>

            {/* Corazones animados */}
            <motion.div
              className="flex gap-4 mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2, duration: 0.8 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                >
                  <Heart
                    className="text-cyan-400"
                    size={24 + i * 8}
                    fill="currentColor"
                    style={{ filter: 'drop-shadow(0 0 10px rgba(0,243,255,0.5))' }}
                  />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* Pétalos cayendo (siempre visibles) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {petals.map((petal) => (
            <motion.div
              key={petal.id}
              className="absolute"
              style={{
                left: `${petal.x}%`,
                width: petal.size,
                height: petal.size,
              }}
              initial={{ y: '-10%', opacity: 0, rotate: 0 }}
              animate={{
                y: '110vh',
                opacity: [0, 1, 1, 0],
                rotate: petal.rotation,
              }}
              transition={{
                duration: petal.duration,
                repeat: Infinity,
                delay: petal.delay,
                ease: 'linear',
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                <path
                  d="M12 2C12 2 8 8 8 14C8 18 10 22 12 22C14 22 16 18 16 14C16 8 12 2 12 2Z"
                  fill={`rgba(${100 + Math.random() * 100}, ${200 + Math.random() * 55}, 255, ${0.6 + Math.random() * 0.4})`}
                  style={{ filter: 'drop-shadow(0 0 5px rgba(0,243,255,0.5))' }}
                />
              </svg>
            </motion.div>
          ))}
        </div>

        {/* Fase 4: Transición de salida */}
        {phase === 'transition' && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 via-sapphire-400/20 to-azure-400/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default WelcomeAnimation;
