// =============================================================================
// CALENDARIO DE CUPONES - 12 gemas/cofres mensuales con lógica de fechas
// =============================================================================

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, Gift, Sparkles, Check, Wallet, Clock, Edit, Loader2, X, Calendar } from 'lucide-react';
import { getCuponesMensuales, type CuponMensual, supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

const CalendarioCupones: React.FC = () => {
  const { user } = useAuth();
  const [cupones, setCupones] = useState<CuponMensual[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCupon, setSelectedCupon] = useState<CuponMensual | null>(null);
  
  const [activeTab, setActiveTab] = useState<'calendario' | 'billetera'>('calendario');
  const [isEditing, setIsEditing] = useState(false);
  const [editTitulo, setEditTitulo] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentMonth = new Date().getMonth() + 1;

  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const gemColors: Record<number, { bg: string; glow: string; border: string }> = {
    1: { bg: 'from-cyan-600 to-blue-700', glow: 'shadow-cyan-500/50', border: 'border-cyan-400/30' },
    2: { bg: 'from-rose-500 to-pink-600', glow: 'shadow-rose-500/50', border: 'border-rose-400/30' },
    3: { bg: 'from-teal-500 to-emerald-600', glow: 'shadow-teal-500/50', border: 'border-teal-400/30' },
    4: { bg: 'from-emerald-500 to-green-600', glow: 'shadow-emerald-500/50', border: 'border-emerald-400/30' },
    5: { bg: 'from-amber-400 to-orange-500', glow: 'shadow-amber-500/50', border: 'border-amber-400/30' },
    6: { bg: 'from-indigo-500 to-purple-600', glow: 'shadow-indigo-500/50', border: 'border-indigo-400/30' },
    7: { bg: 'from-orange-400 to-red-500', glow: 'shadow-orange-500/50', border: 'border-orange-400/30' },
    8: { bg: 'from-violet-500 to-purple-600', glow: 'shadow-violet-500/50', border: 'border-violet-400/30' },
    9: { bg: 'from-pink-400 to-rose-500', glow: 'shadow-pink-500/50', border: 'border-pink-400/30' },
    10: { bg: 'from-purple-500 to-fuchsia-600', glow: 'shadow-purple-500/50', border: 'border-purple-400/30' },
    11: { bg: 'from-amber-500 to-yellow-600', glow: 'shadow-amber-500/50', border: 'border-amber-400/30' },
    12: { bg: 'from-red-500 to-rose-600', glow: 'shadow-red-500/50', border: 'border-red-400/30' },
  };

  const fetchCupones = async () => {
    setIsLoading(true);
    const data = await getCuponesMensuales();
    
    if (data.length === 0) {
      const ejemploCupones: CuponMensual[] = meses.map((mes, index) => ({
        id: `cupon-${index + 1}`,
        mes_numero: index + 1,
        mes_nombre: mes,
        titulo_vale: getTituloVale(index + 1),
        descripcion: getDescripcionVale(index + 1),
        estado: index + 1 < currentMonth ? 'usado' : index + 1 === currentMonth ? 'desbloqueado' : 'bloqueado',
        icono: 'gem',
        color_gem: Object.keys(gemColors)[index],
      }));
      setCupones(ejemploCupones);
    } else {
      data.sort((a, b) => a.mes_numero - b.mes_numero);
      setCupones(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCupones();
  }, [currentMonth]);

  const getTituloVale = (mes: number): string => {
    const titulos: Record<number, string> = {
      1: 'Vale por un abrazo eterno', 2: 'Vale por una cita sorpresa', 3: 'Vale por un día de spa en casa',
      4: 'Vale por una aventura juntos', 5: 'Vale por tu deseo concedido', 6: 'Vale por un picnic bajo las estrellas',
      7: 'Vale por un día sin quejas', 8: 'Vale por una serenata', 9: 'Vale por un masaje de pies',
      10: 'Vale por una noche de películas', 11: 'Vale por un desayuno en la cama', 12: 'Vale por un fin de semana mágico',
    };
    return titulos[mes] || 'Vale sorpresa';
  };

  const getDescripcionVale = (mes: number): string => {
    const descripciones: Record<number, string> = {
      1: 'Un abrazo que dure todo el tiempo que necesites', 2: 'Te llevaré a un lugar especial sin decirte adónde',
      3: 'Masajes, música relajante y mucho cariño', 4: 'Un día para explorar algo nuevo juntos',
      5: 'Pídeme cualquier cosa y haré todo lo posible', 6: 'Una noche mágica con tu comida favorita',
      7: '24 horas donde todo lo que diga será sí', 8: 'Te cantaré tu canción favorita',
      9: 'Relajación total para tus pies cansados', 10: 'Maratón de tus películas favoritas con palomitas',
      11: 'Despertar con tu comida favorita hecha con amor', 12: 'Dos días llenos de sorpresas y momentos especiales',
    };
    return descripciones[mes] || 'Un regalo hecho con amor';
  };

  const handleRevelarCupon = (cupon: CuponMensual) => {
    // MODIFICADO: Lógica más flexible para permitir abrir el cupón del mes actual
    const esMesActual = cupon.mes_numero === currentMonth;
    if (cupon.estado === 'desbloqueado' || cupon.estado === 'guardado' || cupon.estado === 'pendiente' || esMesActual || user?.username === 'diego') {
      setSelectedCupon(cupon);
      setEditTitulo(cupon.titulo_vale || '');
      setEditDesc(cupon.descripcion || '');
      setIsEditing(false);
    }
  };

  const handleCerrarModal = () => {
    setSelectedCupon(null);
    setIsEditing(false);
  };

  const cambiarEstado = async (id: string, nuevoEstado: string) => {
    setIsSubmitting(true);
    
    // MODIFICADO: Eliminado el bloqueo de "cupon-", ahora permite guardar si es Nina
    const { error } = await supabase
      .from('cupones_mensuales')
      .update({ estado: nuevoEstado })
      .eq('id', id);

    setIsSubmitting(false);

    if (!error) {
      setCupones(cupones.map(c => c.id === id ? { ...c, estado: nuevoEstado } : c));
      handleCerrarModal();
      if (nuevoEstado === 'guardado') setActiveTab('billetera');
    } else {
      alert('Error al actualizar el cupón en la base de datos.');
    }
  };

  const handleGuardarEdicion = async () => {
    if (!selectedCupon) return;
    setIsSubmitting(true);
    const { error } = await supabase
      .from('cupones_mensuales')
      .update({ titulo_vale: editTitulo, descripcion: editDesc })
      .eq('id', selectedCupon.id);

    setIsSubmitting(false);

    if (!error) {
      setCupones(cupones.map(c => c.id === selectedCupon.id ? { ...c, titulo_vale: editTitulo, descripcion: editDesc } : c));
      setIsEditing(false);
      setSelectedCupon({ ...selectedCupon, titulo_vale: editTitulo, descripcion: editDesc });
    } else {
      alert('Error al guardar la edición');
    }
  };

  const getEstadoIcon = (estado: string, mesNumero: number) => {
    if (estado === 'usado') return <Check className="text-emerald-400" size={24} />;
    if (estado === 'pendiente') return <Clock className="text-amber-400" size={24} />;
    if (estado === 'guardado') return <Wallet className="text-purple-400" size={24} />;
    if (estado === 'desbloqueado' || mesNumero === currentMonth) return <Unlock className="text-cyan-400" size={24} />;
    return <Lock className="text-white/30" size={24} />;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
  };

  const cuponesBilletera = cupones.filter(c => c.estado === 'guardado' || c.estado === 'pendiente');

  return (
    <section id="calendario-cupones" className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-midnight-950 via-azure-950/20 to-midnight-950" />
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/3 left-0 w-80 h-80 bg-sapphire-500/5 rounded-full blur-[100px]" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sapphire-500/10 border border-sapphire-400/20 mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <Gift className="text-sapphire-400" size={18} />
            <span className="text-sapphire-300 text-sm font-medium tracking-wide">
              12 Meses de Sorpresas
            </span>
          </motion.div>

          <h2 className="font-serif text-5xl md:text-6xl text-white mb-4">
            Sistema de <span className="text-transparent bg-clip-text bg-gradient-to-r from-sapphire-400 to-azure-400">Recompensas</span>
          </h2>

          <p className="font-script text-2xl text-sapphire-200/60">
            Guarda tus cupones y úsalos cuando quieras
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center gap-4 mb-12"
        >
          <button
            onClick={() => setActiveTab('calendario')}
            className={`relative px-8 py-3 rounded-full font-medium transition-all duration-300 ${
              activeTab === 'calendario' ? 'text-white' : 'text-white/50 hover:text-white/70'
            }`}
          >
            {activeTab === 'calendario' && (
              <motion.div layoutId="activeTabCupones" className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-sapphire-600 rounded-full" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
            )}
            <span className="relative flex items-center gap-2"><Calendar size={18} /> Calendario</span>
          </button>

          <button
            onClick={() => setActiveTab('billetera')}
            className={`relative px-8 py-3 rounded-full font-medium transition-all duration-300 ${
              activeTab === 'billetera' ? 'text-white' : 'text-white/50 hover:text-white/70'
            }`}
          >
            {activeTab === 'billetera' && (
              <motion.div layoutId="activeTabCupones" className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-sapphire-600 rounded-full" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
            )}
            <span className="relative flex items-center gap-2">
              <Wallet size={18} /> Mi Billetera 
              {cuponesBilletera.length > 0 && (
                <span className="bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full ml-1">{cuponesBilletera.length}</span>
              )}
            </span>
          </button>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="w-12 h-12 border-3 border-sapphire-400/30 border-t-sapphire-400 rounded-full" />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {activeTab === 'calendario' ? (
              <motion.div
                key="calendario"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
              >
                {cupones.map((cupon) => {
                  const colors = gemColors[cupon.mes_numero];
                  const isDesbloqueado = cupon.estado === 'desbloqueado' || cupon.mes_numero === currentMonth;
                  const isExtraido = cupon.estado === 'guardado' || cupon.estado === 'pendiente';
                  const isUsado = cupon.estado === 'usado';
                  const isBloqueado = !isDesbloqueado && !isUsado && !isExtraido;

                  return (
                    <motion.div
                      key={cupon.id}
                      variants={itemVariants}
                      className={`relative group cursor-pointer ${isBloqueado ? 'cursor-not-allowed' : ''}`}
                      onClick={() => handleRevelarCupon(cupon)}
                    >
                      {isDesbloqueado && (
                        <motion.div className={`absolute -inset-1 bg-gradient-to-r ${colors.bg} rounded-2xl opacity-50 blur-lg`} animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 2, repeat: Infinity }} />
                      )}

                      <div className={`relative h-40 rounded-2xl border transition-all duration-500 overflow-hidden ${
                        isDesbloqueado ? `bg-gradient-to-br ${colors.bg} border-transparent shadow-lg ${colors.glow}` : 
                        isUsado ? 'bg-midnight-800/50 border-emerald-500/20' : 
                        isExtraido ? 'bg-midnight-800/80 border-purple-500/30 border-dashed' : 
                        'bg-midnight-900/50 border-white/5'
                      }`}>
                        <div className="absolute top-3 left-3">
                          <span className={`text-3xl font-bold ${isDesbloqueado || isExtraido ? 'text-white/80' : 'text-white/20'}`}>
                            {cupon.mes_numero}
                          </span>
                        </div>

                        <div className="absolute top-3 right-3">
                          {getEstadoIcon(cupon.estado, cupon.mes_numero)}
                        </div>

                        <div className="absolute inset-0 flex items-center justify-center">
                          {isExtraido ? (
                            <Wallet className="text-purple-400/50" size={40} />
                          ) : (
                            <motion.div animate={isDesbloqueado ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } : {}} transition={{ duration: 3, repeat: Infinity }}>
                              {isBloqueado ? <Lock className="text-white/20" size={40} /> : isUsado ? <Check className="text-emerald-400" size={48} /> : <Sparkles className="text-white" size={48} />}
                            </motion.div>
                          )}
                        </div>

                        <div className="absolute bottom-3 left-0 right-0 text-center">
                          <span className={`text-sm font-medium ${isDesbloqueado || isExtraido ? 'text-white/90' : 'text-white/30'}`}>
                            {isExtraido ? 'En Billetera' : cupon.mes_nombre}
                          </span>
                        </div>

                        {isBloqueado && <div className="absolute inset-0 bg-midnight-950/60 backdrop-blur-[1px]" />}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                key="billetera"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 max-w-2xl mx-auto"
              >
                {cuponesBilletera.length === 0 ? (
                  <div className="text-center py-16 bg-midnight-900/30 rounded-3xl border border-white/5">
                    <Wallet className="mx-auto text-cyan-400/30 mb-4" size={64} />
                    <p className="text-white/50 text-lg">Tu billetera está vacía.</p>
                    <p className="text-white/30 text-sm mt-2">Vuelve al calendario cuando sea tu mes para guardar tus cupones aquí.</p>
                  </div>
                ) : (
                  cuponesBilletera.map((cupon) => {
                    const colors = gemColors[cupon.mes_numero];
                    const isPendiente = cupon.estado === 'pendiente';

                    return (
                      <motion.div
                        key={cupon.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`relative overflow-hidden rounded-2xl border ${isPendiente ? 'border-amber-500/50 bg-amber-950/20' : 'border-purple-500/30 bg-purple-950/20'} backdrop-blur-sm p-6`}
                      >
                        <div className={`absolute top-0 left-0 w-2 h-full bg-gradient-to-b ${colors.bg}`} />
                        <div className="pl-4 flex flex-col md:flex-row gap-6 items-center justify-between">
                          <div className="flex-1 text-center md:text-left">
                            <span className="text-xs font-bold uppercase tracking-wider text-white/50 mb-1 block">Cupón de {cupon.mes_nombre}</span>
                            <h3 className="font-serif text-2xl text-white mb-2">{cupon.titulo_vale}</h3>
                            <p className="text-cyan-100/70 text-sm">{cupon.descripcion}</p>
                          </div>
                          
                          <div className="flex-shrink-0 w-full md:w-auto">
                            {isPendiente ? (
                              <div className="flex flex-col items-center gap-2">
                                <span className="bg-amber-500/20 text-amber-300 text-xs px-3 py-1 rounded-full border border-amber-500/30 flex items-center gap-1">
                                  <Clock size={12} /> Esperando aprobación
                                </span>
                                {user?.username?.toLowerCase() === 'diego' && (
                                  <button onClick={() => cambiarEstado(cupon.id, 'usado')} disabled={isSubmitting} className="w-full mt-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-xl transition-all flex justify-center items-center gap-2">
                                    {isSubmitting ? <Loader2 className="animate-spin" size={16}/> : <><Check size={16}/> Aprobar Canje</>}
                                  </button>
                                )}
                              </div>
                            ) : (
                              <button
                                onClick={() => cambiarEstado(cupon.id, 'pendiente')}
                                disabled={isSubmitting || user?.username?.toLowerCase() === 'diego'} 
                                className={`w-full md:w-auto px-8 py-3 rounded-xl font-bold transition-all flex justify-center items-center gap-2 ${
                                  user?.username?.toLowerCase() === 'diego' ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:scale-105'
                                }`}
                              >
                                {isSubmitting ? <Loader2 className="animate-spin" size={20}/> : <><Sparkles size={20}/> ¡Usar Ahora!</>}
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 }} className="flex flex-wrap justify-center gap-6 mt-12">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-midnight-800/50 border border-white/10 flex items-center justify-center"><Lock size={10} className="text-white/30" /></div>
            <span className="text-white/40 text-sm">Bloqueado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-br from-cyan-500 to-sapphire-600 flex items-center justify-center"><Unlock size={10} className="text-white" /></div>
            <span className="text-cyan-400/70 text-sm">Disponible</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-midnight-800/50 border border-purple-500/30 flex items-center justify-center"><Wallet size={10} className="text-purple-400" /></div>
            <span className="text-purple-400/70 text-sm">En Billetera</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-midnight-800/50 border border-emerald-500/30 flex items-center justify-center"><Check size={10} className="text-emerald-400" /></div>
            <span className="text-emerald-400/70 text-sm">Usado</span>
          </div>
        </motion.div>
      </div>

      {/* Modal Múltiple */}
      <AnimatePresence>
        {selectedCupon && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-950/80 backdrop-blur-sm"
            onClick={handleCerrarModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} transition={{ type: 'spring', stiffness: 300 }}
              className="relative max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 via-sapphire-500 to-azure-500 rounded-3xl blur-xl opacity-50" />
              
              <div className="relative bg-gradient-to-br from-midnight-900 to-sapphire-950 rounded-3xl border border-cyan-400/30 p-8 text-center overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-cyan-500/10 to-transparent" />
                <button onClick={handleCerrarModal} className="absolute top-4 right-4 text-white/50 hover:text-white"><X size={24}/></button>

                {isEditing && user?.username?.toLowerCase() === 'diego' ? (
                  <div className="text-left mt-6">
                    <h3 className="text-cyan-400 font-serif text-2xl mb-6">Editar Cupón de {selectedCupon.mes_nombre}</h3>
                    <input type="text" value={editTitulo} onChange={(e)=>setEditTitulo(e.target.value)} className="w-full bg-midnight-950/50 border border-cyan-500/30 rounded-xl p-3 text-white mb-4 focus:outline-none focus:border-cyan-400" placeholder="Título del cupón"/>
                    <textarea value={editDesc} onChange={(e)=>setEditDesc(e.target.value)} className="w-full h-32 bg-midnight-950/50 border border-cyan-500/30 rounded-xl p-3 text-white mb-6 focus:outline-none focus:border-cyan-400 resize-none" placeholder="Descripción detallada"/>
                    
                    <div className="flex gap-3">
                      <button onClick={()=>setIsEditing(false)} className="flex-1 py-3 rounded-xl bg-white/10 text-white">Cancelar</button>
                      <button onClick={handleGuardarEdicion} disabled={isSubmitting} className="flex-1 py-3 rounded-xl bg-cyan-600 text-white font-bold flex justify-center items-center">
                        {isSubmitting ? <Loader2 className="animate-spin" size={20}/> : 'Guardar Cambios'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }} className="relative mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 to-sapphire-600 flex items-center justify-center mb-6 shadow-neon-cyan mt-4">
                      <Gift className="text-white" size={40} />
                    </motion.div>

                    <p className="text-cyan-300/70 text-sm uppercase tracking-wider mb-2">{selectedCupon.mes_nombre}</p>
                    <h3 className="font-serif text-3xl text-white mb-4">{selectedCupon.titulo_vale}</h3>
                    <p className="text-cyan-100/70 text-lg mb-8">{selectedCupon.descripcion}</p>

                    <div className="space-y-3">
                      {/* MODIFICADO: Lógica de botón de Guardar para Nina (incluye el mes actual) */}
                      {(selectedCupon.estado === 'desbloqueado' || (selectedCupon.mes_numero === currentMonth && selectedCupon.estado === 'bloqueado')) && (
                        <button 
                          onClick={() => cambiarEstado(selectedCupon.id, 'guardado')} 
                          disabled={isSubmitting || user?.username?.toLowerCase() === 'diego'} 
                          className={`w-full py-4 rounded-xl font-bold flex justify-center items-center gap-2 ${user?.username?.toLowerCase() === 'diego' ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:scale-105 transition-all'}`}
                        >
                          {isSubmitting ? <Loader2 className="animate-spin" size={20}/> : <><Wallet size={20}/> {user?.username?.toLowerCase() === 'diego' ? 'Solo Nina puede guardar' : 'Guardar en mi Billetera'}</>}
                        </button>
                      )}

                      {user?.username?.toLowerCase() === 'diego' && (
                        <button onClick={() => setIsEditing(true)} className="w-full py-3 rounded-xl border border-cyan-500/30 text-cyan-400 flex justify-center items-center gap-2 hover:bg-cyan-500/10 transition-colors">
                          <Edit size={18}/> Modificar Sorpresa
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default CalendarioCupones;