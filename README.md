# Prohub

## Getting Started

1. Install dependencies
   ```bash
   pnpm install
   ```
2. Copy `.env.sample` to `.env` and provide your Supabase credentials
   ```bash
   cp .env.sample .env
   # edit .env with your NG_APP_SUPABASE_URL and NG_APP_SUPABASE_ANON_KEY
   ```
3. Run the development server
   ```bash
   pnpm start
   ```
4. Run unit tests
   ```bash
   pnpm test
   ```
5. Build the project for production
   ```bash
   pnpm build
   ```

This project omits Angular Universal server-side rendering, so the production
build only generates static client files.

