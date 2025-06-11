// The default development environment also reads from `process.env` so that the
// same variables used in production builds are available locally when running
// the Angular CLI.
export const environment = {
  production: true,
  supabaseUrl: process.env['NG_APP_SUPABASE_URL'] || import.meta.env.NG_APP_SUPABASE_URL || '',
  supabaseAnonKey: process.env['NG_APP_SUPABASE_ANON_KEY'] || import.meta.env.NG_APP_SUPABASE_ANON_KEY || '',
};
