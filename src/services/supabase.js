import { createClient } from '@supabase/supabase-js';

// Leer las variables de entorno proporcionadas por Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Inicializar y exportar el cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);