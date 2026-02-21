// =============================================================================
// CONFIGURACIÓN DE SUPABASE
// =============================================================================

import { createClient } from '@supabase/supabase-js';

// Estas variables deben configurarse en las variables de entorno
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Tipos de datos de la base de datos
export interface CancionDedicada {
  id: string;
  titulo: string;
  artista: string;
  link_spotify?: string;
  link_youtube?: string;
  mensaje: string;
  fecha_dedicacion: string;
  dedicado_por: string;
  embed_type: 'spotify' | 'youtube';
  created_at: string;
}

export interface CuponMensual {
  id: string;
  mes_numero: number;
  mes_nombre: string;
  titulo_vale: string;
  descripcion?: string;
  // MODIFICADO: Agregamos los nuevos estados y un 'string' genérico para evitar errores
  estado: 'bloqueado' | 'desbloqueado' | 'usado' | 'guardado' | 'pendiente' | string;
  fecha_desbloqueo?: string;
  fecha_uso?: string;
  icono: string;
  color_gem: string;
}

export interface CartaONota {
  id: string;
  tipo: 'carta' | 'nota';
  titulo?: string;
  contenido: string;
  autor: string;
  fecha_creacion: string;
  es_favorito: boolean;
  color_nota?: string;
  leido_por_destinatario: boolean;
  fecha_lectura?: string;
}

export interface UsuarioPermitido {
  id: string;
  username: string;
  nombre_completo: string;
  es_admin: boolean;
}

// Crear cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// =============================================================================
// FUNCIONES DE AUTENTICACIÓN
// =============================================================================

export const signInWithPassword = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

export const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  return { session, error };
};

// =============================================================================
// FUNCIONES DE CANCIONES DEDICADAS
// =============================================================================

export const getCancionesDedicadas = async (): Promise<CancionDedicada[]> => {
  const { data, error } = await supabase
    .from('canciones_dedicadas')
    .select('*')
    .order('fecha_dedicacion', { ascending: false });
  
  if (error) {
    console.error('Error fetching canciones:', error);
    return [];
  }
  
  return data || [];
};

export const addCancionDedicada = async (cancion: Omit<CancionDedicada, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('canciones_dedicadas')
    .insert([cancion])
    .select()
    .single();
  
  return { data, error };
};

// =============================================================================
// FUNCIONES DE CUPONES MENSUALES
// =============================================================================

export const getCuponesMensuales = async (): Promise<CuponMensual[]> => {
  const { data, error } = await supabase
    .from('cupones_mensuales')
    .select('*')
    .order('mes_numero', { ascending: true });
  
  if (error) {
    console.error('Error fetching cupones:', error);
    return [];
  }
  
  return data || [];
};

// MODIFICADO: También actualizamos aquí para que acepte los nuevos estados
export const updateCuponEstado = async (id: string, estado: 'bloqueado' | 'desbloqueado' | 'usado' | 'guardado' | 'pendiente' | string) => {
  const updates: Partial<CuponMensual> = { estado };
  
  if (estado === 'usado') {
    updates.fecha_uso = new Date().toISOString();
  }
  
  const { data, error } = await supabase
    .from('cupones_mensuales')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  return { data, error };
};

export const getCuponDelMes = async (): Promise<CuponMensual | null> => {
  const currentMonth = new Date().getMonth() + 1; // 1-12
  
  const { data, error } = await supabase
    .from('cupones_mensuales')
    .select('*')
    .eq('mes_numero', currentMonth)
    .single();
  
  if (error) {
    console.error('Error fetching cupon del mes:', error);
    return null;
  }
  
  return data;
};

// =============================================================================
// FUNCIONES DE CARTAS Y NOTAS
// =============================================================================

export const getCartasYNotas = async (tipo?: 'carta' | 'nota'): Promise<CartaONota[]> => {
  let query = supabase
    .from('cartas_y_notas')
    .select('*')
    .order('fecha_creacion', { ascending: false });
  
  if (tipo) {
    query = query.eq('tipo', tipo);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching cartas y notas:', error);
    return [];
  }
  
  return data || [];
};

export const addCartaONota = async (item: Omit<CartaONota, 'id' | 'fecha_creacion'>) => {
  const { data, error } = await supabase
    .from('cartas_y_notas')
    .insert([item])
    .select()
    .single();
  
  return { data, error };
};

export const marcarComoLeido = async (id: string) => {
  const { data, error } = await supabase
    .from('cartas_y_notas')
    .update({
      leido_por_destinatario: true,
      fecha_lectura: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();
  
  return { data, error };
};

// =============================================================================
// SUBSCRIPCIONES EN TIEMPO REAL
// =============================================================================

export const subscribeToNotas = (callback: (payload: any) => void) => {
  return supabase
    .channel('notas-channel')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'cartas_y_notas',
        filter: 'tipo=eq.nota',
      },
      callback
    )
    .subscribe();
};

export const subscribeToCupones = (callback: (payload: any) => void) => {
  return supabase
    .channel('cupones-channel')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'cupones_mensuales',
      },
      callback
    )
    .subscribe();
};