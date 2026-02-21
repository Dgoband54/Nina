// =============================================================================
// FOOTER PERSONALIZADO - Nina PWA
// =============================================================================

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';

const FooterNina: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Fondo */}
      <div className="absolute inset-0 bg-gradient-to-t from-midnight-950 via-sapphire-950/20 to-transparent" />

      {/* Efectos de luz */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-500/5 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Icono decorativo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-sapphire-600 shadow-neon-cyan">
            <Heart className="text-white" size={32} fill="currentColor" />
          </div>
        </motion.div>

        {/* Mensaje principal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <h3 className="font-script text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sapphire-300 to-azure-300 mb-4">
            Para Siempre
          </h3>
          <p className="text-cyan-100/50 text-lg max-w-xl mx-auto">
            Este espacio fue creado con todo mi aprecio, para guardar notitas que duren siempre♡.
          </p>
        </motion.div>

        {/* Decoración */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex items-center justify-center gap-4 mb-8"
        >
          <div className="h-px w-20 bg-gradient-to-r from-transparent to-cyan-400/30" />
          <Sparkles className="text-cyan-400/50" size={20} />
          <div className="h-px w-20 bg-gradient-to-l from-transparent to-cyan-400/30" />
        </motion.div>

        {/* Firma */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-8"
        >
          <p className="font-script text-2xl text-cyan-300/70">
            Con aprecio, Diego
          </p>
        </motion.div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-white/30 text-sm"
        >
          <p>© {currentYear} - Un Espacio Para Nosotros</p>
          <p className="mt-1">Hecho con 🖤 para Nina</p>
        </motion.div>
      </div>

      {/* Partículas decorativas en el fondo */}
      <div className="absolute bottom-4 left-4">
        <motion.div
          animate={{ y: [0, -10, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Heart className="text-cyan-400/20" size={16} fill="currentColor" />
        </motion.div>
      </div>
      <div className="absolute bottom-8 right-8">
        <motion.div
          animate={{ y: [0, -15, 0], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        >
          <Heart className="text-sapphire-400/20" size={20} fill="currentColor" />
        </motion.div>
      </div>
      <div className="absolute top-4 right-1/4">
        <motion.div
          animate={{ y: [0, -8, 0], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
        >
          <Heart className="text-azure-400/20" size={12} fill="currentColor" />
        </motion.div>
      </div>
    </footer>
  );
};

export default FooterNina;
