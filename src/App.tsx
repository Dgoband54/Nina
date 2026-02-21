// =============================================================================
// APP PRINCIPAL - Nina PWA
// =============================================================================

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import Login from '@/sections/Login';
import NavigationNina from '@/sections/NavigationNina';
import HeroNina from '@/sections/HeroNina';
import ForoMusical from '@/sections/ForoMusical';
import CalendarioCupones from '@/sections/CalendarioCupones';
import BuzonCartas from '@/sections/BuzonCartas';
import FooterNina from '@/sections/FooterNina';
import WelcomeAnimation from '@/components/WelcomeAnimation';

// AGREGADO: Importamos tu panel de control secreto
import AdminDashboard from '@/sections/AdminDashboard'; 

// =============================================================================
// COMPONENTE PRINCIPAL CON AUTENTICACIÓN
// =============================================================================

function AppContent() {
  const { isAuthenticated, isLoading, showWelcomeAnimation, setShowWelcomeAnimation, user } = useAuth();
  const [isReady, setIsReady] = useState(false);
  
  // ===========================================================================
  // NUEVO: Estado para controlar si vemos el panel o la página de Nina
  // ===========================================================================
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  useEffect(() => {
    // Pequeña demora para asegurar que todo esté cargado
    const timer = setTimeout(() => setIsReady(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleWelcomeComplete = useCallback(() => {
    setShowWelcomeAnimation(false);
  }, [setShowWelcomeAnimation]);

  // Mostrar loading mientras se inicializa
  if (isLoading || !isReady) {
    return (
      <div className="min-h-screen bg-midnight-950 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-cyan-400/20 border-t-cyan-400 rounded-full"
        />
      </div>
    );
  }

  // Mostrar login si no está autenticado
  if (!isAuthenticated) {
    return <Login />;
  }

  // ===========================================================================
  // MODIFICADO: Comentamos este return directo para que el botón flotante pueda existir.
  // Ahora la lógica del panel se maneja más abajo con el estado 'showAdminPanel'
  // ===========================================================================
  /*
  if (user?.username === 'diego') {
    return <AdminDashboard />;
  }
  */
  // ===========================================================================

  return (
    <>
      {/* ======================================================================= */}
      {/* NUEVO: Botón flotante secreto solo para Diego */}
      {/* ======================================================================= */}
      {user?.username === 'diego' && (
        <button
          onClick={() => setShowAdminPanel(!showAdminPanel)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white px-5 py-3 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.6)] transition-all transform hover:scale-105"
        >
          {showAdminPanel ? '👁️ Ver página como Nina' : '⚙️ Abrir Panel de Control'}
        </button>
      )}

      {/* ======================================================================= */}
      {/* NUEVO: Renderizado condicional. Si el panel está activo, mostramos el Admin. 
                 Si no, mostramos toda tu app original intacta. */}
      {/* ======================================================================= */}
      {showAdminPanel && user?.username === 'diego' ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="min-h-screen bg-midnight-950"
        >
          <AdminDashboard />
        </motion.div>
      ) : (
        <>
          {/* Animación de bienvenida para Nina */}
          <AnimatePresence>
            {showWelcomeAnimation && user?.username === 'nina' && (
              <WelcomeAnimation onComplete={handleWelcomeComplete} />
            )}
          </AnimatePresence>

          {/* Contenido principal */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="min-h-screen bg-midnight-950"
          >
            <NavigationNina />
            
            <main>
              <HeroNina />
              <ForoMusical />
              <CalendarioCupones />
              <BuzonCartas />
            </main>

            <FooterNina />
          </motion.div>
        </>
      )}
    </>
  );
}

// =============================================================================
// APP CON PROVIDER
// =============================================================================

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;