export const environment = {
  production: false,
  supabaseUrl: process.env['NG_APP_SUPABASE_URL'] || import.meta.env.NG_APP_SUPABASE_URL || '',
  supabaseAnonKey: process.env['NG_APP_SUPABASE_ANON_KEY'] || import.meta.env.NG_APP_SUPABASE_ANON_KEY || '',
};
