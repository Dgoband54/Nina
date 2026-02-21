// =============================================================================
// FORO MUSICAL - Grid de tarjetas con canciones dedicadas
// =============================================================================

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// AGREGADO: Importamos Edit y Trash2 para los nuevos botones
import { Music, Heart, Calendar, ExternalLink, Play, Plus, X, Loader2, Edit, Trash2 } from 'lucide-react';
import { getCancionesDedicadas, type CancionDedicada, supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

const ForoMusical: React.FC = () => {
  const [canciones, setCanciones] = useState<CancionDedicada[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // AGREGADO: Estado para saber si estamos editando o creando una nueva
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [newTitulo, setNewTitulo] = useState('');
  const [newArtista, setNewArtista] = useState('');
  const [newLink, setNewLink] = useState('');
  const [newMensaje, setNewMensaje] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // AGREGADO: Función para abrir el modal en modo "Edición"
  const handleEditarClick = (cancion: CancionDedicada) => {
    // Si intenta editar las de prueba, le avisamos
    if (['1', '2', '3'].includes(cancion.id)) {
      alert('Esta es una canción de ejemplo. ¡Añade tus propias canciones desde el botón superior para reemplazar estas!');
      return;
    }
    setEditingId(cancion.id);
    setNewTitulo(cancion.titulo);
    setNewArtista(cancion.artista);
    setNewLink(cancion.link_spotify || '');
    setNewMensaje(cancion.mensaje);
    setIsModalOpen(true);
  };

  // AGREGADO: Función para eliminar una canción de la base de datos
  const handleEliminarClick = async (id: string) => {
    if (['1', '2', '3'].includes(id)) {
      alert('Esta es una canción de ejemplo, desaparecerá sola cuando añadas una tuya.');
      return;
    }
    
    if (window.confirm('¿Estás seguro de que quieres eliminar esta canción?')) {
      const { error } = await supabase.from('canciones_dedicadas').delete().eq('id', id);
      if (!error) {
        setCanciones(canciones.filter(c => c.id !== id));
      } else {
        alert('Error al eliminar la canción');
      }
    }
  };

  // MODIFICADO: Ahora sabe si debe Guardar (Insert) o Actualizar (Update)
  const handleGuardarCancion = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const datosCancion = {
      titulo: newTitulo,
      artista: newArtista,
      link_spotify: newLink,
      mensaje: newMensaje,
      dedicado_por: 'Diego',
      embed_type: 'spotify'
    };

    if (editingId) {
      // ACTUALIZAR CANCIÓN EXISTENTE
      const { data, error } = await supabase
        .from('canciones_dedicadas')
        .update(datosCancion)
        .eq('id', editingId)
        .select();

      if (!error && data) {
        setCanciones(canciones.map(c => c.id === editingId ? data[0] : c));
        cerrarModal();
      } else {
        alert('Error al actualizar');
      }
    } else {
      // CREAR NUEVA CANCIÓN
      const { data, error } = await supabase
        .from('canciones_dedicadas')
        .insert([{ ...datosCancion, fecha_dedicacion: new Date().toISOString().split('T')[0] }])
        .select();

      if (!error && data) {
        // Si teníamos las canciones de prueba (ids 1, 2, 3), las limpiamos al agregar la primera real
        if (canciones.length > 0 && ['1', '2', '3'].includes(canciones[0].id)) {
          setCanciones([data[0]]);
        } else {
          setCanciones([data[0], ...canciones]);
        }
        cerrarModal();
      } else {
        alert('Error al guardar');
      }
    }
    setIsSubmitting(false);
  };

  const cerrarModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setNewTitulo('');
    setNewArtista('');
    setNewLink('');
    setNewMensaje('');
  };

  useEffect(() => {
    const fetchCanciones = async () => {
      const data = await getCancionesDedicadas();
      if (data.length === 0) {
        setCanciones([
          {
            id: '1',
            titulo: 'Perfect',
            artista: 'Ed Sheeran',
            link_spotify: 'https://open.spotify.com/track/0tgVpDi06FyKpA1zm0rEO5',
            mensaje: 'Cada vez que escucho esta canción pienso en ti. Eres perfecta para mí.',
            fecha_dedicacion: '2024-02-14',
            dedicado_por: 'Diego',
            embed_type: 'spotify',
            created_at: '2024-02-14',
          },
          {
            id: '2',
            titulo: 'All of Me',
            artista: 'John Legend',
            link_spotify: 'https://open.spotify.com/track/3U4isOIWM3VvDubwSI3y7a',
            mensaje: 'Todas mis partes te pertenecen, Nina.',
            fecha_dedicacion: '2024-01-20',
            dedicado_por: 'Diego',
            embed_type: 'spotify',
            created_at: '2024-01-20',
          },
          {
            id: '3',
            titulo: 'A Thousand Years',
            artista: 'Christina Perri',
            link_spotify: 'https://open.spotify.com/track/6lanRgr6wXibZr8KgzXxBl',
            mensaje: 'Te he esperado toda mi vida.',
            fecha_dedicacion: '2024-03-01',
            dedicado_por: 'Diego',
            embed_type: 'spotify',
            created_at: '2024-03-01',
          },
        ]);
      } else {
        setCanciones(data);
      }
      setIsLoading(false);
    };

    fetchCanciones();
  }, []);

  const getSpotifyEmbedUrl = (url: string) => {
    const trackId = url.split('/track/')[1]?.split('?')[0];
    return `https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <section id="foro-musical" className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-midnight-950 via-sapphire-950/30 to-midnight-950" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-sapphire-500/5 rounded-full blur-[100px]" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/20 mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <Music className="text-cyan-400" size={18} />
            <span className="text-cyan-300 text-sm font-medium tracking-wide">
              Como suena Nina para mi
            </span>
          </motion.div>

          <h2 className="font-serif text-5xl md:text-6xl text-white mb-4">
            El <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sapphire-400">Foro Musical</span>
          </h2>

          <p className="font-script text-2xl text-cyan-200/60">
            Canciones que te dedico o me recuerdan a ti
          </p>

          {user?.username === 'diego' && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => { setEditingId(null); setIsModalOpen(true); }}
              className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-cyan-600/20 border border-cyan-500/50 text-cyan-300 font-medium hover:bg-cyan-500/30 hover:text-white transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"
            >
              <Plus size={20} />
              Añadir Nueva Canción
            </motion.button>
          )}
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-12 h-12 border-3 border-cyan-400/30 border-t-cyan-400 rounded-full"
            />
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {canciones.map((cancion, index) => (
              <motion.div
                key={cancion.id}
                variants={cardVariants}
                className="group relative"
                onMouseEnter={() => setHoveredId(cancion.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <motion.div
                  className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-sapphire-500 rounded-2xl opacity-0 group-hover:opacity-50 blur-lg transition-opacity duration-500"
                  animate={{ opacity: hoveredId === cancion.id ? 0.5 : 0 }}
                />

                <div className="relative bg-midnight-900/60 backdrop-blur-xl rounded-2xl border border-white/5 overflow-hidden h-full flex flex-col">
                  <div className="absolute top-4 left-4 z-10">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-sapphire-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                      {index + 1}
                    </div>
                  </div>

                  <div className="absolute top-4 right-4 z-10">
                    <motion.div
                      animate={{ scale: hoveredId === cancion.id ? [1, 1.2, 1] : 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Heart
                        className="text-cyan-400/60"
                        size={24}
                        fill={hoveredId === cancion.id ? 'currentColor' : 'none'}
                      />
                    </motion.div>
                  </div>

                  <div className="relative pt-16 pb-4 px-4">
                    <div className="relative rounded-xl overflow-hidden bg-midnight-800/50">
                      {cancion.link_spotify ? (
                        <iframe
                          src={getSpotifyEmbedUrl(cancion.link_spotify)}
                          width="100%"
                          height="152"
                          frameBorder="0"
                          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                          loading="lazy"
                          className="rounded-xl"
                        />
                      ) : (
                        <div className="h-38 flex items-center justify-center bg-midnight-800/50">
                          <Play className="text-cyan-400/50" size={48} />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-6 pt-2 flex-grow flex flex-col">
                    <h3 className="font-serif text-xl text-white mb-1 group-hover:text-cyan-300 transition-colors">
                      {cancion.titulo}
                    </h3>
                    <p className="text-white/50 text-sm mb-4">
                      {cancion.artista}
                    </p>

                    <div className="relative flex-grow">
                      <div className="absolute -left-2 top-0 text-cyan-400/30 text-4xl font-serif">"</div>
                      <p className="text-cyan-100/70 text-sm italic pl-4 pr-2 leading-relaxed">
                        {cancion.mensaje}
                      </p>
                      <div className="absolute -right-1 bottom-0 text-cyan-400/30 text-4xl font-serif">"</div>
                    </div>

                    <div className="flex flex-col mt-6 pt-4 border-t border-white/5">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 text-white/40 text-xs">
                          <Calendar size={14} />
                          <span>{new Date(cancion.fecha_dedicacion).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}</span>
                        </div>
                        <span className="text-cyan-400/60 text-xs font-medium">
                          Dedicado por {cancion.dedicado_por}
                        </span>
                      </div>
                      
                      {/* AGREGADO: Botones de Edición solo para Diego */}
                      {user?.username === 'diego' && (
                        <div className="flex justify-end gap-3 mt-2 border-t border-white/5 pt-3">
                          <button onClick={() => handleEditarClick(cancion)} className="text-cyan-400/70 hover:text-cyan-300 transition-colors flex items-center gap-1 text-xs">
                            <Edit size={14} /> Editar
                          </button>
                          <button onClick={() => handleEliminarClick(cancion.id)} className="text-red-400/70 hover:text-red-300 transition-colors flex items-center gap-1 text-xs">
                            <Trash2 size={14} /> Eliminar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {cancion.link_spotify && (
                    <a
                      href={cancion.link_spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ExternalLink className="text-cyan-400 hover:text-cyan-300" size={18} />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {!isLoading && canciones.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Music className="mx-auto text-cyan-400/30 mb-4" size={64} />
            <p className="text-white/50 text-lg">
              Aún no hay canciones dedicadas
            </p>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && user?.username === 'diego' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-midnight-900 border border-cyan-500/30 rounded-2xl p-6 w-full max-w-lg shadow-[0_0_40px_rgba(6,182,212,0.2)] relative z-50"
            >
              <button
                onClick={cerrarModal}
                className="absolute top-4 right-4 text-white/40 hover:text-cyan-400 transition-colors"
              >
                <X size={24} />
              </button>
              
              {/* MODIFICADO: El título cambia según si editas o creas */}
              <h3 className="text-3xl font-serif text-cyan-400 mb-6 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]">
                {editingId ? 'Editar Dedicatoria' : 'Nueva Dedicatoria'}
              </h3>
              
              <form onSubmit={handleGuardarCancion} className="space-y-4">
                <input
                  type="text"
                  placeholder="Título de la canción"
                  required
                  value={newTitulo}
                  onChange={(e) => setNewTitulo(e.target.value)}
                  className="w-full p-3 rounded-xl bg-midnight-950/50 border border-white/10 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 placeholder:text-white/30"
                />
                <input
                  type="text"
                  placeholder="Artista"
                  required
                  value={newArtista}
                  onChange={(e) => setNewArtista(e.target.value)}
                  className="w-full p-3 rounded-xl bg-midnight-950/50 border border-white/10 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 placeholder:text-white/30"
                />
                <input
                  type="text"
                  placeholder="Link de Spotify (URL normal de la canción)"
                  required
                  value={newLink}
                  onChange={(e) => setNewLink(e.target.value)}
                  className="w-full p-3 rounded-xl bg-midnight-950/50 border border-white/10 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 placeholder:text-white/30"
                />
                <textarea
                  placeholder="¿Por qué le dedicas esta canción?"
                  required
                  rows={3}
                  value={newMensaje}
                  onChange={(e) => setNewMensaje(e.target.value)}
                  className="w-full p-3 rounded-xl bg-midnight-950/50 border border-white/10 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 resize-none placeholder:text-white/30"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 mt-2 rounded-xl bg-gradient-to-r from-cyan-600 to-sapphire-600 hover:from-cyan-500 hover:to-sapphire-500 text-white font-medium transition-all shadow-lg disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : (editingId ? 'Actualizar Canción ✨' : 'Guardar y Dedicar ✨')}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ForoMusical;