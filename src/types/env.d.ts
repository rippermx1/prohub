/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly NG_APP_SUPABASE_URL: string;
  readonly NG_APP_SUPABASE_ANON_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Also ensure process.env is available for Vercel
declare namespace NodeJS {
  interface ProcessEnv {
    NG_APP_SUPABASE_URL: string;
    NG_APP_SUPABASE_ANON_KEY: string;
  }
}
