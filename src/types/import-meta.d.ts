interface ImportMetaEnv {
  NG_APP_SUPABASE_URL?: string;
  NG_APP_SUPABASE_ANON_KEY?: string;
  [key: string]: string | undefined;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}