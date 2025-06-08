/* Production environment configuration
 *
 * At build time you should replace the placeholder values below with your
 * actual Supabase project credentials. These values are included in the
 * final client bundle, so ensure secrets are not committed to source
 * control.
 */
export const environment = {
  production: true,
  supabaseUrl: '<YOUR_SUPABASE_URL>',
  supabaseAnonKey: '<YOUR_SUPABASE_ANON_KEY>',
};
