// =============================================================================
// NAVEGACIÓN PERSONALIZADA - Para la PWA de Nina
// =============================================================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Music, Gift, BookHeart, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const NavigationNina: React.FC = () => {
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Foro Musical', icon: Music, href: '#foro-musical' },
    { name: 'Cupones', icon: Gift, href: '#calendario-cupones' },
    { name: 'Cartas', icon: BookHeart, href: '#buzon-cartas' },
  ];

  const handleLogout = async () => {
    await logout();
  };

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled
            ? 'bg-midnight-950/80 backdrop-blur-xl border-b border-white/5'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <motion.a
              href="#"
              className="flex items-center gap-2 group"
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-sapphire-600 flex items-center justify-center shadow-lg group-hover:shadow-neon-cyan transition-shadow">
                  <Heart className="text-white" size={20} fill="currentColor" />
                </div>
                <motion.div
                  className="absolute inset-0 rounded-full bg-cyan-400/30"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <div className="hidden sm:block">
                <span className="font-script text-2xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-sapphire-300">
                  Nina
                </span>
              </div>
            </motion.a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className="px-4 py-2 rounded-full text-white/70 hover:text-white hover:bg-white/5 transition-all duration-300 flex items-center gap-2"
                >
                  <item.icon size={18} />
                  <span className="text-sm font-medium">{item.name}</span>
                </button>
              ))}
            </div>

            {/* User & Logout */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-white/50">
                <span className="text-sm">Hola,</span>
                <span className="text-cyan-300 text-sm font-medium">{user?.nombre}</span>
              </div>
              
              <button
                onClick={handleLogout}
                className="p-2 rounded-full text-white/50 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-300"
                title="Cerrar sesión"
              >
                <LogOut size={20} />
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-full text-white/70 hover:text-white hover:bg-white/5 transition-all"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-30 md:hidden"
          >
            <div className="absolute inset-0 bg-midnight-950/95 backdrop-blur-xl" onClick={() => setIsMobileMenuOpen(false)} />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute top-20 left-4 right-4 bg-midnight-900/90 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
            >
              <div className="space-y-2">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => scrollToSection(item.href)}
                    className="w-full flex items-center gap-4 p-4 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-all"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-sapphire-500/20 flex items-center justify-center">
                      <item.icon className="text-cyan-400" size={20} />
                    </div>
                    <span className="text-lg font-medium">{item.name}</span>
                  </motion.button>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex items-center gap-3 text-white/50">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-sapphire-600 flex items-center justify-center">
                    <span className="text-white font-medium">{user?.nombre?.[0]}</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">{user?.nombre}</p>
                    <p className="text-sm">{user?.email}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavigationNina;
