// =============================================================================
// HERO PERSONALIZADO - Página principal después del login
// =============================================================================

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Music, Gift, BookHeart, ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const HeroNina: React.FC = () => {
  const { user } = useAuth();
  const isNina = user?.username === 'nina';
  const nombre = user?.nombre || 'Amor';

  // Partículas flotantes
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 6 + 2,
    duration: Math.random() * 4 + 3,
    delay: Math.random() * 3,
  }));

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Fondo con gradiente azul profundo */}
      <div className="absolute inset-0 bg-gradient-to-br from-midnight-950 via-sapphire-950 to-azure-950" />

      {/* Efectos de luz neón */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[150px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-sapphire-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1.5s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-azure-500/5 rounded-full blur-[180px]" />

      {/* Partículas flotantes */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            background: `rgba(${100 + Math.random() * 100}, ${200 + Math.random() * 55}, 255, ${0.3 + Math.random() * 0.4})`,
            boxShadow: `0 0 ${particle.size * 2}px rgba(0, 243, 255, 0.5)`,
          }}
          animate={{
            y: [0, -40, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Contenido principal */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        {/* Saludo personalizado */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="inline-block font-script text-3xl md:text-4xl text-cyan-300/80 mb-4">
            {isNina ? 'Bienvenida, Mi Ninaaaaa 🖤' : `Hola, ${nombre}`}
          </span>
        </motion.div>

        {/* Título principal */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="font-serif text-5xl md:text-7xl lg:text-8xl text-white mb-6"
        >
          Un Espacio{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sapphire-400 to-azure-400">
            Para Gissela
          </span>
        </motion.h1>

        {/* Subtítulo */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-cyan-100/60 text-lg md:text-xl max-w-2xl mx-auto mb-12"
        >
          {isNina 
            ? 'Este lugar es solo para ti. Aquí encontrarás mis dedicatorias, sorpresas mensuales y cartas escritas con todo mi aprecio.'
            : 'Bienvenido a tu espacio personal. Aquí puedes compartir canciones, cartas y sorpresas para Nina.'}
        </motion.p>

        {/* Cards de navegación */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto"
        >
          {[
            {
              icon: Music,
              title: 'Foro Musical',
              description: 'Canciones dedicadas',
              target: 'foro-musical',
              gradient: 'from-cyan-500 to-sapphire-600',
            },
            {
              icon: Gift,
              title: 'Calendario de Cupones',
              description: '12 sorpresas del año',
              target: 'calendario-cupones',
              gradient: 'from-sapphire-500 to-azure-600',
            },
            {
              icon: BookHeart,
              title: 'Buzón de Cartas',
              description: 'Cartas y notitas',
              target: 'buzon-cartas',
              gradient: 'from-azure-500 to-cyan-600',
            },
          ].map((item, index) => (
            <motion.button
              key={item.title}
              onClick={() => scrollToSection(item.target)}
              className="group relative"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + index * 0.1 }}
            >
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${item.gradient} rounded-2xl opacity-50 group-hover:opacity-80 blur transition-opacity duration-300`} />
              <div className="relative bg-midnight-900/80 backdrop-blur-xl rounded-2xl border border-white/5 p-6 text-left transition-all duration-300 group-hover:border-white/10">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                  <item.icon className="text-white" size={24} />
                </div>
                <h3 className="font-serif text-xl text-white mb-1 group-hover:text-cyan-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-white/50 text-sm">
                  {item.description}
                </p>
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* Decoración de corazones */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="flex justify-center gap-4 mt-16"
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            >
              <Heart
                className="text-cyan-400"
                size={16 + i * 4}
                fill="currentColor"
                style={{ filter: 'drop-shadow(0 0 8px rgba(0,243,255,0.5))' }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-cyan-400/50"
        >
          <span className="text-xs uppercase tracking-wider">Explorar</span>
          <ChevronDown size={24} />
        </motion.div>
      </motion.div>

      {/* Líneas decorativas */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" />
    </section>
  );
};

export default HeroNina;
