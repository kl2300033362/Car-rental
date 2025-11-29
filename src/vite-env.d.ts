/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Supabase Configuration (Optional - will use demo mode if not provided)
// VITE_SUPABASE_URL=your_supabase_project_url_here
// VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here