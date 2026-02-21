// =============================================================================
// LOGIN - Página de acceso exclusivo para Diego y Nina
// =============================================================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Lock, User, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Login: React.FC = () => {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const result = await login(email, password);
    
    if (!result.success) {
      setError(result.error || 'Error al iniciar sesión');
    }
  };

  // Partículas flotantes decorativas
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 2,
  }));

  return (
    <div className="min-h-screen w-full bg-midnight-950 relative overflow-hidden flex items-center justify-center">
      {/* Fondo con gradiente azul profundo */}
      <div className="absolute inset-0 bg-gradient-to-br from-midnight-950 via-sapphire-950 to-azure-950" />
      
      {/* Efecto de luz neón suave */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-sapphire-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      
      {/* Partículas flotantes */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-cyan-400/30"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -30, 0],
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

      {/* Contenedor principal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md px-6"
      >
        {/* Card con efecto glassmorphism */}
        <div className="relative">
          {/* Glow exterior */}
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 via-sapphire-500/30 to-azure-500/30 rounded-3xl blur-xl" />
          
          <div className="relative bg-midnight-900/60 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
            {/* Header decorativo */}
            <div className="relative h-32 bg-gradient-to-r from-sapphire-800/50 via-cyan-800/30 to-azure-800/50 flex items-center justify-center overflow-hidden">
              {/* Patrón de corazones sutiles */}
              <div className="absolute inset-0 opacity-10">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Heart
                    key={i}
                    className="absolute text-cyan-300"
                    style={{
                      left: `${Math.random() * 90}%`,
                      top: `${Math.random() * 80}%`,
                      transform: `rotate(${Math.random() * 360}deg) scale(${0.5 + Math.random() * 0.5})`,
                    }}
                    size={16 + Math.random() * 16}
                    fill="currentColor"
                  />
                ))}
              </div>
              
              {/* Icono central */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                className="relative"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 to-sapphire-600 flex items-center justify-center shadow-neon-cyan">
                  <Heart className="text-white" size={36} fill="currentColor" />
                </div>
                <motion.div
                  className="absolute inset-0 rounded-full bg-cyan-400/30"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
            </div>

            {/* Formulario */}
            <div className="p-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-center mb-8"
              >
                <h1 className="font-script text-5xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sapphire-300 to-azure-300 mb-2">
                  Un Espacio
                </h1>
                <h2 className="font-serif text-2xl text-white/90 tracking-wide">
                  Exclusivo para ti 
                </h2>
                <p className="text-cyan-200/60 text-sm mt-3 font-sans">
                  Acceso exclusivo para Diego y Nina
                </p>
              </motion.div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Campo Email */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="relative"
                >
                  <div 
                    className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
                      focusedField === 'email' ? 'text-cyan-400' : 'text-white/40'
                    }`}
                  >
                    <User size={20} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Correo electrónico"
                    className={`w-full bg-midnight-800/50 border rounded-xl py-4 pl-12 pr-4 text-white placeholder-white/40 outline-none transition-all duration-300 ${
                      focusedField === 'email'
                        ? 'border-cyan-400/50 shadow-glow-cyan'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                    required
                  />
                </motion.div>

                {/* Campo Password */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="relative"
                >
                  <div 
                    className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
                      focusedField === 'password' ? 'text-cyan-400' : 'text-white/40'
                    }`}
                  >
                    <Lock size={20} />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Contraseña"
                    className={`w-full bg-midnight-800/50 border rounded-xl py-4 pl-12 pr-4 text-white placeholder-white/40 outline-none transition-all duration-300 ${
                      focusedField === 'password'
                        ? 'border-cyan-400/50 shadow-glow-cyan'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                    required
                  />
                </motion.div>

                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-rose-400 text-sm text-center bg-rose-500/10 rounded-lg py-2 px-4"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Botón Submit */}
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full relative group"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-sapphire-500 rounded-xl blur opacity-50 group-hover:opacity-80 transition-opacity duration-300" />
                  <div className="relative bg-gradient-to-r from-cyan-600 to-sapphire-600 hover:from-cyan-500 hover:to-sapphire-500 rounded-xl py-4 flex items-center justify-center gap-3 transition-all duration-300">
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
                      />
                    ) : (
                      <>
                        <Sparkles className="text-white/80" size={20} />
                        <span className="text-white font-medium tracking-wide">
                          Entrar a Nuestro Mundo
                        </span>
                      </>
                    )}
                  </div>
                </motion.button>
              </form>

              {/* Hint */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="text-center text-white/30 text-xs mt-6"
              >
                Solo Diego y Nina tienen acceso a este espacio
              </motion.p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Decoración inferior */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-cyan-400/40">
        <Heart size={12} fill="currentColor" />
        <span className="font-script text-lg">Siempre emos, jamas Therian🖤</span>
        <Heart size={12} fill="currentColor" />
      </div>
    </div>
  );
};

export default Login;
