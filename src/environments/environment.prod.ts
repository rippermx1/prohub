// The Angular CLI replaces environment variables at build time. Using
// `process.env` ensures the values are inlined when deploying to Vercel or
// other environments that provide build-time variables.
export const environment = {
  production: true,
  supabaseUrl: process.env['NG_APP_SUPABASE_URL'],
  supabaseAnonKey: process.env['NG_APP_SUPABASE_ANON_KEY'],
};
