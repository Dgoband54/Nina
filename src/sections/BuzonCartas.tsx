// =============================================================================
// BUZÓN DE CARTAS DUAL - Cartas largas de Diego + Notas rápidas de Nina
// =============================================================================

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// AGREGADO: Importamos Edit y Trash2 para los nuevos botones
import { BookHeart, StickyNote, Send, Heart, Calendar, User, X, Plus, Mail, Loader2, Edit, Trash2 } from 'lucide-react';
import { getCartasYNotas, type CartaONota, supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

const BuzonCartas: React.FC = () => {
  const { user } = useAuth();
  const [cartas, setCartas] = useState<CartaONota[]>([]);
  const [notas, setNotas] = useState<CartaONota[]>([]);
  const [activeTab, setActiveTab] = useState<'cartas' | 'notas'>('cartas');
  
  // Estados de Notas
  const [showNotaForm, setShowNotaForm] = useState(false);
  const [newNota, setNewNota] = useState('');
  const [selectedColor, setSelectedColor] = useState('azul');
  const [editingNotaId, setEditingNotaId] = useState<string | null>(null); // NUEVO

  // Estados de Cartas
  const [cartasAbiertas, setCartasAbiertas] = useState<string[]>([]);
  const [showCartaForm, setShowCartaForm] = useState(false);
  const [newTituloCarta, setNewTituloCarta] = useState('');
  const [newContenidoCarta, setNewContenidoCarta] = useState('');
  const [editingCartaId, setEditingCartaId] = useState<string | null>(null); // NUEVO
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleCarta = (id: string) => {
    if (cartasAbiertas.includes(id)) {
      setCartasAbiertas(cartasAbiertas.filter(cartaId => cartaId !== id));
    } else {
      setCartasAbiertas([...cartasAbiertas, id]);
    }
  };

  const notaColors: Record<string, { bg: string; border: string; text: string }> = {
    azul: { bg: 'bg-cyan-500/20', border: 'border-cyan-400/30', text: 'text-cyan-100' },
    rosa: { bg: 'bg-pink-500/20', border: 'border-pink-400/30', text: 'text-pink-100' },
    amarillo: { bg: 'bg-amber-500/20', border: 'border-amber-400/30', text: 'text-amber-100' },
    verde: { bg: 'bg-emerald-500/20', border: 'border-emerald-400/30', text: 'text-emerald-100' },
    morado: { bg: 'bg-violet-500/20', border: 'border-violet-400/30', text: 'text-violet-100' },
  };

  useEffect(() => {
    const fetchData = async () => {
      const allData = await getCartasYNotas();
      
      if (allData.length === 0) {
        const ejemploCartas: CartaONota[] = [
          {
            id: '1',
            tipo: 'carta',
            titulo: 'Mi Primera Carta Para Ti',
            contenido: 'Querida Nina,\n\nDesde el momento en que te conocí, supe que eras especial. Tu sonrisa ilumina mis días y tu risa es la melodía más hermosa que he escuchado. Quiero que sepas que cada día a tu lado es un regalo que valoro infinitamente.\n\nCon todo mi amor,\nDiego',
            autor: 'Diego',
            fecha_creacion: '2024-02-01T10:00:00Z',
            es_favorito: true,
            leido_por_destinatario: true,
          },
          {
            id: '2',
            tipo: 'carta',
            titulo: 'Un Mes Juntos',
            contenido: 'Mi amor,\n\nHoy cumplimos un mes y no puedo estar más feliz. Cada momento contigo ha sido mágico. Prometo seguir construyendo recuerdos hermosos juntos.\n\nTe amo,\nDiego',
            autor: 'Diego',
            fecha_creacion: '2024-03-01T14:30:00Z',
            es_favorito: false,
            leido_por_destinatario: false,
          },
        ];
        
        const ejemploNotas: CartaONota[] = [
          {
            id: '3',
            tipo: 'nota',
            contenido: 'Hoy me sentí muy feliz cuando me llamaste 💙',
            autor: 'Nina',
            fecha_creacion: '2024-02-15T16:20:00Z',
            es_favorito: false,
            color_nota: 'azul',
            leido_por_destinatario: true,
          },
          {
            id: '4',
            tipo: 'nota',
            contenido: 'Extraño tu abrazo... 🥺',
            autor: 'Nina',
            fecha_creacion: '2024-02-20T09:15:00Z',
            es_favorito: true,
            color_nota: 'rosa',
            leido_por_destinatario: false,
          },
        ];
        
        setCartas(ejemploCartas);
        setNotas(ejemploNotas);
      } else {
        setCartas(allData.filter(item => item.tipo === 'carta'));
        setNotas(allData.filter(item => item.tipo === 'nota'));
      }
    };

    fetchData();
  }, []);

  // ===========================================================================
  // NUEVAS FUNCIONES DE EDICIÓN Y ELIMINACIÓN
  // ===========================================================================
  const handleEditarCarta = (carta: CartaONota) => {
    if (['1', '2'].includes(carta.id)) { alert('Carta de ejemplo. Añade las tuyas.'); return; }
    setEditingCartaId(carta.id);
    setNewTituloCarta(carta.titulo || '');
    setNewContenidoCarta(carta.contenido);
    setShowCartaForm(true);
  };

  const handleEliminarCarta = async (id: string) => {
    if (['1', '2'].includes(id)) { alert('Carta de ejemplo.'); return; }
    if (window.confirm('¿Seguro que quieres borrar esta carta para siempre?')) {
      const { error } = await supabase.from('cartas_y_notas').delete().eq('id', id);
      if (!error) setCartas(cartas.filter(c => c.id !== id));
      else alert('Error al eliminar');
    }
  };

  const handleEditarNota = (nota: CartaONota) => {
    if (['3', '4'].includes(nota.id)) { alert('Nota de ejemplo. Añade las tuyas.'); return; }
    setEditingNotaId(nota.id);
    setNewNota(nota.contenido);
    setSelectedColor(nota.color_nota || 'azul');
    setShowNotaForm(true);
  };

  const handleEliminarNota = async (id: string) => {
    if (['3', '4'].includes(id)) { alert('Nota de ejemplo.'); return; }
    if (window.confirm('¿Seguro que quieres borrar esta notita?')) {
      const { error } = await supabase.from('cartas_y_notas').delete().eq('id', id);
      if (!error) setNotas(notas.filter(n => n.id !== id));
      else alert('Error al eliminar');
    }
  };

  const cerrarModalCarta = () => {
    setShowCartaForm(false);
    setEditingCartaId(null);
    setNewTituloCarta('');
    setNewContenidoCarta('');
  };

  const cerrarModalNota = () => {
    setShowNotaForm(false);
    setEditingNotaId(null);
    setNewNota('');
    setSelectedColor('azul');
  };
  // ===========================================================================

  // MODIFICADO: Capacidad de Insertar o Actualizar Notitas
  const handleSubmitNota = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNota.trim()) return;
    setIsSubmitting(true);

    const notaData = {
      tipo: 'nota',
      contenido: newNota,
      autor: 'Nina',
      es_favorito: false,
      color_nota: selectedColor,
      leido_por_destinatario: false,
    };

    if (editingNotaId) {
      // ACTUALIZAR
      const { data, error } = await supabase.from('cartas_y_notas').update(notaData).eq('id', editingNotaId).select();
      if (!error && data) {
        setNotas(notas.map(n => n.id === editingNotaId ? data[0] : n));
        cerrarModalNota();
      } else alert('Error al actualizar la notita');
    } else {
      // CREAR
      const { data, error } = await supabase.from('cartas_y_notas').insert([notaData]).select();
      if (!error && data) {
        if (notas.length > 0 && ['3', '4'].includes(notas[0].id)) setNotas([data[0]]);
        else setNotas([data[0], ...notas]);
        cerrarModalNota();
      } else alert('Error al enviar la notita');
    }
    setIsSubmitting(false);
  };

  // MODIFICADO: Capacidad de Insertar o Actualizar Cartas
  const handleSubmitCarta = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTituloCarta.trim() || !newContenidoCarta.trim()) return;
    setIsSubmitting(true);

    const cartaData = {
      tipo: 'carta',
      titulo: newTituloCarta,
      contenido: newContenidoCarta,
      autor: 'Diego',
      es_favorito: false,
      leido_por_destinatario: false,
    };

    if (editingCartaId) {
      // ACTUALIZAR
      const { data, error } = await supabase.from('cartas_y_notas').update(cartaData).eq('id', editingCartaId).select();
      if (!error && data) {
        setCartas(cartas.map(c => c.id === editingCartaId ? data[0] : c));
        cerrarModalCarta();
      } else alert('Error al actualizar la carta');
    } else {
      // CREAR
      const { data, error } = await supabase.from('cartas_y_notas').insert([cartaData]).select();
      if (!error && data) {
        if (cartas.length > 0 && ['1', '2'].includes(cartas[0].id)) setCartas([data[0]]);
        else setCartas([data[0], ...cartas]);
        cerrarModalCarta();
      } else alert('Error al guardar la carta');
    }
    setIsSubmitting(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <section id="buzon-cartas" className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-midnight-950 via-cyan-950/10 to-midnight-950" />
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-sapphire-500/5 rounded-full blur-[100px]" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/20 mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <BookHeart className="text-cyan-400" size={18} />
            <span className="text-cyan-300 text-sm font-medium tracking-wide">
              Lo que no te digo, pero escribo
            </span>
          </motion.div>

          <h2 className="font-serif text-5xl md:text-6xl text-white mb-4">
            Buzón de <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sapphire-400">Cartas</span>
          </h2>

          <p className="font-script text-2xl text-cyan-200/60">
            Cartas de amor y notitas del corazón
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex justify-center gap-4 mb-10"
        >
          <button
            onClick={() => setActiveTab('cartas')}
            className={`relative px-8 py-3 rounded-full font-medium transition-all duration-300 ${
              activeTab === 'cartas' ? 'text-white' : 'text-white/50 hover:text-white/70'
            }`}
          >
            {activeTab === 'cartas' && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-sapphire-600 rounded-full"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative flex items-center gap-2">
              <BookHeart size={18} />
              Cartas de Diego
            </span>
          </button>

          <button
            onClick={() => setActiveTab('notas')}
            className={`relative px-8 py-3 rounded-full font-medium transition-all duration-300 ${
              activeTab === 'notas' ? 'text-white' : 'text-white/50 hover:text-white/70'
            }`}
          >
            {activeTab === 'notas' && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-sapphire-600 rounded-full"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative flex items-center gap-2">
              <StickyNote size={18} />
              Notas de Nina
            </span>
          </button>
        </motion.div>

        <AnimatePresence mode="wait">
          {activeTab === 'cartas' ? (
            <motion.div
              key="cartas"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {user?.username === 'diego' && (
                <motion.button
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => setShowCartaForm(true)}
                  className="w-full mb-6 py-4 rounded-2xl border-2 border-dashed border-cyan-400/30 text-cyan-400/70 hover:border-cyan-400/50 hover:text-cyan-400 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={20} />
                  Redactar Nueva Carta
                </motion.button>
              )}

              {cartas.length === 0 ? (
                <div className="text-center py-16">
                  <BookHeart className="mx-auto text-cyan-400/30 mb-4" size={64} />
                  <p className="text-white/50">Aún no hay cartas</p>
                </div>
              ) : (
                cartas.map((carta, index) => (
                  <motion.div
                    key={carta.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative"
                  >
                    {cartasAbiertas.includes(carta.id) ? (
                      /* --- CARTA ABIERTA --- */
                      <motion.div 
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="cursor-pointer"
                        onClick={() => toggleCarta(carta.id)}
                      >
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 to-sapphire-500/20 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-500" />
                        <div className="relative bg-midnight-900/60 backdrop-blur-xl rounded-2xl border border-white/5 p-6 md:p-8">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="font-serif text-2xl text-white mb-1 group-hover:text-cyan-300 transition-colors">
                                {carta.titulo}
                              </h3>
                              <div className="flex items-center gap-4 text-white/40 text-sm">
                                <span className="flex items-center gap-1">
                                  <User size={14} />
                                  {carta.autor}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar size={14} />
                                  {formatDate(carta.fecha_creacion)}
                                </span>
                              </div>
                            </div>
                            {carta.es_favorito && (
                              <Heart className="text-rose-400" size={24} fill="currentColor" />
                            )}
                          </div>
                          <div className="prose prose-invert max-w-none">
                            <p className="text-cyan-100/70 whitespace-pre-line leading-relaxed">
                              {carta.contenido}
                            </p>
                          </div>
                          
                          {/* NUEVO: Botones de Edición para Diego dentro de la carta abierta */}
                          {user?.username === 'diego' && (
                            <div className="flex justify-end gap-4 mt-6 border-t border-white/5 pt-4">
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleEditarCarta(carta); }} 
                                className="text-cyan-400/70 hover:text-cyan-300 transition-colors flex items-center gap-1 text-sm"
                              >
                                <Edit size={16} /> Editar Carta
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleEliminarCarta(carta.id); }} 
                                className="text-red-400/70 hover:text-red-300 transition-colors flex items-center gap-1 text-sm"
                              >
                                <Trash2 size={16} /> Borrar
                              </button>
                            </div>
                          )}

                          <div className="mt-4 text-right">
                            <span className="text-xs text-cyan-500/50 hover:text-cyan-400 transition-colors">Toca para volver a cerrar el sobre</span>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      /* --- SOBRE CERRADO --- */
                      <motion.div 
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => toggleCarta(carta.id)}
                        className="relative bg-gradient-to-br from-midnight-800 to-midnight-900 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-8 cursor-pointer flex flex-col items-center justify-center min-h-[160px] shadow-[0_0_30px_rgba(6,182,212,0.1)] overflow-hidden"
                      >
                        <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-sapphire-600 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)] mb-4">
                          <Mail className="text-white" size={28} />
                        </div>
                        <h3 className="font-serif text-xl text-white text-center mb-1">{carta.titulo}</h3>
                        <div className="flex items-center gap-2 text-white/30 text-xs mb-3">
                          <Calendar size={12} />
                          {formatDate(carta.fecha_creacion)}
                        </div>
                        <span className="text-cyan-400/70 text-sm animate-pulse">Toca para abrir este sobre</span>
                      </motion.div>
                    )}
                  </motion.div>
                ))
              )}
            </motion.div>
          ) : (
            <motion.div
              key="notas"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {(user?.username === 'nina' || user?.username === 'diego') && (
                <motion.button
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => setShowNotaForm(true)}
                  className="w-full mb-6 py-4 rounded-2xl border-2 border-dashed border-cyan-400/30 text-cyan-400/70 hover:border-cyan-400/50 hover:text-cyan-400 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={20} />
                  Escribir una notita
                </motion.button>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {notas.map((nota, index) => {
                  const colors = notaColors[nota.color_nota || 'azul'];
                  return (
                    <motion.div
                      key={nota.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className={`relative p-5 rounded-xl ${colors.bg} border ${colors.border} backdrop-blur-sm flex flex-col`}
                    >
                      {nota.es_favorito && (
                        <Heart className="absolute top-3 right-3 text-rose-400" size={16} fill="currentColor" />
                      )}
                      <p className={`${colors.text} text-sm leading-relaxed mb-3 flex-grow`}>
                        {nota.contenido}
                      </p>
                      <div className="flex items-center justify-between border-t border-white/10 pt-2 mt-2">
                        <span className="text-white/40 text-xs flex items-center gap-1">
                          <Calendar size={12} />
                          {formatDate(nota.fecha_creacion)}
                        </span>
                        <span className="text-white/40 text-xs">{nota.autor}</span>
                      </div>

                      {/* NUEVO: Botones de Edición para Nina en sus notas */}
                      {user?.username === 'nina' && (
                        <div className="flex justify-end gap-3 mt-3 border-t border-white/10 pt-2">
                          <button onClick={() => handleEditarNota(nota)} className="text-white/60 hover:text-white transition-colors flex items-center gap-1 text-xs">
                            <Edit size={12} /> Editar
                          </button>
                          <button onClick={() => handleEliminarNota(nota.id)} className="text-red-400/70 hover:text-red-300 transition-colors flex items-center gap-1 text-xs">
                            <Trash2 size={12} /> Borrar
                          </button>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {notas.length === 0 && (
                <div className="text-center py-16">
                  <StickyNote className="mx-auto text-cyan-400/30 mb-4" size={64} />
                  <p className="text-white/50">Aún no hay notas</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modal para Notita */}
      <AnimatePresence>
        {showNotaForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-950/80 backdrop-blur-sm"
            onClick={cerrarModalNota}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="relative max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 to-sapphire-500 rounded-3xl blur-xl opacity-50" />
              
              <div className="relative bg-midnight-900 rounded-3xl border border-cyan-400/30 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-serif text-xl text-white">
                    {editingNotaId ? 'Editar Notita' : 'Escribir una notita'}
                  </h3>
                  <button onClick={cerrarModalNota} className="text-white/50 hover:text-white transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmitNota}>
                  <textarea
                    value={newNota}
                    onChange={(e) => setNewNota(e.target.value)}
                    placeholder="Escribe lo que sientes..."
                    className="w-full h-32 bg-midnight-800/50 border border-white/10 rounded-xl p-4 text-white placeholder-white/30 resize-none focus:border-cyan-400/50 focus:outline-none transition-colors mb-4"
                    maxLength={200}
                  />

                  <div className="flex items-center gap-2 mb-6">
                    <span className="text-white/50 text-sm">Color:</span>
                    {Object.entries(notaColors).map(([color, styles]) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={`w-8 h-8 rounded-full ${styles.bg} border-2 transition-all ${
                          selectedColor === color ? 'border-white scale-110' : 'border-transparent'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={!newNota.trim() || isSubmitting}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-sapphire-600 text-white font-medium flex items-center justify-center gap-2 disabled:opacity-50 hover:from-cyan-500 hover:to-sapphire-500 transition-colors"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : (
                      <><Send size={18} /> {editingNotaId ? 'Actualizar notita' : 'Enviar notita'}</>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal para Carta Larga */}
      <AnimatePresence>
        {showCartaForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-950/80 backdrop-blur-sm"
            onClick={cerrarModalCarta}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="relative max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 to-sapphire-500 rounded-3xl blur-xl opacity-50" />
              
              <div className="relative bg-midnight-900 rounded-3xl border border-cyan-400/30 p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-serif text-2xl text-white">
                    {editingCartaId ? 'Editar Carta' : 'Redactar Nueva Carta'}
                  </h3>
                  <button onClick={cerrarModalCarta} className="text-white/50 hover:text-white transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmitCarta} className="space-y-4">
                  <input
                    type="text"
                    required
                    value={newTituloCarta}
                    onChange={(e) => setNewTituloCarta(e.target.value)}
                    placeholder="Título de la carta (Ej: Felices 3 meses)"
                    className="w-full bg-midnight-800/50 border border-white/10 rounded-xl p-4 text-white placeholder-white/30 focus:border-cyan-400/50 focus:outline-none transition-colors font-serif text-lg"
                  />
                  
                  <textarea
                    required
                    value={newContenidoCarta}
                    onChange={(e) => setNewContenidoCarta(e.target.value)}
                    placeholder="Escribe todo lo que sientes aquí..."
                    className="w-full h-64 bg-midnight-800/50 border border-white/10 rounded-xl p-4 text-white placeholder-white/30 resize-none focus:border-cyan-400/50 focus:outline-none transition-colors"
                  />

                  <button
                    type="submit"
                    disabled={!newTituloCarta.trim() || !newContenidoCarta.trim() || isSubmitting}
                    className="w-full py-4 mt-2 rounded-xl bg-gradient-to-r from-cyan-600 to-sapphire-600 text-white font-medium flex items-center justify-center gap-2 disabled:opacity-50 hover:from-cyan-500 hover:to-sapphire-500 shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : (
                      <><Mail size={20} /> {editingCartaId ? 'Actualizar Carta' : 'Guardar y Sellar Sobre'}</>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default BuzonCartas;