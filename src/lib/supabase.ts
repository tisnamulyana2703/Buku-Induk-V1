import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Safe fallback so createClient never throws on startup if env vars are missing
const validUrl = supabaseUrl && supabaseUrl.startsWith('http') ? supabaseUrl : 'https://placeholder.supabase.co';
const validKey = supabaseAnonKey || 'placeholder';

export const supabase = createClient(validUrl, validKey);

export const isSupabaseConfigured = (): boolean => {
  return Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'https://placeholder.supabase.co');
};

export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    if (!isSupabaseConfigured()) return false;
    const { error } = await supabase.from('app_store').select('key').limit(1);
    // If table doesn't exist yet, standard REST response still indicates connection works
    if (error && error.code === 'PGRST116') return true;
    return !error || error.code === '42P01'; // 42P01 is table missing but connected
  } catch {
    return false;
  }
};

export const saveAppDataToSupabase = async (key: string, value: any): Promise<{ success: boolean; error?: string }> => {
  try {
    if (!isSupabaseConfigured()) return { success: false, error: 'Variabel Supabase belum dikonfigurasi.' };
    const { error } = await supabase.from('app_store').upsert({ key, value, updated_at: new Date().toISOString() });
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Terjadi kesalahan saat menyimpan ke Supabase.' };
  }
};

export const getAppDataFromSupabase = async (key: string): Promise<any | null> => {
  try {
    if (!isSupabaseConfigured()) return null;
    const { data, error } = await supabase.from('app_store').select('value').eq('key', key).single();
    if (error || !data) return null;
    return data.value;
  } catch {
    return null;
  }
};


