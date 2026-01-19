
import { createClient } from '@supabase/supabase-js';

/**
 * 🚀 Conexão Arvo x Supabase
 * Configurada com a Publishable Key oficial.
 * Projeto: vflxiyofkrrvhkmuuiwq
 */

const SUPABASE_URL = 'https://vflxiyofkrrvhkmuuiwq.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_k26fQP-YlJUBcOMZ5lWWZw_AUW_XBJj';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
