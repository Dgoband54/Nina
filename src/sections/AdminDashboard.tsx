import React, { useState } from 'react';
import { supabase } from '../lib/supabase'; // Asegúrate de que esta ruta coincida con tu carpeta lib

export default function AdminDashboard() {
  const [titulo, setTitulo] = useState('');
  const [urlEmbed, setUrlEmbed] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const [exito, setExito] = useState(false);

  const handleGuardarCancion = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setExito(false);

    const { error } = await supabase
      .from('canciones_dedicadas')
      .insert([
        { 
          titulo: titulo, 
          url_embed: urlEmbed, 
          mensaje: mensaje 
        }
      ]);

    setLoading(false);

    if (error) {
      console.error('Error al guardar:', error);
      alert('Hubo un error al guardar la canción.');
    } else {
      setExito(true);
      setTitulo('');
      setUrlEmbed('');
      setMensaje('');
      setTimeout(() => setExito(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-blue-100">
      <header className="mb-10 border-b border-cyan-900/50 pb-6">
        <h1 className="text-4xl font-serif text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
          Centro de Mando
        </h1>
        <p className="text-slate-400 mt-2">Bienvenido, Diego. Prepara las sorpresas aquí.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <div className="bg-slate-900/50 p-6 rounded-2xl border border-cyan-800/30 backdrop-blur-md shadow-lg">
          <h2 className="text-2xl text-blue-300 mb-4 font-semibold">🎵 Dedicar Nueva Canción</h2>
          
          <form onSubmit={handleGuardarCancion} className="space-y-4 flex flex-col">
            <input
              type="text"
              placeholder="Título de la canción"
              className="p-3 rounded-lg bg-slate-800 text-white border border-slate-700 focus:border-cyan-500 focus:outline-none"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
            
            <input
              type="text"
              placeholder="Link de Spotify o YouTube"
              className="p-3 rounded-lg bg-slate-800 text-white border border-slate-700 focus:border-cyan-500 focus:outline-none"
              value={urlEmbed}
              onChange={(e) => setUrlEmbed(e.target.value)}
              required
            />

            <textarea
              placeholder="¿Por qué le dedicas esta canción?"
              rows={3}
              className="p-3 rounded-lg bg-slate-800 text-white border border-slate-700 focus:border-cyan-500 focus:outline-none resize-none"
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              required
            />

            <button 
              type="submit" 
              disabled={loading}
              className="mt-2 p-3 rounded-lg bg-cyan-700 hover:bg-cyan-600 text-white font-bold transition-all disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Subir Canción ✨'}
            </button>

            {exito && <p className="text-green-400 text-center text-sm mt-2">¡Canción guardada con éxito en la base de datos!</p>}
          </form>
        </div>

      </div>
    </div>
  );
}